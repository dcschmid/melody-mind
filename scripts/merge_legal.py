#!/usr/bin/env python3
"""
merge_legal.py

Scan `src/i18n/locales/*.legal.ts` and merge any keys that are missing into the
corresponding main locale file `src/i18n/locales/<lang>.ts`.

Behavior:
- By default runs in dry-run mode and prints what would be merged.
- With `--apply` it writes changes to the main locale files.
- With `--delete-legal` it will remove the `.legal.ts` file after a successful merge.
- Always makes a backup copy of the original `.legal.ts` file into a timestamped
  directory under `.i18n-backups/` before performing any destructive action.

Notes:
- The script does not attempt git commits. Run this in a branch and commit the
  changes yourself (recommended).
- The parser is conservative: it extracts top-level string-key entries of the
  exported object. It handles typical i18n files where the module exports an
  object literal containing string keys and string or template string values.
"""

import argparse
import os
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import List, Tuple


ROOT = Path(__file__).resolve().parents[1]  # melody-mind/
LOCALES_DIR = ROOT / "src" / "i18n" / "locales"
BACKUP_BASE = ROOT / ".i18n-backups"


def find_legal_files() -> List[Path]:
    return sorted(LOCALES_DIR.glob("*.legal.ts"))


def read_text(p: Path) -> str:
    return p.read_text(encoding="utf-8")


ENTRY_RE = re.compile(
    r'''
    ("([^"\\]|\\.)+"|'([^'\\]|\\.)+')      # quoted key (group 1)
    \s*:\s*
    (                                      # start value capture (group 4)
      (?:"(?:\\.|[^"\\])*")                # double-quoted string
      |
      '(?:\\.|[^'\\])*'                    # single-quoted string
      |
      `(?:\\.|[^`\\])*`                    # template literal (backticks)
      |
      \{(?:[^{}]|\{[^{}]*\})*\}            # simple object (not deeply nested)
      |
      \[(?:[^\[\]]|\[[^\[\]]*\])*\]        # simple array
    )
    \s*(,)?                                # optional trailing comma
    ''',
    re.VERBOSE | re.S,
)


def extract_entries(body: str) -> List[Tuple[str, str]]:
    """
    From the object body text, extract list of (key, raw_entry_text).
    raw_entry_text includes `"key": value,` exactly as in the body (trimmed).
    """
    entries = []
    for m in ENTRY_RE.finditer(body):
        raw_key = m.group(1)
        # remove surrounding quotes and unescape minimally (we keep as-is for insertion)
        key = raw_key.strip()
        # strip outer quotes for comparison
        keyname = key[1:-1]
        entry_text = m.group(0).rstrip()
        entries.append((keyname, entry_text))
    return entries


def key_exists_in_text(key: str, main_text: str) -> bool:
    # Use a conservative search for "<key>" followed by colon (with optional whitespace)
    pattern = r'["\']' + re.escape(key) + r'["\']\s*:'
    return re.search(pattern, main_text) is not None


def prepare_insert_block(missing_entries: List[str], legal_filename: str) -> str:
    lines = []
    lines.append(f"  // Merged from {legal_filename}")
    for e in missing_entries:
        # ensure proper indentation: 2 spaces as used in repo
        # strip possible leading/trailing whitespace and ensure trailing comma
        entry = e.rstrip().rstrip(",")
        lines.append("  " + entry + ",")
    return "\n".join(lines) + "\n"


def insert_into_main(main_text: str, insert_block: str) -> str:
    """
    Insert `insert_block` before the final closing `\n};` or before last `}` of the export object.
    If not found, append to file end.
    """
    # try to find the last occurrence of a line that starts with `};` or `\n};`
    idx = main_text.rfind("\n};")
    if idx != -1:
        return main_text[:idx] + "\n" + insert_block + main_text[idx:]
    # try to find last `\n}\n` pattern
    idx2 = main_text.rfind("\n}\n")
    if idx2 != -1:
        # find the position of the '}' itself to insert before that
        return main_text[: idx2 + 1] + "\n" + insert_block + main_text[idx2 + 1 :]
    # fallback: append at end
    return main_text + "\n" + insert_block


def ensure_backup_dir() -> Path:
    ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    dest = BACKUP_BASE / f"locales-legal-{ts}"
    dest.mkdir(parents=True, exist_ok=True)
    return dest


def merge_file(legal_path: Path, apply: bool, delete_legal: bool, backup_dir: Path) -> Tuple[int, int]:
    """
    Merge missing entries from legal_path into its corresponding main locale file.

    Returns (added_count, skipped_count).
    """
    main_path = legal_path.with_name(legal_path.name.replace(".legal.ts", ".ts"))
    if not main_path.exists():
        print(f"[SKIP] No main locale file for {legal_path.name} -> expected {main_path.name}")
        return 0, 0

    legal_text = read_text(legal_path)
    main_text = read_text(main_path)

    # extract body
    m_legal = re.search(r"export\s+default\s*\{(.*)\}\s*;?\s*$", legal_text, re.S)
    if not m_legal:
        print(f"[WARN] Could not parse export default object in {legal_path}")
        return 0, 0
    legal_body = m_legal.group(1)

    entries = extract_entries(legal_body)
    if not entries:
        print(f"[INFO] No entries found in {legal_path.name}")
        if apply:
            # remove legal file if requested
            if delete_legal:
                # backup first
                shutil.copy2(str(legal_path), str(backup_dir / legal_path.name))
                legal_path.unlink()
                print(f"[DELETE] Removed empty legal file {legal_path.name} (backup kept)")
        return 0, 0

    missing_raw_entries = []
    skipped = 0
    for key, raw_entry in entries:
        if key_exists_in_text(key, main_text):
            skipped += 1
        else:
            missing_raw_entries.append(raw_entry)

    if not missing_raw_entries:
        print(f"[OK] {main_path.name}: no unique keys to merge from {legal_path.name}.")
        if apply and delete_legal:
            # backup and remove legal file
            shutil.copy2(str(legal_path), str(backup_dir / legal_path.name))
            legal_path.unlink()
            print(f"[DELETE] Removed {legal_path.name} (backup: {backup_dir / legal_path.name})")
        return 0, skipped

    insert_block = prepare_insert_block(missing_raw_entries, legal_path.name)

    print(f"[MERGE] {legal_path.name} -> {main_path.name}: {len(missing_raw_entries)} keys would be added (skipped {skipped})")

    if apply:
        # backup legal file
        shutil.copy2(str(legal_path), str(backup_dir / legal_path.name))
        # create a timestamped copy of main file too (safety)
        shutil.copy2(str(main_path), str(backup_dir / main_path.name))

        new_main = insert_into_main(main_text, insert_block)
        main_path.write_text(new_main, encoding="utf-8")
        print(f"[WRITE] Updated {main_path.name} (backup: {backup_dir / main_path.name})")

        if delete_legal:
            legal_path.unlink()
            print(f"[DELETE] Removed {legal_path.name} (backup: {backup_dir / legal_path.name})")

    return len(missing_raw_entries), skipped


def run(args):
    legal_files = find_legal_files()
    if not legal_files:
        print("[INFO] No .legal.ts files found under", LOCALES_DIR)
        return 0

    print(f"[INFO] Found {len(legal_files)} .legal.ts files. Dry-run={not args.apply}. Delete-legal={args.delete_legal}")

    backup_dir = None
    if args.apply:
        backup_dir = ensure_backup_dir()
        print(f"[INFO] Backups will be written to {backup_dir}")

    total_added = 0
    total_skipped = 0

    for lf in legal_files:
        added, skipped = merge_file(lf, args.apply, args.delete_legal, backup_dir if backup_dir else Path("/dev/null"))
        total_added += added
        total_skipped += skipped

    print(f"[SUMMARY] keys added: {total_added}, keys already present/skipped: {total_skipped}")
    if args.apply:
        print(f"[DONE] Applied changes. Review, run tests and create commits as needed.")
    else:
        print("[DRY-RUN] No files modified. Rerun with --apply to perform changes.")

    return 0


def parse_args():
    p = argparse.ArgumentParser(
        description="Merge *.legal.ts locale helper files into main locale files.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    p.add_argument("--apply", action="store_true", help="Actually write changes. Default is dry-run.")
    p.add_argument(
        "--delete-legal",
        action="store_true",
        help="Remove the *.legal.ts file after successful merge (requires --apply).",
    )
    return p.parse_args()


if __name__ == "__main__":
    args = parse_args()
    if args.delete_legal and not args.apply:
        print("[ERROR] --delete-legal requires --apply. Aborting.")
        sys.exit(2)
    try:
        exit_code = run(args)
    except Exception as e:
        print("[ERROR] Exception occurred:", e)
        raise
    sys.exit(exit_code)
