#!/usr/bin/env python3

"""
Crosslink artists and knowledge pages.

Behavior:
- Knowledge -> Artists: add markdown links for artist mentions in body content.
- Artists -> Knowledge: strict-sync relatedArticles to actual mentions only.

Safety:
- --dry-run to preview without writing.
- backup files (.backup) before each write, unless --no-backup.
- atomic writes via temporary file + replace.
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    import yaml
except ImportError:
    print("Error: missing dependency pyyaml. Install with: pip install pyyaml")
    sys.exit(1)


ROOT = Path.cwd()
ARTISTS_DIR = ROOT / "src/content/artists"
KNOWLEDGE_DIR = ROOT / "src/content/knowledge-en"

FRONTMATTER_PATTERN = re.compile(
    r"^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$",
    re.DOTALL,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Crosslink artists and knowledge content")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes only")
    parser.add_argument("--no-backup", action="store_true", help="Skip creating backups")
    parser.add_argument("--force", action="store_true", help="Overwrite existing backups")
    return parser.parse_args()


def read_text(path: Path) -> Optional[str]:
    try:
        return path.read_text(encoding="utf-8")
    except Exception as exc:
        print(f"WARN: failed to read {path}: {exc}")
        return None


def parse_frontmatter(content: str) -> Tuple[Optional[Dict[str, Any]], str]:
    match = FRONTMATTER_PATTERN.match(content)
    if not match:
        return None, content

    frontmatter_raw, body = match.group(1), match.group(2)
    try:
        data = yaml.safe_load(frontmatter_raw)
    except yaml.YAMLError as exc:
        print(f"WARN: yaml parse failed: {exc}")
        return None, body

    if not isinstance(data, dict):
        return None, body
    return data, body


def split_frontmatter_raw(content: str) -> Tuple[Optional[str], str]:
    match = FRONTMATTER_PATTERN.match(content)
    if not match:
        return None, content
    return match.group(1), match.group(2)


def replace_body_preserve_frontmatter(content: str, new_body: str) -> str:
    raw_frontmatter, _ = split_frontmatter_raw(content)
    if raw_frontmatter is None:
        return content
    return f"---\n{raw_frontmatter}\n---\n{new_body}"


def upsert_related_articles_preserve_frontmatter(content: str, slugs: List[str]) -> str:
    raw_frontmatter, body = split_frontmatter_raw(content)
    if raw_frontmatter is None:
        return content

    pattern = re.compile(r"(?m)^relatedArticles:\r?\n(?:[ \t]*-[^\n]*\r?\n?)*")

    if slugs:
        block = "relatedArticles:\n" + "\n".join(f'  - "{slug}"' for slug in slugs) + "\n"
    else:
        block = ""

    if pattern.search(raw_frontmatter):
        updated_frontmatter = pattern.sub(block, raw_frontmatter)
    else:
        if not block:
            updated_frontmatter = raw_frontmatter
        else:
            sep = "" if raw_frontmatter.endswith("\n") else "\n"
            updated_frontmatter = f"{raw_frontmatter}{sep}{block}"

    return f"---\n{updated_frontmatter}\n---\n{body}"


def build_protected_ranges(text: str) -> List[Tuple[int, int]]:
    ranges: List[Tuple[int, int]] = []
    for m in re.finditer(r"```[\s\S]*?```", text):
        ranges.append((m.start(), m.end()))
    for m in re.finditer(r"`[^`\n]+`", text):
        ranges.append((m.start(), m.end()))
    return ranges


def in_ranges(pos: int, ranges: List[Tuple[int, int]]) -> bool:
    for start, end in ranges:
        if start <= pos < end:
            return True
    return False


def create_backup(path: Path, force: bool) -> Tuple[bool, str]:
    backup = Path(f"{path}.backup")
    if backup.exists() and not force:
        return False, f"backup exists: {backup.name} (use --force)"
    try:
        shutil.copy2(path, backup)
        return True, f"backup created: {backup.name}"
    except Exception as exc:
        return False, f"backup failed: {exc}"


def write_atomic(path: Path, content: str) -> Tuple[bool, str]:
    tmp = path.with_suffix(f"{path.suffix}.tmp")
    try:
        tmp.write_text(content, encoding="utf-8")
        tmp.replace(path)
        return True, "ok"
    except Exception as exc:
        return False, f"write failed: {exc}"


def scan_artists() -> List[Dict[str, Any]]:
    artists: List[Dict[str, Any]] = []
    for path in sorted(ARTISTS_DIR.glob("*.md")):
        content = read_text(path)
        if content is None:
            continue
        fm, _body = parse_frontmatter(content)
        if not fm:
            print(f"WARN: skipping {path.name}: no valid frontmatter")
            continue
        name = fm.get("name")
        if not isinstance(name, str) or not name.strip():
            print(f"WARN: skipping {path.name}: missing name")
            continue
        artists.append(
            {
                "slug": path.stem,
                "name": name,
                "path": path,
                "frontmatter": fm,
                "content": content,
            }
        )
    return artists


def parse_knowledge_entry(path: Path) -> Optional[Dict[str, Any]]:
    if path.name.endswith(".backup") or path.name.endswith(".tmp"):
        return None
    content = read_text(path)
    if content is None:
        return None
    fm, body = parse_frontmatter(content)
    if not fm:
        print(f"WARN: skipping {path.name}: no valid frontmatter")
        return None
    title = fm.get("title")
    if not isinstance(title, str) or not title.strip():
        print(f"WARN: skipping {path.name}: missing title")
        return None
    return {
        "slug": path.stem,
        "title": title,
        "path": path,
        "frontmatter": fm,
        "content": content,
        "body": body,
    }


def scan_knowledge() -> List[Dict[str, Any]]:
    entries: List[Dict[str, Any]] = []
    paths = sorted(KNOWLEDGE_DIR.glob("*.mdx")) + sorted(KNOWLEDGE_DIR.glob("*.md"))
    for path in paths:
        entry = parse_knowledge_entry(path)
        if entry is not None:
            entries.append(entry)
    return entries


def add_links_for_artist(name: str, slug: str, body: str) -> Tuple[str, int]:
    protected = build_protected_ranges(body)
    pattern = re.compile(rf"\b{re.escape(name)}\b", re.IGNORECASE)
    url = f"/artists/{slug}"
    added = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal added
        start, end = match.start(), match.end()
        if in_ranges(start, protected):
            return match.group(0)
        before = body[start - 1] if start > 0 else ""
        after = body[end : end + 2]
        if before == "[" and after == "](":
            return match.group(0)
        added += 1
        return f"[{match.group(0)}]({url})"

    return pattern.sub(repl, body), added


def has_mention(name: str, body: str) -> bool:
    protected = build_protected_ranges(body)
    pattern = re.compile(rf"\b{re.escape(name)}\b", re.IGNORECASE)
    for match in pattern.finditer(body):
        if not in_ranges(match.start(), protected):
            return True
    return False


def run_crosslink() -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], Dict[str, int]]:
    artists = scan_artists()
    knowledge_pages = scan_knowledge()

    knowledge_updates: List[Dict[str, Any]] = []
    artist_updates: List[Dict[str, Any]] = []
    summary = {"knowledgeLinksAdded": 0, "artistLinksAdded": 0}

    print()
    print(f"Scanning {len(artists)} artists and {len(knowledge_pages)} knowledge pages")

    for knowledge in knowledge_pages:
        body = knowledge["body"]
        changes: List[str] = []
        for artist in artists:
            body, added = add_links_for_artist(artist["name"], artist["slug"], body)
            if added > 0:
                changes.append(f"added {added} link(s) to {artist['name']}")
                summary["knowledgeLinksAdded"] += added

        if changes:
            knowledge_updates.append(
                {
                    "path": knowledge["path"],
                    "new_content": replace_body_preserve_frontmatter(knowledge["content"], body),
                    "changes": changes,
                }
            )

    for artist in artists:
        existing = artist["frontmatter"].get("relatedArticles", [])
        if not isinstance(existing, list):
            existing = []

        desired: List[str] = []
        for knowledge in knowledge_pages:
            if has_mention(artist["name"], knowledge["body"]):
                desired.append(knowledge["slug"])

        added = [slug for slug in desired if slug not in existing]
        removed = [slug for slug in existing if slug not in desired]
        if not added and not removed:
            continue

        changes = [f"added related article: {slug}" for slug in added]
        changes.extend(f"removed unrelated article: {slug}" for slug in removed)
        summary["artistLinksAdded"] += len(added)

        artist_updates.append(
            {
                "path": artist["path"],
                "new_content": upsert_related_articles_preserve_frontmatter(
                    artist["content"], desired
                ),
                "changes": changes,
            }
        )

    return knowledge_updates, artist_updates, summary


def apply_updates(
    updates: List[Dict[str, Any]],
    label: str,
    dry_run: bool,
    no_backup: bool,
    force: bool,
) -> None:
    if not updates:
        print(f"No {label.lower()} updates")
        return

    for update in updates:
        path: Path = update["path"]
        print()
        print(f"{label}: {path.name}")
        for change in update["changes"]:
            print(f"  - {change}")

        if dry_run:
            print("  - dry-run: no file changes")
            continue

        if not no_backup:
            ok, msg = create_backup(path, force)
            if not ok:
                print(f"  - backup error: {msg}")
                continue
            print(f"  - {msg}")

        ok, msg = write_atomic(path, update["new_content"])
        if not ok:
            print(f"  - {msg}")
            continue
        print("  - file updated")


def main() -> None:
    args = parse_args()

    print("Crosslink artists <-> knowledge")
    print(f"Mode: {'dry-run' if args.dry_run else 'live'}")
    print(f"Backup: {'disabled' if args.no_backup else 'enabled'}")
    print(f"Force backup overwrite: {'enabled' if args.force else 'disabled'}")

    knowledge_updates, artist_updates, summary = run_crosslink()

    print()
    print("Summary")
    print(f"- Knowledge pages to update: {len(knowledge_updates)}")
    print(f"- Artist pages to update: {len(artist_updates)}")
    print(f"- Total artist links to add: {summary['knowledgeLinksAdded']}")
    print(f"- Total related articles added: {summary['artistLinksAdded']}")

    if not knowledge_updates and not artist_updates:
        print("No changes needed")
        return

    print()
    print("Planned changes")
    apply_updates(knowledge_updates, "Knowledge", args.dry_run, args.no_backup, args.force)
    apply_updates(artist_updates, "Artist", args.dry_run, args.no_backup, args.force)


if __name__ == "__main__":
    main()
