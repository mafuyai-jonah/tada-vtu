import type { RGBA } from "./types";

export function colorToRGBA(hex: string): RGBA {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0.5, 0.5, 0.5, 1.0];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
    1.0,
  ];
}
