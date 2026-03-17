#!/usr/bin/env python3
"""
Convert PNG images under public/images (recursively) into optimized JPGs and delete PNG originals.

Flags:
  --force         Overwrite existing .jpg files.
  --quality N     JPEG quality (default 82, min 40, max 95).
  --move-square   Move files whose basename ends with "-square" into public/square
                 and drop the suffix.
"""
from __future__ import annotations

import argparse
import os
from pathlib import Path
from typing import Iterable, Tuple

from PIL import Image


def log(*args: object) -> None:
    print("[png2jpg]", *args)


def collect_png_files(root: Path) -> Iterable[Path]:
    for dirpath, _, filenames in os.walk(root):
        for name in filenames:
            if name.lower().endswith(".png"):
                yield Path(dirpath) / name


def clamp_quality(value: int) -> int:
    return max(40, min(95, value))


def flatten_to_rgb(img: Image.Image) -> Image.Image:
    if img.mode in ("RGB", "L"):
        return img.convert("RGB")
    if img.mode in ("RGBA", "LA") or ("transparency" in img.info):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[-1])
        return bg
    return img.convert("RGB")


def convert_file(
    png_path: Path,
    quality: int,
    force: bool,
    move_square: bool,
    square_dir: Path,
) -> Tuple[str, int, int]:
    base = png_path.stem
    jpg_path = png_path.with_suffix(".jpg")
    if jpg_path.exists() and not force:
        return ("skipped", 0, 0)

    input_size = png_path.stat().st_size
    with Image.open(png_path) as img:
        rgb = flatten_to_rgb(img)
        rgb.save(
            jpg_path,
            "JPEG",
            quality=quality,
            optimize=True,
            progressive=True,
            subsampling="4:2:0",
        )

    if move_square and base.endswith("-square"):
        square_dir.mkdir(parents=True, exist_ok=True)
        clean_base = base[: -len("-square")]
        target = square_dir / f"{clean_base}.jpg"
        if target.exists() and not force:
            log("Exists, skip move (use --force):", target)
        else:
            jpg_path.replace(target)
            jpg_path = target

    png_path.unlink()
    output_size = jpg_path.stat().st_size
    return ("converted", input_size, output_size)


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert PNGs to JPGs without sharp.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing JPGs")
    parser.add_argument("--quality", type=int, default=82, help="JPEG quality (40-95)")
    parser.add_argument("--move-square", action="store_true", help="Move -square files")
    args = parser.parse_args()

    root = Path.cwd()
    images_root = root / "public" / "images"
    square_dir = root / "public" / "square"
    if not images_root.exists():
        log("Images directory not found:", images_root)
        raise SystemExit(1)

    quality = clamp_quality(args.quality)
    files = list(collect_png_files(images_root))
    if square_dir.exists():
        files.extend(list(collect_png_files(square_dir)))

    log(
        f"Found {len(files)} PNG file(s). Starting conversion (quality={quality})"
        + (" (move-square enabled)" if args.move_square else "")
        + " ..."
    )

    converted = 0
    skipped = 0
    errors = 0
    saved_total = 0
    for f in files:
        try:
            status, input_size, output_size = convert_file(
                f, quality, args.force, args.move_square, square_dir
            )
            if status == "converted":
                converted += 1
                saved_total += max(0, input_size - output_size)
            else:
                skipped += 1
        except Exception as exc:  # noqa: BLE001
            errors += 1
            log("Error:", f, exc)

    log("--- Summary ---")
    log(f"Converted: {converted}")
    log(f"Skipped:   {skipped}")
    log(f"Errors:    {errors}")
    log(f"Size saved: {saved_total / 1024:.1f} KiB")
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
