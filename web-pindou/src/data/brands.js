/**
 * 拼豆品牌 / 色板选项（与参考站 beads.chyt.top 能力对齐）
 * 当前颜色匹配数据基于 MARD 色库；其他品牌色卡将随数据接入逐步独立。
 */
export const PALETTE_BRAND_OPTIONS = [
    { id: 'MARD', label: 'MARD' },
    { id: 'COCO', label: 'COCO', hint: '匹配暂基于 MARD 色库' },
    { id: 'MANMAN', label: '漫漫', hint: '匹配暂基于 MARD 色库' },
    { id: 'PANPAN', label: '盼盼', hint: '匹配暂基于 MARD 色库' },
    { id: 'MIXIAOWO', label: '咪小窝', hint: '匹配暂基于 MARD 色库' },
    { id: 'CUSTOM', label: '自定义色板', hint: '从 MARD 色库中勾选可用颜色' },
];
export function getPaletteBrandLabel(id) {
    return PALETTE_BRAND_OPTIONS.find((o) => o.id === id)?.label ?? id;
}
