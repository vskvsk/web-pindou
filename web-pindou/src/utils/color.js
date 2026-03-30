/**
 * 颜色空间转换和色差计算
 * RGB <-> Lab 转换 和 CIEDE2000 色差公式
 */
// RGB 转 XYZ
export function rgbToXyz(r, g, b) {
    // 归一化到 0-1
    let rNorm = r / 255;
    let gNorm = g / 255;
    let bNorm = b / 255;
    // 反gamma校正
    rNorm = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
    gNorm = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
    bNorm = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;
    // D65 标准光源
    const x = rNorm * 0.4124564 + gNorm * 0.3575761 + bNorm * 0.1804375;
    const y = rNorm * 0.2126729 + gNorm * 0.7151522 + bNorm * 0.0721750;
    const z = rNorm * 0.0193339 + gNorm * 0.1191920 + bNorm * 0.9503041;
    return { x: x * 100, y: y * 100, z: z * 100 };
}
// XYZ 转 Lab
export function xyzToLab(x, y, z) {
    // D65 参考白点
    const xRef = 95.047;
    const yRef = 100.000;
    const zRef = 108.883;
    let xNorm = x / xRef;
    let yNorm = y / yRef;
    let zNorm = z / zRef;
    xNorm = xNorm > 0.008856 ? Math.pow(xNorm, 1 / 3) : (7.787 * xNorm) + (16 / 116);
    yNorm = yNorm > 0.008856 ? Math.pow(yNorm, 1 / 3) : (7.787 * yNorm) + (16 / 116);
    zNorm = zNorm > 0.008856 ? Math.pow(zNorm, 1 / 3) : (7.787 * zNorm) + (16 / 116);
    const l = (116 * yNorm) - 16;
    const a = 500 * (xNorm - yNorm);
    const b = 200 * (yNorm - zNorm);
    return { l, a, b };
}
// RGB 转 Lab
export function rgbToLab(r, g, b) {
    const xyz = rgbToXyz(r, g, b);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
}
// CIEDE2000 色差计算
export function ciede2000(l1, a1, b1, l2, a2, b2, kL = 1, kC = 1, kH = 1) {
    // 计算 C1, C2
    const c1 = Math.sqrt(a1 * a1 + b1 * b1);
    const c2 = Math.sqrt(a2 * a2 + b2 * b2);
    // 计算 Cbar
    const cBar = (c1 + c2) / 2;
    // 计算 G
    const g = 0.5 * (1 - Math.sqrt(Math.pow(cBar, 7) / (Math.pow(cBar, 7) + Math.pow(25, 7))));
    // 计算 a1', a2'
    const a1Prime = a1 * (1 + g);
    const a2Prime = a2 * (1 + g);
    // 计算 C1', C2'
    const c1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
    const c2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);
    // 计算 h1', h2'
    let h1Prime = Math.atan2(b1, a1Prime) * (180 / Math.PI);
    if (h1Prime < 0)
        h1Prime += 360;
    let h2Prime = Math.atan2(b2, a2Prime) * (180 / Math.PI);
    if (h2Prime < 0)
        h2Prime += 360;
    // 计算 ΔL', ΔC', ΔH'
    const deltaLPrime = l2 - l1;
    const deltaCPrime = c2Prime - c1Prime;
    let deltahPrime;
    if (c1Prime * c2Prime === 0) {
        deltahPrime = 0;
    }
    else {
        deltahPrime = h2Prime - h1Prime;
        if (deltahPrime > 180)
            deltahPrime -= 360;
        else if (deltahPrime < -180)
            deltahPrime += 360;
    }
    const deltaHPrime = 2 * Math.sqrt(c1Prime * c2Prime) * Math.sin((deltahPrime / 2) * (Math.PI / 180));
    // 计算 Lbar', Cbar', Hbar'
    const lBarPrime = (l1 + l2) / 2;
    const cBarPrime = (c1Prime + c2Prime) / 2;
    let hBarPrime;
    if (c1Prime * c2Prime === 0) {
        hBarPrime = h1Prime + h2Prime;
    }
    else {
        hBarPrime = (h1Prime + h2Prime) / 2;
        if (Math.abs(h1Prime - h2Prime) > 180) {
            if (hBarPrime < 180)
                hBarPrime += 180;
            else
                hBarPrime -= 180;
        }
    }
    // 计算 T
    const t = 1 - 0.17 * Math.cos((hBarPrime - 30) * (Math.PI / 180))
        + 0.24 * Math.cos((2 * hBarPrime) * (Math.PI / 180))
        + 0.32 * Math.cos((3 * hBarPrime + 6) * (Math.PI / 180))
        - 0.20 * Math.cos((4 * hBarPrime - 63) * (Math.PI / 180));
    // 计算 SL, SC, SH
    const sl = 1 + (0.015 * Math.pow(lBarPrime - 50, 2)) / Math.sqrt(20 + Math.pow(lBarPrime - 50, 2));
    const sc = 1 + 0.045 * cBarPrime;
    const sh = 1 + 0.015 * cBarPrime * t;
    // 计算 RT
    const deltaTheta = 30 * Math.exp(-Math.pow((hBarPrime - 275) / 25, 2));
    const rc = 2 * Math.sqrt(Math.pow(cBarPrime, 7) / (Math.pow(cBarPrime, 7) + Math.pow(25, 7)));
    const rt = -rc * Math.sin((2 * deltaTheta) * (Math.PI / 180));
    // 计算最终色差
    const deltaE = Math.sqrt(Math.pow(deltaLPrime / (kL * sl), 2) +
        Math.pow(deltaCPrime / (kC * sc), 2) +
        Math.pow(deltaHPrime / (kH * sh), 2) +
        rt * (deltaCPrime / (kC * sc)) * (deltaHPrime / (kH * sh)));
    return deltaE;
}
// 简化的欧几里得距离（用于快速匹配）
export function euclideanDistance(r1, g1, b1, r2, g2, b2) {
    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
}
// 查找最接近的颜色（CIEDE2000）
export function findClosestColor(r, g, b, colorLibrary) {
    const targetLab = rgbToLab(r, g, b);
    let closestColor = colorLibrary[0];
    let minDistance = Infinity;
    for (const color of colorLibrary) {
        const colorLab = rgbToLab(color.r, color.g, color.b);
        const distance = ciede2000(targetLab.l, targetLab.a, targetLab.b, colorLab.l, colorLab.a, colorLab.b);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = color;
        }
    }
    return { color: closestColor, distance: minDistance };
}
// 快速查找（欧几里得距离）
export function findClosestColorFast(r, g, b, colorLibrary) {
    let closestColor = colorLibrary[0];
    let minDistance = Infinity;
    for (const color of colorLibrary) {
        const distance = euclideanDistance(r, g, b, color.r, color.g, color.b);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = color;
        }
    }
    return { color: closestColor, distance: minDistance };
}
// 颜色查找表缓存
export class ColorLUT {
    cache = new Map();
    colorLibrary;
    constructor(colorLibrary) {
        this.colorLibrary = colorLibrary;
    }
    lookup(r, g, b, useCIEDE2000 = true) {
        // 量化到 8 位以减少缓存大小
        const rQuantized = Math.round(r / 8) * 8;
        const gQuantized = Math.round(g / 8) * 8;
        const bQuantized = Math.round(b / 8) * 8;
        const key = `${rQuantized},${gQuantized},${bQuantized}`;
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        const findFn = useCIEDE2000 ? findClosestColor : findClosestColorFast;
        const result = findFn(r, g, b, this.colorLibrary);
        const colorInfo = { code: result.color.code, hex: result.color.hex };
        this.cache.set(key, colorInfo);
        return colorInfo;
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
}
