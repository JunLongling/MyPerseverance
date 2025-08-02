export const palettes = {
  lavender: {
    zero: "bg-gray-200",
    one: "bg-purple-200",
    low: "bg-purple-400",
    medium: "bg-purple-600",
    high: "bg-purple-800",
  },
  teal: {
    zero: "bg-gray-200",
    one: "bg-teal-200",
    low: "bg-teal-400",
    medium: "bg-teal-600",
    high: "bg-teal-800",
  },
  coral: {
    zero: "bg-gray-200",
    one: "bg-rose-200",
    low: "bg-rose-400",
    medium: "bg-rose-600",
    high: "bg-rose-800",
  },
  amber: {
    zero: "bg-gray-200",
    one: "bg-amber-200",
    low: "bg-amber-400",
    medium: "bg-amber-600",
    high: "bg-amber-800",
  },
  growth: { // leetcode-like palette
    zero: "bg-gray-200",
    one: "bg-green-200",
    low: "bg-green-400",
    medium: "bg-green-600",
    high: "bg-green-800",
  },
};

export type PaletteName = keyof typeof palettes;

export type ColorPalette = {
  zero: string;
  one: string;
  low: string;
  medium: string;
  high: string;
};

export function getColorForCount(count: number, palette: ColorPalette): string {
  if (count === 0) return palette.zero;
  if (count === 1) return palette.one;
  if (count <= 3) return palette.low;
  if (count <= 5) return palette.medium;
  return palette.high;
}
