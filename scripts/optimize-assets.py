"""Generate downscaled derivatives of the diorama raster assets.

The SVG generator emits a `__ASSET__<file>__` token per image (see
`scripts/generate-geometry.mjs`); `src/App.vue` maps each token to the
Vite-hashed URL of the matching file in `src/assets/serve/`.

This script fills `src/assets/serve/` from the full-resolution masters in
`src/assets/`. Only assets actually referenced by the generator are copied;
masters are NEVER written or moved. Each derivative keeps its exact aspect
ratio and alpha channel, and is downscaled so its longest side is at most
`MAX_SIDE` px (never upscaled). Rerunning is idempotent.

Derivatives are committed so the site build and CI need no image tooling;
run this only after changing a master or adding a referenced asset:

    python scripts/optimize-assets.py
"""
from __future__ import annotations

import io
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "src" / "assets"
SERVE = ASSETS / "serve"
GEOM = ROOT / "scripts" / "generate-geometry.mjs"

MAX_SIDE = 768
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

# Names the generator references: `inlineAsset('x')` and `file: 'x'`.
REF_RE = re.compile(r"(?:inlineAsset\(\s*|file:\s*)'([^']+)'")


def referenced_names() -> list[str]:
    text = GEOM.read_text(encoding="utf-8")
    seen: list[str] = []
    for name in REF_RE.findall(text):
        if name not in seen:
            seen.append(name)
    return seen


def resize(im: Image.Image, cap: int) -> Image.Image:
    longest = max(im.size)
    if longest <= cap:
        return im
    scale = cap / longest
    size = (max(1, round(im.width * scale)), max(1, round(im.height * scale)))
    return im.resize(size, Image.Resampling.LANCZOS)


def main() -> int:
    referenced = referenced_names()
    masters = {p.name: p for p in ASSETS.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS}

    missing = [n for n in referenced if n not in masters]
    unreferenced = sorted(set(masters) - set(referenced))

    SERVE.mkdir(parents=True, exist_ok=True)

    total_src = total_dst = 0
    for name in referenced:
        src = masters.get(name)
        if src is None:
            print(f"  MISSING  {name} (referenced but not in src/assets/)")
            continue
        dst = SERVE / name
        with Image.open(src) as im:
            out = resize(im, MAX_SIDE)
            if out.size == im.size:
                data = None  # no resize: keep the master's own bytes
            else:
                buf = io.BytesIO()
                if name.lower().endswith((".jpg", ".jpeg")):
                    out.convert("RGB").save(
                        buf, "JPEG", quality=82, optimize=True, progressive=True
                    )
                else:
                    if out.mode not in ("RGB", "RGBA", "L", "LA", "P"):
                        out = out.convert("RGBA")
                    out.save(buf, "PNG", optimize=True)
                data = buf.getvalue()
        master_bytes = src.read_bytes()
        # Never ship a derivative that is larger than the master (Pillow's PNG
        # encoder can lose to whatever originally compressed the sprite): fall
        # back to the master bytes, even if that forfeits the downscale.
        dst.write_bytes(data if data is not None and len(data) < len(master_bytes) else master_bytes)
        s, d = len(master_bytes), dst.stat().st_size
        total_src += s
        total_dst += d
        pct = 100 * (1 - d / s) if s else 0
        print(
            f"  {name:<28} {im_size(src):>11} -> {im_size(dst):>11}  "
            f"{s // 1024:>5} KB -> {d // 1024:>4} KB  ({pct:>4.0f}% off)"
        )

    # Drop stale derivatives whose masters/references are gone.
    for stale in SERVE.iterdir():
        if stale.is_file() and stale.name not in referenced:
            stale.unlink()
            print(f"  removed stale derivative {stale.name}")

    print()
    print(f"referenced: {len(referenced)}  written: {len(referenced) - len(missing)}")
    if unreferenced:
        print(f"unreferenced masters kept as-is: {', '.join(unreferenced)}")
    if missing:
        print(f"WARNING: referenced assets with no master: {', '.join(missing)}")
    print(
        f"serve/ total: {total_dst // 1024} KB "
        f"(masters {total_src // 1024} KB, {100 * (1 - total_dst / total_src):.0f}% off)"
    )
    return 1 if missing else 0


def im_size(p: Path) -> str:
    with Image.open(p) as im:
        return f"{im.width}x{im.height}"


if __name__ == "__main__":
    sys.exit(main())
