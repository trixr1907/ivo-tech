#!/usr/bin/env python3
"""
Generate ivo-tech logo system assets:
- Wordmark/Submark raster exports
- Favicon from submark
- Route SVGs + master SVG/AI placeholder
- 3D STL + GLB brand assets
- 4s logo sting video (mp4/webm) + poster png + captions vtt
"""

from __future__ import annotations

import json
import math
import struct
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = ROOT / "public" / "assets"
VIDEO_DIR = ASSETS_DIR / "video"
BRAND_DIR = ASSETS_DIR / "brand"
DESIGN_LOGO_DIR = ROOT / "design" / "logo"
ROUTES_DIR = DESIGN_LOGO_DIR / "routes"


def load_font(size: int, italic: bool = False, bold: bool = True) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates: list[str] = []
    if bold and italic:
        candidates.extend(
            [
                "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-BoldOblique.ttf",
                "/usr/share/fonts/truetype/liberation2/LiberationSans-BoldItalic.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-BoldOblique.ttf",
                "/usr/share/fonts/TTF/DejaVuSans-BoldOblique.ttf",
                "/mnt/c/Windows/Fonts/arialbi.ttf",
                "/mnt/c/Windows/Fonts/segoeuib.ttf",
            ]
        )
    elif bold:
        candidates.extend(
            [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
                "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
                "/mnt/c/Windows/Fonts/arialbd.ttf",
                "/mnt/c/Windows/Fonts/segoeuib.ttf",
            ]
        )
    else:
        candidates.extend(
            [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                "/usr/share/fonts/TTF/DejaVuSans.ttf",
                "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
                "/mnt/c/Windows/Fonts/arial.ttf",
                "/mnt/c/Windows/Fonts/segoeui.ttf",
            ]
        )
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def ensure_dirs() -> None:
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    ROUTES_DIR.mkdir(parents=True, exist_ok=True)


def write_route_svgs() -> None:
    route_a = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#04060d"/>
  <text x="160" y="510" fill="#3ce9ff" font-size="290" font-family="Space Grotesk, DejaVu Sans, sans-serif" font-weight="700" letter-spacing="12">ivo-tech</text>
  <line x1="160" y1="575" x2="1420" y2="575" stroke="#3ce9ff" stroke-opacity="0.42" stroke-width="10"/>
  <text x="164" y="635" fill="#8ea5c9" font-size="44" font-family="Inter, DejaVu Sans, sans-serif">Route A • technisch-konstruiert</text>
</svg>
"""
    route_b = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#04060d"/>
  <g transform="skewX(-14)">
    <text x="250" y="520" fill="#00eaff" font-size="300" font-family="Space Grotesk, DejaVu Sans, sans-serif" font-weight="700" letter-spacing="10">ivo-tech</text>
  </g>
  <polygon points="268,610 484,548 504,576 290,640" fill="#04060d"/>
  <polygon points="548,610 764,548 784,576 570,640" fill="#04060d"/>
  <polygon points="930,610 1146,548 1166,576 952,640" fill="#04060d"/>
  <line x1="170" y1="590" x2="1430" y2="590" stroke="#00eaff" stroke-opacity="0.5" stroke-width="8"/>
  <text x="164" y="655" fill="#8ea5c9" font-size="44" font-family="Inter, DejaVu Sans, sans-serif">Route B • aggressive futuristic (Master)</text>
</svg>
"""
    (ROUTES_DIR / "ivo-tech-logo-route-a.svg").write_text(route_a, encoding="utf-8")
    (ROUTES_DIR / "ivo-tech-logo-route-b.svg").write_text(route_b, encoding="utf-8")

    master_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 1200">
  <rect width="2000" height="1200" fill="#04060d"/>
  <g transform="translate(140,260)">
    <rect x="0" y="0" width="1720" height="540" fill="none" stroke="#8ea5c9" stroke-opacity="0.3" stroke-width="4" stroke-dasharray="12 12"/>
    <g transform="skewX(-14)">
      <text x="180" y="356" fill="#00eaff" font-size="320" font-family="Space Grotesk, DejaVu Sans, sans-serif" font-weight="700" letter-spacing="10">ivo-tech</text>
    </g>
    <polygon points="218,438 472,364 492,394 240,470" fill="#04060d"/>
    <polygon points="556,438 810,364 830,394 578,470" fill="#04060d"/>
    <polygon points="982,438 1236,364 1256,394 1004,470" fill="#04060d"/>
    <line x1="40" y1="486" x2="1680" y2="486" stroke="#00eaff" stroke-opacity="0.42" stroke-width="7"/>
  </g>
  <text x="144" y="920" fill="#ebf1ff" font-size="54" font-family="Inter, DejaVu Sans, sans-serif">ivo-tech — Master Wordmark v1</text>
  <text x="144" y="986" fill="#9aa8cb" font-size="36" font-family="Inter, DejaVu Sans, sans-serif">Clearspace: 0.5x x-height • Min size digital: 90px width</text>
  <text x="144" y="1040" fill="#9aa8cb" font-size="36" font-family="Inter, DejaVu Sans, sans-serif">Primary color: #00EAFF</text>
</svg>
"""
    (DESIGN_LOGO_DIR / "ivo-tech-logo-master.svg").write_text(master_svg, encoding="utf-8")

    ai_eps = """%!PS-Adobe-3.0 EPSF-3.0
%%Creator: ivo-tech logo generator
%%Title: ivo-tech-logo-master.ai
%%BoundingBox: 0 0 2000 1200
%%LanguageLevel: 2
%%EndComments
/Helvetica-BoldOblique findfont 320 scalefont setfont
0.0 0.92 1.0 setrgbcolor
200 620 moveto
(ivo-tech) show
0.58 0.66 0.79 setrgbcolor
/Helvetica findfont 64 scalefont setfont
200 280 moveto
(ivo-tech master placeholder for Adobe Illustrator workflow) show
showpage
%%EOF
"""
    (DESIGN_LOGO_DIR / "ivo-tech-logo-master.ai").write_text(ai_eps, encoding="utf-8")

    usage_md = """# ivo-tech Logo Regeln (v1)

## Varianten
- Primary Cyan auf Dark
- Monochrom Hell
- Monochrom Dunkel
- Invertiert
- Submark fuer kleine Flaechen

## Mindestgroesse
- Wordmark: 90 px Breite
- Submark: 16 px fuer Favicon

## Clearspace
- 0.5x x-Hoehe rund um die Wortmarke

## Verbotene Anwendungen
- Kein Verzerren
- Kein ueberstarkes Glow
- Keine Magenta-Primärvariante
- Keine Farbverlaeufe ausserhalb definierter Exporte
"""
    (DESIGN_LOGO_DIR / "usage-rules.md").write_text(usage_md, encoding="utf-8")


def _mask_to_rgba(mask: Image.Image, top_rgb: tuple[int, int, int], bottom_rgb: tuple[int, int, int]) -> Image.Image:
    w, h = mask.size
    gradient = np.zeros((h, w, 4), dtype=np.uint8)
    y = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    for i, (top_v, bot_v) in enumerate(zip(top_rgb, bottom_rgb)):
        gradient[:, :, i] = (top_v * (1 - y) + bot_v * y).astype(np.uint8)
    gradient[:, :, 3] = np.array(mask, dtype=np.uint8)
    return Image.fromarray(gradient, mode="RGBA")


def render_wordmark_png(path: Path, mode: str = "primary") -> Image.Image:
    w, h = 2400, 920
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    font = load_font(360, italic=True, bold=True)
    draw.text((170, 225), "ivo-tech", font=font, fill=255)

    # Aggressive skew and slanted cuts for futuristic wordmark.
    mask = mask.transform((w, h), Image.Transform.AFFINE, (1, -0.22, 140, 0, 1, 0), resample=Image.Resampling.BICUBIC)

    cut = Image.new("L", (w, h), 0)
    cdraw = ImageDraw.Draw(cut)
    cdraw.polygon([(470, 690), (820, 588), (845, 625), (500, 730)], fill=255)
    cdraw.polygon([(840, 690), (1190, 588), (1215, 625), (870, 730)], fill=255)
    cdraw.polygon([(1300, 690), (1650, 588), (1675, 625), (1330, 730)], fill=255)
    mask = ImageChops.subtract(mask, cut)

    if mode == "primary":
        base = _mask_to_rgba(mask, (90, 244, 255), (0, 178, 235))
    elif mode == "mono-light":
        base = _mask_to_rgba(mask, (242, 248, 255), (224, 236, 252))
    elif mode == "mono-dark":
        base = _mask_to_rgba(mask, (14, 22, 38), (20, 32, 52))
    else:  # invert
        base = _mask_to_rgba(mask, (0, 234, 255), (0, 165, 218))

    if mode == "primary":
        glow = Image.new("RGBA", (w, h), (0, 234, 255, 0))
        glow.putalpha(mask.filter(ImageFilter.GaussianBlur(12)))
        base = Image.alpha_composite(glow, base)

    base.save(path)
    return base


def render_submark_png(path: Path, mode: str = "primary") -> Image.Image:
    size = 1024
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)

    # Stem + dot (slanted lowercase i impression)
    draw.polygon([(260, 350), (410, 305), (455, 782), (304, 826)], fill=255)
    draw.polygon([(300, 184), (404, 154), (430, 270), (326, 300)], fill=255)

    # Futuristic chevron accent as differentiator.
    draw.polygon([(540, 354), (838, 476), (774, 546), (476, 424)], fill=255)
    draw.polygon([(540, 520), (838, 642), (774, 712), (476, 590)], fill=255)

    # Create an internal cut to keep mark crisp in small sizes.
    cut = Image.new("L", (size, size), 0)
    cdraw = ImageDraw.Draw(cut)
    cdraw.polygon([(598, 445), (722, 495), (692, 530), (566, 480)], fill=255)
    mask = ImageChops.subtract(mask, cut)

    if mode == "primary":
        base = _mask_to_rgba(mask, (94, 245, 255), (0, 180, 236))
    elif mode == "mono-light":
        base = _mask_to_rgba(mask, (245, 250, 255), (226, 236, 250))
    elif mode == "mono-dark":
        base = _mask_to_rgba(mask, (16, 24, 38), (22, 34, 52))
    else:  # invert
        base = _mask_to_rgba(mask, (0, 230, 248), (0, 164, 216))

    if mode == "primary":
        glow = Image.new("RGBA", (size, size), (0, 234, 255, 0))
        glow.putalpha(mask.filter(ImageFilter.GaussianBlur(9)))
        base = Image.alpha_composite(glow, base)

    base.save(path)
    return base


def generate_favicon(mark_image: Image.Image, path: Path) -> None:
    resized = mark_image.resize((256, 256), Image.Resampling.LANCZOS)
    resized.save(path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])


def _face_normal(a: np.ndarray, b: np.ndarray, c: np.ndarray) -> np.ndarray:
    n = np.cross(b - a, c - a)
    norm = np.linalg.norm(n)
    if norm == 0:
        return np.array([0.0, 0.0, 1.0], dtype=np.float32)
    return n / norm


def _add_box(vertices: list[tuple[float, float, float]], faces: list[tuple[int, int, int]], x1: float, x2: float, y1: float, y2: float, z1: float, z2: float) -> None:
    base = len(vertices)
    vertices.extend(
        [
            (x1, y1, z1),
            (x2, y1, z1),
            (x2, y2, z1),
            (x1, y2, z1),
            (x1, y1, z2),
            (x2, y1, z2),
            (x2, y2, z2),
            (x1, y2, z2),
        ]
    )
    faces.extend(
        [
            (base + 0, base + 1, base + 2),
            (base + 0, base + 2, base + 3),
            (base + 4, base + 6, base + 5),
            (base + 4, base + 7, base + 6),
            (base + 0, base + 4, base + 5),
            (base + 0, base + 5, base + 1),
            (base + 1, base + 5, base + 6),
            (base + 1, base + 6, base + 2),
            (base + 2, base + 6, base + 7),
            (base + 2, base + 7, base + 3),
            (base + 3, base + 7, base + 4),
            (base + 3, base + 4, base + 0),
        ]
    )


def build_logo_mesh(with_plate: bool = False) -> tuple[np.ndarray, np.ndarray]:
    vertices: list[tuple[float, float, float]] = []
    faces: list[tuple[int, int, int]] = []

    # Stem + dot
    _add_box(vertices, faces, -7.0, -3.2, -15.0, 10.0, -1.0, 3.5)
    _add_box(vertices, faces, -6.0, -3.8, 12.0, 16.5, -1.0, 3.5)

    # Chevron bars
    _add_box(vertices, faces, 1.0, 13.5, -4.0, 0.8, -1.0, 3.5)
    _add_box(vertices, faces, 1.0, 13.5, 4.0, 8.8, -1.0, 3.5)

    if with_plate:
        _add_box(vertices, faces, -15.0, 15.0, -19.0, 19.0, -3.0, -1.0)

    return np.array(vertices, dtype=np.float32), np.array(faces, dtype=np.uint16)


def write_ascii_stl(path: Path, vertices: np.ndarray, faces: np.ndarray, solid_name: str) -> None:
    lines: list[str] = [f"solid {solid_name}"]
    for tri in faces:
        a, b, c = vertices[tri[0]], vertices[tri[1]], vertices[tri[2]]
        n = _face_normal(a, b, c)
        lines.append(f"  facet normal {n[0]:.6f} {n[1]:.6f} {n[2]:.6f}")
        lines.append("    outer loop")
        lines.append(f"      vertex {a[0]:.6f} {a[1]:.6f} {a[2]:.6f}")
        lines.append(f"      vertex {b[0]:.6f} {b[1]:.6f} {b[2]:.6f}")
        lines.append(f"      vertex {c[0]:.6f} {c[1]:.6f} {c[2]:.6f}")
        lines.append("    endloop")
        lines.append("  endfacet")
    lines.append(f"endsolid {solid_name}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_glb(path: Path, vertices: np.ndarray, faces: np.ndarray) -> None:
    indices = faces.reshape(-1).astype(np.uint16)
    position_bytes = vertices.tobytes()
    index_bytes = indices.tobytes()
    pad_pos = (4 - (len(position_bytes) % 4)) % 4
    bin_blob = position_bytes + (b"\x00" * pad_pos) + index_bytes

    pos_offset = 0
    idx_offset = len(position_bytes) + pad_pos

    accessor_min = vertices.min(axis=0).astype(float).tolist()
    accessor_max = vertices.max(axis=0).astype(float).tolist()

    gltf = {
        "asset": {"version": "2.0", "generator": "ivo-tech logo system script"},
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0}],
        "meshes": [
            {
                "primitives": [
                    {
                        "attributes": {"POSITION": 0},
                        "indices": 1,
                        "material": 0,
                    }
                ]
            }
        ],
        "materials": [{"pbrMetallicRoughness": {"baseColorFactor": [0.0, 0.92, 1.0, 1.0], "metallicFactor": 0.12, "roughnessFactor": 0.38}}],
        "buffers": [{"byteLength": len(bin_blob)}],
        "bufferViews": [
            {"buffer": 0, "byteOffset": pos_offset, "byteLength": len(position_bytes), "target": 34962},
            {"buffer": 0, "byteOffset": idx_offset, "byteLength": len(index_bytes), "target": 34963},
        ],
        "accessors": [
            {
                "bufferView": 0,
                "byteOffset": 0,
                "componentType": 5126,
                "count": int(vertices.shape[0]),
                "type": "VEC3",
                "min": accessor_min,
                "max": accessor_max,
            },
            {
                "bufferView": 1,
                "byteOffset": 0,
                "componentType": 5123,
                "count": int(indices.size),
                "type": "SCALAR",
                "min": [int(indices.min()) if indices.size else 0],
                "max": [int(indices.max()) if indices.size else 0],
            },
        ],
    }

    json_bytes = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
    json_padding = (4 - (len(json_bytes) % 4)) % 4
    json_chunk_data = json_bytes + (b" " * json_padding)

    total_length = 12 + 8 + len(json_chunk_data) + 8 + len(bin_blob)
    header = struct.pack("<4sII", b"glTF", 2, total_length)
    json_chunk_header = struct.pack("<I4s", len(json_chunk_data), b"JSON")
    bin_chunk_header = struct.pack("<I4s", len(bin_blob), b"BIN\x00")

    with path.open("wb") as f:
        f.write(header)
        f.write(json_chunk_header)
        f.write(json_chunk_data)
        f.write(bin_chunk_header)
        f.write(bin_blob)


def render_logo_sting(wordmark: Image.Image, submark: Image.Image) -> None:
    width, height = 1920, 1080
    fps = 30
    duration = 4.0
    total_frames = int(duration * fps)

    wordmark = wordmark.resize((1280, int(1280 * wordmark.height / wordmark.width)), Image.Resampling.LANCZOS)
    submark = submark.resize((360, 360), Image.Resampling.LANCZOS)

    out_mp4 = VIDEO_DIR / "logo-sting.mp4"
    out_webm = VIDEO_DIR / "logo-sting.webm"
    poster_png = VIDEO_DIR / "logo-sting-poster.png"
    tmp_mp4 = VIDEO_DIR / "logo-sting.tmp.mp4"
    tmp_webm = VIDEO_DIR / "logo-sting.tmp.webm"

    writer_mp4 = imageio.get_writer(
        tmp_mp4,
        fps=fps,
        codec="libx264",
        ffmpeg_log_level="error",
        quality=8,
        pixelformat="yuv420p",
        macro_block_size=None,
        output_params=["-movflags", "+faststart", "-crf", "20", "-preset", "medium"],
    )
    writer_webm = imageio.get_writer(
        tmp_webm,
        fps=fps,
        codec="libvpx-vp9",
        ffmpeg_log_level="error",
        macro_block_size=None,
        output_params=["-b:v", "0", "-crf", "33", "-row-mt", "1", "-deadline", "good"],
    )

    try:
        final_frame = None
        for idx in range(total_frames):
            t = idx / fps
            p = min(max(t / duration, 0.0), 1.0)

            frame = Image.new("RGB", (width, height), (4, 6, 13))
            bg = Image.new("RGBA", (width, height), (0, 0, 0, 0))
            draw_bg = ImageDraw.Draw(bg)
            cx1 = width * (0.22 + 0.09 * math.sin(t * 1.1))
            cy1 = height * (0.32 + 0.08 * math.cos(t * 0.9))
            cx2 = width * (0.72 + 0.08 * math.cos(t * 0.7))
            cy2 = height * (0.64 + 0.09 * math.sin(t * 1.2))
            draw_bg.ellipse((cx1 - 300, cy1 - 300, cx1 + 300, cy1 + 300), fill=(0, 220, 255, 70))
            draw_bg.ellipse((cx2 - 360, cy2 - 360, cx2 + 360, cy2 + 360), fill=(0, 135, 255, 58))
            bg = bg.filter(ImageFilter.GaussianBlur(68))
            frame = Image.alpha_composite(frame.convert("RGBA"), bg).convert("RGB")

            composed = frame.convert("RGBA")

            entry = min(1.0, t / 1.2)
            overshoot = 1.0 + 0.06 * math.sin(min(entry, 1.0) * math.pi * 1.2)
            mark_scale = 0.5 + 0.5 * entry * overshoot
            mw = int(submark.width * mark_scale)
            mh = int(submark.height * mark_scale)
            mark = submark.resize((max(1, mw), max(1, mh)), Image.Resampling.LANCZOS)

            mark_alpha = int(255 * min(1.0, entry * 1.2))
            if mark_alpha < 255:
                alpha = mark.split()[-1].point(lambda v: int(v * (mark_alpha / 255.0)))
                mark.putalpha(alpha)

            mark_x = int(width * 0.17 - mark.width * 0.5)
            mark_y = int(height * 0.5 - mark.height * 0.5 - 40 * (1 - entry))
            composed.alpha_composite(mark, (mark_x, mark_y))

            word_start = 0.85
            word_p = min(1.0, max(0.0, (t - word_start) / 1.25))
            wx = int(width * 0.31)
            wy = int(height * 0.5 - wordmark.height * 0.5 + (1.0 - word_p) * 60)
            wm = wordmark.copy()
            wm_alpha = int(255 * word_p)
            if wm_alpha < 255:
                alpha = wm.split()[-1].point(lambda v: int(v * (wm_alpha / 255.0)))
                wm.putalpha(alpha)
            composed.alpha_composite(wm, (wx, wy))

            line = Image.new("RGBA", (width, height), (0, 0, 0, 0))
            ldraw = ImageDraw.Draw(line)
            line_w = int((width * 0.78) * min(1.0, p * 1.4))
            ldraw.rectangle((int(width * 0.11), int(height * 0.78), int(width * 0.11) + line_w, int(height * 0.786)), fill=(0, 235, 255, 140))
            composed = Image.alpha_composite(composed, line)

            frame_arr = np.asarray(composed.convert("RGB"), dtype=np.uint8)
            writer_mp4.append_data(frame_arr)
            writer_webm.append_data(frame_arr)
            final_frame = composed

        if final_frame is not None:
            final_frame.convert("RGB").save(poster_png)
    finally:
        writer_mp4.close()
        writer_webm.close()

    tmp_mp4.replace(out_mp4)
    tmp_webm.replace(out_webm)


def write_logo_sting_captions(path: Path) -> None:
    vtt = """WEBVTT

00:00.000 --> 00:04.000
[Logo animation without spoken dialogue]
"""
    path.write_text(vtt, encoding="utf-8")


def main() -> None:
    ensure_dirs()
    write_route_svgs()

    wordmark_primary = render_wordmark_png(ASSETS_DIR / "logo.png", mode="primary")
    render_wordmark_png(DESIGN_LOGO_DIR / "logo-mono-light.png", mode="mono-light")
    render_wordmark_png(DESIGN_LOGO_DIR / "logo-mono-dark.png", mode="mono-dark")
    render_wordmark_png(DESIGN_LOGO_DIR / "logo-invert.png", mode="invert")

    submark_primary = render_submark_png(ASSETS_DIR / "logo-mark.png", mode="primary")
    render_submark_png(DESIGN_LOGO_DIR / "logo-mark-mono-light.png", mode="mono-light")
    render_submark_png(DESIGN_LOGO_DIR / "logo-mark-mono-dark.png", mode="mono-dark")
    render_submark_png(DESIGN_LOGO_DIR / "logo-mark-invert.png", mode="invert")
    generate_favicon(submark_primary, ROOT / "public" / "favicon.ico")

    base_vertices, base_faces = build_logo_mesh(with_plate=False)
    hybrid_vertices, hybrid_faces = build_logo_mesh(with_plate=True)
    write_ascii_stl(ASSETS_DIR / "demo-brand-base.stl", base_vertices, base_faces, "ivo_tech_logo_base")
    write_ascii_stl(ASSETS_DIR / "demo-brand-hybrid-v2.stl", hybrid_vertices, hybrid_faces, "ivo_tech_logo_hybrid")
    write_glb(BRAND_DIR / "ivo-tech-logo.glb", base_vertices, base_faces)

    render_logo_sting(wordmark_primary, submark_primary)
    write_logo_sting_captions(VIDEO_DIR / "logo-sting-captions.vtt")
    print("Generated logo system assets successfully.")


if __name__ == "__main__":
    main()
