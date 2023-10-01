export function getRandomColor() {
    const hue = Math.floor(Math.random() * 361)
    const saturation = 100
    const lightness = Math.floor(Math.random() * 41) + 15
    return `hsl(${hue},${saturation}%,${lightness}%)`
}
export function addAlphaToHsl(hsl, alpha) {
    return hsl
        .split('%)')
        .join(`%, ${Math.max(Math.min(alpha, 1), 0)})`)
        .replace('hsl', 'hsla')
}
