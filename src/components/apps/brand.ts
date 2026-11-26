export const SWATCHES = ["#8175F5", "#1F4E8C", "#7A1F3D", "#0F766E", "#B45309"];

/** Derive up-to-3-letter initials from a school name. */
export function initialsFrom(name: string): string {
  const words = name.trim().split(/\s+/).filter((w) => /^[A-Za-z0-9]/.test(w) && !/^(of|the|and|&)$/i.test(w));
  return words.slice(0, 3).map((w) => w[0]!.toUpperCase()).join("") || "S";
}
