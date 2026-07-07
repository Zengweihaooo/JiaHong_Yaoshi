#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$ROOT/.tmp-homepage-build"
OUT="$ROOT/public/images/homepage.png"
BASE="$ROOT/public/images/homepage.base.png"
SIDEBAR="$ROOT/public/images/homepage.sidebar.png"

read -r DESIGN_W DESIGN_H SW SH SX SY SCALE <<EOF
$(python3 - <<'PY'
design_w = round(1234 * 3951 / 2407)  # 与 Figma 内容区等比，消除横向拉伸
design_h = 3951
scale = design_w / 1440
print(
    design_w,
    design_h,
    round(290 * scale),
    round(450 * scale),
    round(1027 * scale),
    round(138 * scale),
    scale,
)
PY
)
EOF

mkdir -p "$TMP"

if [[ ! -f "$BASE" || ! -f "$SIDEBAR" ]]; then
  echo "Missing $BASE or $SIDEBAR" >&2
  exit 1
fi

# 底图统一为 2025×3951（若已是该尺寸则跳过）
CURRENT_W=$(magick identify -format '%w' "$BASE")
if [[ "$CURRENT_W" != "$DESIGN_W" ]]; then
  magick "$BASE" -filter Lanczos -resize "${DESIGN_W}x${DESIGN_H}!" "$TMP/base.png"
else
  cp "$BASE" "$TMP/base.png"
fi

magick "$SIDEBAR" -filter Lanczos -resize "${SW}x${SH}" "$TMP/sidebar-final.png"
magick "$TMP/base.png" \
  -fill '#f4f5f6' -draw "rectangle $((SX - 10)),$((SY - 10)) $((SX + SW + 10)),$((SY + SH + 10))" \
  "$TMP/base-cleared.png"
magick "$TMP/base-cleared.png" "$TMP/sidebar-final.png" -geometry +"${SX}"+"${SY}" -composite "$OUT"
cp "$TMP/base.png" "$BASE"

echo "Updated $OUT (${DESIGN_W}x${DESIGN_H}, sidebar ${SW}x${SH} at ${SX},${SY})"
