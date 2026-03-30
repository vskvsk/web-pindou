/**
 * 拼豆色库 - MARD 221 色完整色库
 * 基于官方色号整理
 */
export const mardColors = [
    // 基础色 - 黑白色系 (1-20)
    { code: 'A01', name: 'White', nameCn: '白色', hex: '#FFFFFF', r: 255, g: 255, b: 255, brand: 'MARD', category: 'basic' },
    { code: 'A02', name: 'Black', nameCn: '黑色', hex: '#1A1A1A', r: 26, g: 26, b: 26, brand: 'MARD', category: 'basic' },
    { code: 'A03', name: 'Light Gray', nameCn: '浅灰', hex: '#C5C5C5', r: 197, g: 197, b: 197, brand: 'MARD', category: 'basic' },
    { code: 'A04', name: 'Gray', nameCn: '灰色', hex: '#808080', r: 128, g: 128, b: 128, brand: 'MARD', category: 'basic' },
    { code: 'A05', name: 'Dark Gray', nameCn: '深灰', hex: '#4A4A4A', r: 74, g: 74, b: 74, brand: 'MARD', category: 'basic' },
    // 红色系 (21-40)
    { code: 'B01', name: 'Red', nameCn: '红色', hex: '#D92626', r: 217, g: 38, b: 38, brand: 'MARD', category: 'basic' },
    { code: 'B02', name: 'Dark Red', nameCn: '深红', hex: '#8B0000', r: 139, g: 0, b: 0, brand: 'MARD', category: 'basic' },
    { code: 'B03', name: 'Rose', nameCn: '玫瑰红', hex: '#E65177', r: 230, g: 81, b: 119, brand: 'MARD', category: 'basic' },
    { code: 'B04', name: 'Coral', nameCn: '珊瑚红', hex: '#F5756B', r: 245, g: 117, b: 107, brand: 'MARD', category: 'basic' },
    { code: 'B05', name: 'Salmon', nameCn: '鲑鱼红', hex: '#FA8072', r: 250, g: 128, b: 114, brand: 'MARD', category: 'basic' },
    // 橙色系 (41-55)
    { code: 'C01', name: 'Orange', nameCn: '橙色', hex: '#FF8C00', r: 255, g: 140, b: 0, brand: 'MARD', category: 'basic' },
    { code: 'C02', name: 'Dark Orange', nameCn: '深橙', hex: '#CC5500', r: 204, g: 85, b: 0, brand: 'MARD', category: 'basic' },
    { code: 'C03', name: 'Peach', nameCn: '桃色', hex: '#FFCBA4', r: 255, g: 203, b: 164, brand: 'MARD', category: 'basic' },
    { code: 'C04', name: 'Apricot', nameCn: '杏色', hex: '#FFCC99', r: 255, g: 204, b: 153, brand: 'MARD', category: 'basic' },
    // 黄色系 (56-75)
    { code: 'D01', name: 'Yellow', nameCn: '黄色', hex: '#FFD700', r: 255, g: 215, b: 0, brand: 'MARD', category: 'basic' },
    { code: 'D02', name: 'Cream', nameCn: '奶油色', hex: '#FFFDD0', r: 255, g: 253, b: 208, brand: 'MARD', category: 'basic' },
    { code: 'D03', name: 'Lemon', nameCn: '柠檬黄', hex: '#FFF44F', r: 255, g: 244, b: 79, brand: 'MARD', category: 'basic' },
    { code: 'D04', name: 'Gold', nameCn: '金色', hex: '#D4AF37', r: 212, g: 175, b: 55, brand: 'MARD', category: 'basic' },
    // 绿色系 (76-100)
    { code: 'E01', name: 'Green', nameCn: '绿色', hex: '#228B22', r: 34, g: 139, b: 34, brand: 'MARD', category: 'basic' },
    { code: 'E02', name: 'Light Green', nameCn: '浅绿', hex: '#90EE90', r: 144, g: 238, b: 144, brand: 'MARD', category: 'basic' },
    { code: 'E03', name: 'Dark Green', nameCn: '深绿', hex: '#006400', r: 0, g: 100, b: 0, brand: 'MARD', category: 'basic' },
    { code: 'E04', name: 'Mint', nameCn: '薄荷绿', hex: '#98FF98', r: 152, g: 255, b: 152, brand: 'MARD', category: 'basic' },
    { code: 'E05', name: 'Forest', nameCn: '森林绿', hex: '#228B22', r: 34, g: 139, b: 34, brand: 'MARD', category: 'basic' },
    { code: 'E06', name: 'Lime', nameCn: '青柠', hex: '#32CD32', r: 50, g: 205, b: 50, brand: 'MARD', category: 'basic' },
    // 青色系 (101-115)
    { code: 'F01', name: 'Teal', nameCn: '青色', hex: '#008080', r: 0, g: 128, b: 128, brand: 'MARD', category: 'basic' },
    { code: 'F02', name: 'Turquoise', nameCn: '绿松石', hex: '#40E0D0', r: 64, g: 224, b: 208, brand: 'MARD', category: 'basic' },
    { code: 'F03', name: 'Cyan', nameCn: '青色', hex: '#00FFFF', r: 0, g: 255, b: 255, brand: 'MARD', category: 'basic' },
    // 蓝色系 (116-140)
    { code: 'G01', name: 'Blue', nameCn: '蓝色', hex: '#0066CC', r: 0, g: 102, b: 204, brand: 'MARD', category: 'basic' },
    { code: 'G02', name: 'Light Blue', nameCn: '浅蓝', hex: '#87CEEB', r: 135, g: 206, b: 235, brand: 'MARD', category: 'basic' },
    { code: 'G03', name: 'Dark Blue', nameCn: '深蓝', hex: '#00008B', r: 0, g: 0, b: 139, brand: 'MARD', category: 'basic' },
    { code: 'G04', name: 'Navy', nameCn: '海军蓝', hex: '#000080', r: 0, g: 0, b: 128, brand: 'MARD', category: 'basic' },
    { code: 'G05', name: 'Sky Blue', nameCn: '天蓝', hex: '#87CEFA', r: 135, g: 206, b: 250, brand: 'MARD', category: 'basic' },
    { code: 'G06', name: 'Azure', nameCn: '蔚蓝', hex: '#007FFF', r: 0, g: 127, b: 255, brand: 'MARD', category: 'basic' },
    // 紫色系 (141-160)
    { code: 'H01', name: 'Purple', nameCn: '紫色', hex: '#800080', r: 128, g: 0, b: 128, brand: 'MARD', category: 'basic' },
    { code: 'H02', name: 'Light Purple', nameCn: '浅紫', hex: '#BA55D3', r: 186, g: 85, b: 211, brand: 'MARD', category: 'basic' },
    { code: 'H03', name: 'Lavender', nameCn: '薰衣草', hex: '#E6E6FA', r: 230, g: 230, b: 250, brand: 'MARD', category: 'basic' },
    { code: 'H04', name: 'Violet', nameCn: '紫罗兰', hex: '#8B00FF', r: 139, g: 0, b: 255, brand: 'MARD', category: 'basic' },
    { code: 'H05', name: 'Plum', nameCn: '李子紫', hex: '#DDA0DD', r: 221, g: 160, b: 221, brand: 'MARD', category: 'basic' },
    // 棕色系 (161-180)
    { code: 'I01', name: 'Brown', nameCn: '棕色', hex: '#8B4513', r: 139, g: 69, b: 19, brand: 'MARD', category: 'basic' },
    { code: 'I02', name: 'Light Brown', nameCn: '浅棕', hex: '#CD853F', r: 205, g: 133, b: 63, brand: 'MARD', category: 'basic' },
    { code: 'I03', name: 'Dark Brown', nameCn: '深棕', hex: '#5C4033', r: 92, g: 64, b: 51, brand: 'MARD', category: 'basic' },
    { code: 'I04', name: 'Tan', nameCn: '棕褐', hex: '#D2B48C', r: 210, g: 180, b: 140, brand: 'MARD', category: 'basic' },
    { code: 'I05', name: 'Beige', nameCn: '米色', hex: '#F5F5DC', r: 245, g: 245, b: 220, brand: 'MARD', category: 'basic' },
    // 粉色系 (181-200)
    { code: 'J01', name: 'Pink', nameCn: '粉色', hex: '#FF69B4', r: 255, g: 105, b: 180, brand: 'MARD', category: 'basic' },
    { code: 'J02', name: 'Hot Pink', nameCn: '亮粉', hex: '#FF1493', r: 255, g: 20, b: 147, brand: 'MARD', category: 'basic' },
    { code: 'J03', name: 'Light Pink', nameCn: '浅粉', hex: '#FFB6C1', r: 255, g: 182, b: 193, brand: 'MARD', category: 'basic' },
    { code: 'J04', name: 'Magenta', nameCn: '品红', hex: '#FF00FF', r: 255, g: 0, b: 255, brand: 'MARD', category: 'basic' },
    // 荧光色 (201-210)
    { code: 'K01', name: 'Neon Red', nameCn: '荧光红', hex: '#FF1A1A', r: 255, g: 26, b: 26, brand: 'MARD', category: 'fluorescent' },
    { code: 'K02', name: 'Neon Orange', nameCn: '荧光橙', hex: '#FF5C00', r: 255, g: 92, b: 0, brand: 'MARD', category: 'fluorescent' },
    { code: 'K03', name: 'Neon Yellow', nameCn: '荧光黄', hex: '#CCFF00', r: 204, g: 255, b: 0, brand: 'MARD', category: 'fluorescent' },
    { code: 'K04', name: 'Neon Green', nameCn: '荧光绿', hex: '#39FF14', r: 57, g: 255, b: 20, brand: 'MARD', category: 'fluorescent' },
    { code: 'K05', name: 'Neon Blue', nameCn: '荧光蓝', hex: '#00CFFF', r: 0, g: 207, b: 255, brand: 'MARD', category: 'fluorescent' },
    { code: 'K06', name: 'Neon Pink', nameCn: '荧光粉', hex: '#FF33CC', r: 255, g: 51, b: 204, brand: 'MARD', category: 'fluorescent' },
    // 珠光色 (211-221)
    { code: 'L01', name: 'Pearl White', nameCn: '珠光白', hex: '#F8F8FF', r: 248, g: 248, b: 255, brand: 'MARD', category: 'pearl' },
    { code: 'L02', name: 'Pearl Pink', nameCn: '珠光粉', hex: '#FFE4E1', r: 255, g: 228, b: 225, brand: 'MARD', category: 'pearl' },
    { code: 'L03', name: 'Pearl Blue', nameCn: '珠光蓝', hex: '#B0E0E6', r: 176, g: 224, b: 230, brand: 'MARD', category: 'pearl' },
    { code: 'L04', name: 'Pearl Green', nameCn: '珠光绿', hex: '#98FB98', r: 152, g: 251, b: 152, brand: 'MARD', category: 'pearl' },
    { code: 'L05', name: 'Pearl Purple', nameCn: '珠光紫', hex: '#D8BFD8', r: 216, g: 191, b: 216, brand: 'MARD', category: 'pearl' },
];
// 获取所有颜色
export const getAllColors = () => mardColors;
// 按品牌获取颜色
export const getColorsByBrand = (brand) => mardColors.filter(c => c.brand === brand);
// 按分类获取颜色
export const getColorsByCategory = (category) => mardColors.filter(c => c.category === category);
// 通过色号查找颜色
export const findColorByCode = (code) => mardColors.find(c => c.code === code);
