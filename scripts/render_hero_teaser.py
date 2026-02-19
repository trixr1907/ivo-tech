#!/usr/bin/env python3
"""
Render final 36s hero brand teaser video (mp4 + webm) from local assets.

Usage:
  python3 scripts/render_hero_teaser.py
"""

from __future__ import annotations

import math
from pathlib import Path
from typing import TypedDict

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION_SECONDS = 36
TOTAL_FRAMES = FPS * DURATION_SECONDS
SCENE_DURATION = 6.0
SCENE_TRANSITION = 0.7


class Scene(TypedDict):
    kicker: str
    title: str
    subtitle: str
    image_path: str


SCENES: list[Scene] = [
    {
        "kicker": "IVO TECH",
        "title": "Authority-First Digital Engineering",
        "subtitle": "Brand systems, UX clarity, and reliable product delivery.",
        "image_path": "public/assets/logo.png",
    },
    {
        "kicker": "LIVE CASE",
        "title": "3D Product Configurator",
        "subtitle": "Upload to checkout handoff with production-safe quality gates.",
        "image_path": "public/assets/thumb_viewer_neon.png",
    },
    {
        "kicker": "SOTA UX",
        "title": "High-Performance Demo Experience",
        "subtitle": "Visual fidelity, loading discipline, and conversion-ready structure.",
        "image_path": "public/assets/thumb_pizza_sota.png",
    },
    {
        "kicker": "AUTOMATION",
        "title": "Extension-Based Growth Workflow",
        "subtitle": "Event instrumentation, proof modules, and measurable funnel actions.",
        "image_path": "public/assets/thumb_autocoupon_ext.png",
    },
    {
        "kicker": "MOBILE DELIVERY",
        "title": "Cross-Platform Product Execution",
        "subtitle": "From creative direction to deployable product interfaces.",
        "image_path": "public/assets/thumb_autocoupon_android.png",
    },
    {
        "kicker": "NEXT STEP",
        "title": "Request Strategic Project Session",
        "subtitle": "Focused scope, transparent delivery, and measurable outcomes.",
        "image_path": "public/assets/thumb_viewer_neon.png",
    },
]


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def smoothstep(value: float) -> float:
    value = clamp(value, 0.0, 1.0)
    return value * value * (3.0 - 2.0 * value)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/TTF/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        font_path = Path(candidate)
        if font_path.exists():
            return ImageFont.truetype(str(font_path), size=size)
    return ImageFont.load_default()


def fit_cover(image: Image.Image, target_w: int, target_h: int, zoom: float, pan_x: float, pan_y: float) -> Image.Image:
    scale = max(target_w / image.width, target_h / image.height) * zoom
    resized = image.resize((int(image.width * scale), int(image.height * scale)), Image.Resampling.LANCZOS)
    max_x = max(0, resized.width - target_w)
    max_y = max(0, resized.height - target_h)
    left = int(max_x * clamp(pan_x, 0.0, 1.0))
    top = int(max_y * clamp(pan_y, 0.0, 1.0))
    return resized.crop((left, top, left + target_w, top + target_h))


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        width = draw.textlength(candidate, font=font)
        if width <= max_width or not current:
            current = candidate
            continue
        lines.append(current)
        current = word
    if current:
        lines.append(current)
    return lines


def make_background(global_time: float) -> Image.Image:
    base = Image.new("RGB", (WIDTH, HEIGHT), (8, 12, 22))
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)

    centers = [
        (
            WIDTH * (0.2 + 0.12 * math.sin(global_time * 0.25)),
            HEIGHT * (0.25 + 0.08 * math.cos(global_time * 0.18)),
            360,
            (0, 225, 255, 80),
        ),
        (
            WIDTH * (0.75 + 0.1 * math.cos(global_time * 0.17 + 1.5)),
            HEIGHT * (0.7 + 0.08 * math.sin(global_time * 0.22 + 0.7)),
            320,
            (0, 120, 255, 75),
        ),
        (
            WIDTH * (0.55 + 0.09 * math.sin(global_time * 0.3 + 0.4)),
            HEIGHT * (0.2 + 0.1 * math.cos(global_time * 0.29 + 0.2)),
            300,
            (40, 190, 255, 65),
        ),
    ]
    for cx, cy, radius, color in centers:
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=color)

    glow = glow.filter(ImageFilter.GaussianBlur(75))
    with_glow = Image.alpha_composite(base.convert("RGBA"), glow)
    vignette = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    vdraw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 0, 0, 34))
    vdraw.rectangle((0, int(HEIGHT * 0.62), WIDTH, HEIGHT), fill=(0, 0, 0, 95))
    return Image.alpha_composite(with_glow, vignette).convert("RGB")


def render_scene(scene_idx: int, local_time: float, assets: list[Image.Image], fonts: dict[str, ImageFont.ImageFont], global_time: float) -> Image.Image:
    scene = SCENES[scene_idx]
    frame = make_background(global_time)
    source = assets[scene_idx]

    zoom = 1.04 + 0.08 * (local_time / SCENE_DURATION)
    pan_x = 0.5 + 0.08 * math.sin(global_time * 0.38 + scene_idx * 0.9)
    pan_y = 0.5 + 0.06 * math.cos(global_time * 0.33 + scene_idx * 0.7)
    cover = fit_cover(source, WIDTH, HEIGHT, zoom, pan_x, pan_y)
    frame = Image.blend(frame, cover, 0.58)

    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    odraw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 0, 0, 65))
    odraw.rounded_rectangle((56, 58, 360, 112), radius=14, fill=(8, 20, 34, 190), outline=(70, 210, 255, 120), width=2)
    odraw.line((58, 132, WIDTH - 58, 132), fill=(80, 200, 255, 70), width=1)
    odraw.rectangle((0, int(HEIGHT * 0.57), WIDTH, HEIGHT), fill=(4, 7, 14, 180))
    frame = Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")

    text_draw = ImageDraw.Draw(frame)
    text_draw.text((80, 74), scene["kicker"], fill=(166, 238, 255), font=fonts["kicker"])

    title_lines = wrap_text(text_draw, scene["title"], fonts["title"], WIDTH - 180)
    subtitle_lines = wrap_text(text_draw, scene["subtitle"], fonts["subtitle"], WIDTH - 180)

    y = int(HEIGHT * 0.63)
    for line in title_lines:
        text_draw.text((80, y), line, fill=(236, 247, 255), font=fonts["title"])
        y += 60
    y += 6
    for line in subtitle_lines:
        text_draw.text((80, y), line, fill=(160, 190, 214), font=fonts["subtitle"])
        y += 42

    progress = (scene_idx + local_time / SCENE_DURATION) / len(SCENES)
    bar_x, bar_y, bar_w, bar_h = 80, HEIGHT - 42, WIDTH - 160, 8
    text_draw.rounded_rectangle((bar_x, bar_y, bar_x + bar_w, bar_y + bar_h), radius=4, fill=(50, 70, 90))
    text_draw.rounded_rectangle(
        (bar_x, bar_y, bar_x + int(bar_w * clamp(progress, 0.0, 1.0)), bar_y + bar_h),
        radius=4,
        fill=(90, 220, 255),
    )

    return frame


def blend_transition(prev_frame: Image.Image, next_frame: Image.Image, local_time: float) -> Image.Image:
    if local_time >= SCENE_TRANSITION:
        return next_frame
    alpha = smoothstep(local_time / SCENE_TRANSITION)
    return Image.blend(prev_frame, next_frame, alpha)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    output_dir = root / "public" / "assets" / "video"
    output_dir.mkdir(parents=True, exist_ok=True)

    assets: list[Image.Image] = []
    for scene in SCENES:
        image_path = root / scene["image_path"]
        assets.append(Image.open(image_path).convert("RGB"))

    fonts = {
        "kicker": load_font(25, bold=True),
        "title": load_font(52, bold=True),
        "subtitle": load_font(33, bold=False),
    }

    tmp_mp4 = output_dir / "hero-case-teaser.tmp.mp4"
    tmp_webm = output_dir / "hero-case-teaser.tmp.webm"
    out_mp4 = output_dir / "hero-case-teaser.mp4"
    out_webm = output_dir / "hero-case-teaser.webm"

    mp4_writer = imageio.get_writer(
        tmp_mp4,
        fps=FPS,
        codec="libx264",
        ffmpeg_log_level="error",
        quality=8,
        pixelformat="yuv420p",
        macro_block_size=None,
        output_params=["-movflags", "+faststart", "-crf", "20", "-preset", "medium"],
    )
    webm_writer = imageio.get_writer(
        tmp_webm,
        fps=FPS,
        codec="libvpx-vp9",
        ffmpeg_log_level="error",
        macro_block_size=None,
        output_params=["-b:v", "0", "-crf", "33", "-row-mt", "1", "-deadline", "good"],
    )

    try:
        for frame_index in range(TOTAL_FRAMES):
            global_time = frame_index / FPS
            scene_idx = min(int(global_time // SCENE_DURATION), len(SCENES) - 1)
            local_time = global_time - scene_idx * SCENE_DURATION

            current_frame = render_scene(scene_idx, local_time, assets, fonts, global_time)
            if scene_idx > 0:
                prev_local_time = SCENE_DURATION - SCENE_TRANSITION + local_time
                prev_frame = render_scene(scene_idx - 1, prev_local_time, assets, fonts, global_time)
                frame = blend_transition(prev_frame, current_frame, local_time)
            else:
                frame = current_frame

            arr = np.asarray(frame, dtype=np.uint8)
            mp4_writer.append_data(arr)
            webm_writer.append_data(arr)
    finally:
        mp4_writer.close()
        webm_writer.close()

    tmp_mp4.replace(out_mp4)
    tmp_webm.replace(out_webm)

    print(f"Rendered {out_mp4}")
    print(f"Rendered {out_webm}")


if __name__ == "__main__":
    main()
