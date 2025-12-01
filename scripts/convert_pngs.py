#!/usr/bin/env python3
"""
Convert PNG images under public to web-optimized JPEGs.

Usage:
  # dry-run (no files changed)
  python3 scripts/convert_pngs.py

  # actually write JPEGs
  python3 scripts/convert_pngs.py --execute

  # convert and delete original PNGs
  python3 scripts/convert_pngs.py --execute --delete

Options:
  --quality N       JPEG quality (default 85)
  --overwrite       Overwrite existing .jpg files
  --execute         Perform writes (default: dry-run)
  --delete          Delete original PNGs after successful conversion (requires --execute)
"""
from __future__ import annotations
import argparse
from pathlib import Path
from PIL import Image
import sys


def find_pngs(root: Path):
    return list(root.rglob('*.png'))


def convert_one(png_path: Path, quality: int = 85, width: int = None, overwrite: bool = False, execute: bool = False, delete: bool = False):
    out_path = png_path.with_suffix('.jpg')
    if not execute:
        print(f"[DRY RUN] Would convert: {png_path} -> {out_path}")
        return True

    if out_path.exists() and not overwrite:
        print(f"Skipping (exists): {out_path}")
        return False

    try:
        img = Image.open(png_path)
        # If image has alpha, composite over white
        if img.mode in ("RGBA", "LA") or (img.mode == "P" and 'transparency' in img.info):
            alpha = img.convert('RGBA').split()[-1]
            bg = Image.new('RGB', img.size, (255, 255, 255))
            bg.paste(img.convert('RGBA'), mask=alpha)
            img_to_save = bg
        else:
            img_to_save = img.convert('RGB')

        # Resize if width requested (only downscale)
        if execute and width is not None:
            if img_to_save.width > width:
                new_h = round((width / img_to_save.width) * img_to_save.height)
                img_to_save = img_to_save.resize((width, new_h), Image.LANCZOS)

        # Save optimized progressive JPEG suitable for web
        img_to_save.save(
            out_path,
            'JPEG',
            quality=quality,
            optimize=True,
            progressive=True,
        )

        print(f"Converted: {png_path} -> {out_path}")
        if delete:
            png_path.unlink()
            print(f"Deleted: {png_path}")
        return True
    except Exception as exc:
        print(f"Failed: {png_path} -> {out_path}: {exc}")
        return False


def main(argv=None):
    parser = argparse.ArgumentParser(description='Convert PNGs to web-optimized JPEGs')
    parser.add_argument('--execute', '-x', action='store_true', help='Perform writes (default: dry-run)')
    parser.add_argument('--delete', '-d', action='store_true', help='Delete original PNG after successful conversion (requires --execute)')
    parser.add_argument('--overwrite', '-f', action='store_true', help='Overwrite existing JPG files')
    parser.add_argument('--quality', '-q', type=int, default=85, help='JPEG quality (default 85)')
    parser.add_argument('--width', '-w', type=int, default=None, help='Resize width in pixels (maintains aspect ratio). If omitted, original width is kept.')
    parser.add_argument('--root', '-r', type=str, default='public', help='Root folder to search (default public)')
    args = parser.parse_args(argv)

    if args.delete and not args.execute:
        print('Error: --delete requires --execute', file=sys.stderr)
        return 2

    root = Path(args.root)
    if not root.exists():
        print('Root folder not found:', root, file=sys.stderr)
        return 3

    pngs = find_pngs(root)
    if not pngs:
        print('No PNG files found under', root)
        return 0

    print(f'Found {len(pngs)} PNG file(s) under {root}')

    converted = 0
    failed = 0
    for p in pngs:
        ok = convert_one(p, quality=args.quality, width=args.width, overwrite=args.overwrite, execute=args.execute, delete=args.delete)
        if ok:
            converted += 1
        else:
            failed += 1

    print(f"Summary: converted={converted}, failed={failed}")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
