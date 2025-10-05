#!/usr/bin/env python3
"""Python Image Optimization Pipeline (Dynamic Groups)
=======================================================

Purpose
-------
Generate responsive variants (JPG, WebP, optional AVIF) for images located in
``staging/<group>/`` and emit them to ``src/assets/<group>/<slug>/``.

Dynamic Groups
--------------
Instead of a hard‑coded GROUPS map this script now discovers every directory
directly under ``staging/`` at runtime and treats its name as a group
(e.g. ``category``, ``podcast``, ``homecategories``, ``playlist`` ...). You can
still restrict processing to a single group via ``--group <name>``.

Output Files per slug (example slug "rock"):
    rock-240.jpg / .webp / .avif (if AVIF supported)
    rock-480.*
    rock-720.*
    rock-960.*
    rock.jpg   (canonical, max bounded)
    rock.webp  (canonical)
    rock.avif  (canonical, if supported)

Features:
    * Slugification aligned with JS counterpart
    * Multiple widths, no upscaling beyond source width
    * Freshness skip (<7 days) unless --force
    * Canonical max width (default 1200px)
    * Optional source cleanup (--cleanup)
    * Dry-run simulation (--dry-run)
    * Parallel execution (--workers)
    * Dynamic group discovery (--all)

Prerequisites:
    pip install Pillow
    (Optional) pip install pillow-avif-plugin   # enables AVIF

Examples:
    python scripts/optimize_images.py --group podcast
    python scripts/optimize_images.py --group category --force --cleanup
    python scripts/optimize_images.py --all --dry-run

Notes:
    * Place raw source images (jpg/png) inside staging/<group>/.
    * For RSS feeds that require a stable JPG path (/podcast/<slug>.jpg) keep
        originals in public/ or copy canonical JPG there separately – this script
        does NOT touch public/.
    * The site runtime consumes generated variants from src/assets via Astro
        import globs (see optimizedImageVariants.ts).
"""

from __future__ import annotations

import argparse
import concurrent.futures
import os
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional

try:
    from PIL import Image  # type: ignore
except ImportError:
    print("[optimize-images-py] Pillow nicht installiert. Bitte: pip install Pillow", file=sys.stderr)
    sys.exit(1)

# Optional AVIF Unterstützung
AVIF_SUPPORTED = False
try:  # pragma: no cover - optional
    import pillow_avif  # type: ignore  # noqa: F401
    AVIF_SUPPORTED = True
except Exception:  # pragma: no cover - optional
    AVIF_SUPPORTED = False


FRESH_AGE_SECONDS = 7 * 24 * 60 * 60  # 7 days freshness window


@dataclass
class GroupConfig:
    name: str
    staging_dir: Path
    out_base: Path
    widths: List[int]
    canonical_max: int
    jpeg_quality: int = 78
    webp_quality: int = 72
    avif_quality: int = 45  # Lower value often sufficient; adjust if needed


ROOT = Path(__file__).resolve().parent.parent

DEFAULT_WIDTHS = [240, 480, 720, 960]
DEFAULT_CANONICAL_MAX = 1200


def discover_group_names(staging_root: Path) -> list[str]:
    if not staging_root.exists():
        return []
    names = [p.name for p in staging_root.iterdir() if p.is_dir()]
    # Deterministic order
    return sorted(names)


def build_group_config(name: str) -> GroupConfig:
    return GroupConfig(
        name=name,
        staging_dir=ROOT / "staging" / name,
        out_base=ROOT / "src" / "assets" / name,
        widths=DEFAULT_WIDTHS,
        canonical_max=DEFAULT_CANONICAL_MAX,
    )


def build_selected_configs(requested_group: Optional[str], all_flag: bool) -> list[GroupConfig]:
    staging_root = ROOT / "staging"
    discovered = discover_group_names(staging_root)
    configs: list[GroupConfig] = []

    if requested_group:
        # Allow specifying a group even if the directory does not exist yet (created lazily)
        configs.append(build_group_config(requested_group))
        return configs

    if all_flag:
        if not discovered:
            # Nothing discovered; still return empty list so caller can handle gracefully
            return []
        for name in discovered:
            configs.append(build_group_config(name))
        return configs

    # Should not reach here because CLI enforces one of --group / --all
    return configs


def slugify(name: str) -> str:
    import re
    s = name.lower()
    s = s.replace("&", "and")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-{2,}", "-", s)
    s = s.strip("-")
    return s


def is_fresh(p: Path) -> bool:
    if not p.exists():
        return False
    age = time.time() - p.stat().st_mtime
    return age < FRESH_AGE_SECONDS


def load_image(path: Path) -> Optional[Image.Image]:  # pragma: no cover - IO
    try:
        return Image.open(path)
    except Exception as e:  # noqa: BLE001
        print(f"[warn] Kann Bild nicht öffnen {path.name}: {e}")
        return None


def resize(img: Image.Image, target_w: int) -> Image.Image:
    if img.width <= target_w:
        return img
    ratio = target_w / img.width
    target_h = int(img.height * ratio)
    return img.resize((target_w, target_h), Image.LANCZOS)


def save_variant(img: Image.Image, base_dir: Path, base_name: str, width: Optional[int], cfg: GroupConfig, force: bool, stats: dict):  # noqa: D401
    """Persist one size variant in JPG, WebP (+ optional AVIF).

    Args:
        img: Source (possibly already resized) Pillow image.
        base_dir: Target directory for all variants of the slug.
        base_name: Slug (without extension / width).
        width: Specific width or None for canonical size.
        cfg: Group configuration.
        force: Re-render even if fresh.
        stats: Shared stats dict to update counters.
    """
    if width is None:
        stem = base_name
    else:
        stem = f"{base_name}-{width}"
    jpg_path = base_dir / f"{stem}.jpg"
    webp_path = base_dir / f"{stem}.webp"
    avif_path = base_dir / f"{stem}.avif"

    targets = [jpg_path, webp_path]
    if AVIF_SUPPORTED:
        targets.append(avif_path)

    if not force and all(is_fresh(t) for t in targets if t.suffix != '.avif' or AVIF_SUPPORTED):
        stats["skipped_fresh"] += 1
        return

    # Re-Resize falls width spezifisch
    output_img = img if width is None else resize(img, width)

    try:
        # JPG
        output_img.save(
            jpg_path,
            format="JPEG",
            quality=cfg.jpeg_quality,
            optimize=True,
            progressive=True,
        )
        # WebP
        output_img.save(webp_path, format="WEBP", quality=cfg.webp_quality, method=6)
        if AVIF_SUPPORTED:
            output_img.save(avif_path, format="AVIF", quality=cfg.avif_quality)  # type: ignore[arg-type]
        stats["generated"] += 1  # jpg
        stats["generated"] += 1  # webp
        if AVIF_SUPPORTED:
            stats["generated"] += 1
    except Exception as exc:  # noqa: BLE001
        stats["failed"] += 1
        print(f"[fail] {stem}: {exc}")


def process_file(path_in: Path, cfg: GroupConfig, force: bool, cleanup: bool, dry_run: bool) -> dict:
    stats = {"source": path_in.name, "generated": 0, "failed": 0, "skipped_fresh": 0, "cleaned": False}
    base_no_ext = path_in.stem
    slug = slugify(base_no_ext)
    out_dir = cfg.out_base / slug
    if not dry_run:
        out_dir.mkdir(parents=True, exist_ok=True)

    if dry_run:
        # Simuliere nur Zählung (Anzahl Varianten hängt von AVIF)
        variants_count = len(cfg.widths) + 1  # canonical + widths
        per_variant_formats = 2 + (1 if AVIF_SUPPORTED else 0)
        stats["generated"] = variants_count * per_variant_formats
        return stats

    img = load_image(path_in)
    if img is None:
        return stats

    # Width variants
    for w in cfg.widths:
        save_variant(img, out_dir, slug, w, cfg, force, stats)
    # Canonical (bounded by canonical_max)
    canonical_img = resize(img, cfg.canonical_max)
    save_variant(canonical_img, out_dir, slug, None, cfg, force, stats)

    if cleanup:
        try:
            path_in.unlink()
            stats["cleaned"] = True
        except Exception as e:  # noqa: BLE001
            print(f"[warn] Cleanup fehlgeschlagen {path_in.name}: {e}")
    return stats


def gather_sources(cfg: GroupConfig) -> List[Path]:
    if not cfg.staging_dir.exists():
        return []
    return [p for p in cfg.staging_dir.iterdir() if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png"}]


def optimize_group(cfg: GroupConfig, force: bool, cleanup: bool, dry_run: bool, workers: int) -> dict:
    sources = gather_sources(cfg)
    group_stats = {
        "group": cfg.name,
        "total_sources": len(sources),
        "processed": 0,
        "generated": 0,
        "failed": 0,
        "skipped_fresh": 0,
        "cleaned": 0,
        "details": [],  # type: ignore[list-item]
        "avif": AVIF_SUPPORTED,
    }
    if not sources:
        return group_stats

    def task(p: Path):
        return process_file(p, cfg, force, cleanup, dry_run)

    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as ex:
        for res in ex.map(task, sources):
            group_stats["processed"] += 1
            group_stats["generated"] += res["generated"]
            group_stats["failed"] += res["failed"]
            group_stats["skipped_fresh"] += res["skipped_fresh"]
            group_stats["cleaned"] += 1 if res["cleaned"] else 0
            group_stats["details"].append(res)
    return group_stats


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Optimiert Bilder (JPG/WebP/optional AVIF) aus staging/* (dynamische Gruppen).")
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--group", help="Nur diese Gruppe verarbeiten (auch wenn noch leer)")
    g.add_argument("--all", action="store_true", help="Alle aktuell in staging/ vorhandenen Gruppen verarbeiten")
    p.add_argument("--force", action="store_true", help="Varianten immer neu rendern")
    p.add_argument("--cleanup", action="store_true", help="Originale nach Erfolg löschen")
    p.add_argument("--dry-run", action="store_true", help="Nur Simulation")
    p.add_argument("--workers", type=int, default=min(4, os.cpu_count() or 2), help="Parallelität")
    return p.parse_args()


def main() -> int:
    args = parse_args()
    configs = build_selected_configs(args.group, args.all)
    if not configs:
        print("[py-optimize] Keine Gruppen gefunden (staging leer?).", file=sys.stderr)
        return 0

    reports = []
    for cfg in configs:
        cfg.out_base.mkdir(parents=True, exist_ok=True)
        cfg.staging_dir.mkdir(parents=True, exist_ok=True)
        print(f"[py-optimize] Gruppe {cfg.name} ...")
        rep = optimize_group(cfg, force=args.force, cleanup=args.cleanup, dry_run=args.dry_run, workers=args.workers)
        reports.append(rep)
        print(
            f"[py-optimize] {cfg.name} => processed={rep['processed']} generated={rep['generated']} failed={rep['failed']} "
            f"skippedFresh={rep['skipped_fresh']} cleaned={rep['cleaned']} avif={rep['avif']}"
        )

    # Consolidated report
    out_dir = ROOT / "tmp"
    out_dir.mkdir(exist_ok=True)
    report_path = out_dir / "image-optimization-python.json"
    try:
        import json
        import datetime

        with report_path.open("w", encoding="utf-8") as f:
            json.dump(
                {
                    "generatedAt": datetime.datetime.utcnow().isoformat() + "Z",
                    "reports": reports,
                    "avifSupported": AVIF_SUPPORTED,
                    "dryRun": args.dry_run,
                },
                f,
                indent=2,
            )
        print("[py-optimize] Report:", report_path)
    except Exception as e:  # noqa: BLE001
        print("[py-optimize] Report schreiben fehlgeschlagen:", e)
    return 0


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
