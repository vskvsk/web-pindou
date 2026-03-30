import type { PixelData } from '../stores/pindou'
import { textColorOnHex } from './flatPixelStyle'

/** 生成可打印的 SVG 拼豆图纸（扁平网格 + 色号） */
export function buildPatternSvg(
  pixelData: PixelData[],
  gridWidth: number,
  gridHeight: number,
  options: { cellSize: number; showCodes: boolean; title?: string; backgroundFill?: string | null }
): string {
  const { cellSize, showCodes, title, backgroundFill } = options
  const pad = 1
  const w = gridWidth * cellSize + pad * 2
  const h = gridHeight * cellSize + pad * 2 + (title ? 36 : 0)
  const titleOffset = title ? 32 : 0

  const parts: string[] = []
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
  )
  if (backgroundFill !== null) {
    const fill = backgroundFill ?? '#020617'
    parts.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="${fill}"/>`)
  }
  if (title) {
    parts.push(
      `<text x="${w / 2}" y="22" fill="#e5e7eb" font-size="14" font-family="system-ui,sans-serif" text-anchor="middle">${escapeXml(
        title
      )}</text>`
    )
  }

  for (const p of pixelData) {
    if (p.isRemoved) continue
    const x = pad + p.x * cellSize
    const y = pad + titleOffset + p.y * cellSize
    parts.push(
      `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${p.hex}" stroke="#334155" stroke-width="0.5" shape-rendering="crispEdges"/>`
    )
    if (showCodes && cellSize >= 10) {
      const fs = Math.max(6, Math.min(11, cellSize * 0.38))
      const tc = textColorOnHex(p.hex)
      const strokeCol = tc === '#f8fafc' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.55)'
      parts.push(
        `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + fs * 0.32}" fill="${tc}" stroke="${strokeCol}" stroke-width="0.35" paint-order="stroke fill" font-size="${fs}" font-weight="600" font-family="system-ui,sans-serif" text-anchor="middle" dominant-baseline="middle">${escapeXml(
          p.colorCode
        )}</text>`
      )
    }
  }
  parts.push(`</svg>`)
  return parts.join('')
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function downloadTextFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}
