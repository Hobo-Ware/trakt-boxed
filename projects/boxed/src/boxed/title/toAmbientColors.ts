export type AmbientColors = {
  glow: string;
  accent: string;
};

type Rgb = readonly [number, number, number];

const NIGHT_PAGE_BACKGROUND: Rgb = [20, 19, 24];
const MIN_ACCENT_CONTRAST = 3;
const MIN_GLOW_CONTRAST = 1.4;

function parseHex(color: string): Rgb | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(color.trim());
  if (!match?.[1]) return null;

  const value = parseInt(match[1], 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function toLinear(channel: number) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]: Rgb) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(left: Rgb, right: Rgb) {
  const [light, dark] = [luminance(left), luminance(right)].sort((a, b) =>
    b - a
  ) as [number, number];

  return (light + 0.05) / (dark + 0.05);
}

function toHex(rgb: Rgb) {
  return `#${
    rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')
  }`;
}

export function toAmbientColors(
  colors: ReadonlyArray<string> | Nil,
  background: Rgb = NIGHT_PAGE_BACKGROUND,
): AmbientColors | null {
  const parsed = (colors ?? [])
    .map(parseHex)
    .filter((rgb): rgb is Rgb => rgb !== null);

  const accent = parsed
    .filter((rgb) => contrastRatio(rgb, background) >= MIN_ACCENT_CONTRAST)
    .at(0);
  if (!accent) return null;

  const primary = parsed.at(0);
  const glow =
    primary && contrastRatio(primary, background) >= MIN_GLOW_CONTRAST
      ? primary
      : accent;

  return { glow: toHex(glow), accent: toHex(accent) };
}
