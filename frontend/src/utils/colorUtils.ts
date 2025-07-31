export function getColorForCount(count: number, isDark: boolean): string {
  if (count === 0) return isDark ? "bg-gray-700" : "bg-gray-300";
  if (count === 1) return isDark ? "bg-purple-600" : "bg-purple-400";
  if (count <= 3) return isDark ? "bg-purple-500" : "bg-purple-600";
  if (count <= 5) return isDark ? "bg-purple-400" : "bg-purple-800";
  return isDark ? "bg-pink-400" : "bg-pink-700";
}