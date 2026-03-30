/** 扁平化拼豆格：根据背景色选择对比度足够的文字颜色 */

export function textColorOnHex(hex: string): string {
  const h = hex.trim()
  if (!/^#[0-9A-Fa-f]{6}$/.test(h)) return '#0f172a'
  const r = parseInt(h.slice(1, 3), 16) / 255
  const g = parseInt(h.slice(3, 5), 16) / 255
  const b = parseInt(h.slice(5, 7), 16) / 255
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return L > 0.62 ? '#0f172a' : '#f8fafc'
}
