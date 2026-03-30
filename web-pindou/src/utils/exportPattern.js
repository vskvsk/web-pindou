/** 生成可打印的 SVG 拼豆图纸（网格 + 色号） */
export function buildPatternSvg(pixelData, gridWidth, gridHeight, options) {
    const { cellSize, showCodes, title } = options;
    const pad = 1;
    const w = gridWidth * cellSize + pad * 2;
    const h = gridHeight * cellSize + pad * 2 + (title ? 36 : 0);
    const titleOffset = title ? 32 : 0;
    const parts = [];
    parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`);
    parts.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="#1f2937"/>`);
    if (title) {
        parts.push(`<text x="${w / 2}" y="22" fill="#e5e7eb" font-size="14" font-family="system-ui,sans-serif" text-anchor="middle">${escapeXml(title)}</text>`);
    }
    for (const p of pixelData) {
        const x = pad + p.x * cellSize;
        const y = pad + titleOffset + p.y * cellSize;
        parts.push(`<rect x="${x}" y="${y}" width="${cellSize - 1}" height="${cellSize - 1}" rx="2" fill="${p.hex}" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>`);
        if (showCodes && cellSize >= 10) {
            const fs = Math.max(5, Math.min(9, cellSize * 0.35));
            parts.push(`<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + fs * 0.35}" fill="rgba(0,0,0,0.75)" font-size="${fs}" font-family="system-ui,sans-serif" text-anchor="middle">${escapeXml(p.colorCode)}</text>`);
        }
    }
    parts.push(`</svg>`);
    return parts.join('');
}
function escapeXml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
export function downloadTextFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}
