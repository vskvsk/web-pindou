/**
 * 拼豆品牌 / 色板选项（与参考站 beads.chyt.top 能力对齐）
 * 当前颜色匹配数据基于 MARD 色库；其他品牌色卡将随数据接入逐步独立。
 */

export type PaletteBrandId =
  | 'MARD'
  | 'COCO'
  | 'MANMAN'
  | 'PANPAN'
  | 'MIXIAOWO'
  | 'CUSTOM'

export interface PaletteBrandOption {
  id: PaletteBrandId
  label: string
  /** 简短说明，用于界面提示 */
  hint?: string
}

export const PALETTE_BRAND_OPTIONS: PaletteBrandOption[] = [
  { id: 'MARD', label: 'MARD' },
  { id: 'COCO', label: 'COCO', hint: '匹配暂基于 MARD 色库' },
  { id: 'MANMAN', label: '漫漫', hint: '匹配暂基于 MARD 色库' },
  { id: 'PANPAN', label: '盼盼', hint: '匹配暂基于 MARD 色库' },
  { id: 'MIXIAOWO', label: '咪小窝', hint: '匹配暂基于 MARD 色库' },
  { id: 'CUSTOM', label: '自定义色板', hint: '从 MARD 色库中勾选可用颜色' },
]

export function getPaletteBrandLabel(id: PaletteBrandId): string {
  return PALETTE_BRAND_OPTIONS.find((o) => o.id === id)?.label ?? id
}
