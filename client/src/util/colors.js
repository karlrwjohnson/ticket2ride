// https://www.youtube.com/watch?v=lOIP_Z_-0Hs
const CIRCLE = 2 * Math.PI;
const THIRD_CIRCLE = CIRCLE / 3;
const TWO_THIRDS_CIRCLE = CIRCLE / 3 * 2

const PHI = (1 + Math.sqrt(5)) / 2;
const ANGLE = CIRCLE / PHI;

export function getColor(id) {
    const r = Math.min(255, 128 + (256 * Math.cos(id * ANGLE)) | 0);
    const g = Math.min(255, 128 + (256 * Math.cos(id * ANGLE + THIRD_CIRCLE)) | 0);
    const b = Math.min(255, 128 + (256 * Math.cos(id * ANGLE + TWO_THIRDS_CIRCLE)) | 0);
    return `rgb(${r}, ${g}, ${b})`;
}

export const COLORS = [
    '#cccccc',
    getColor(0),
    getColor(1),
    getColor(2),
    getColor(3),
    getColor(4),
    getColor(5),
    getColor(6),
];

