import { addAlphaToHsl } from '../utils/randomColor.js'

const cubeWidth = parseInt(getComputedStyle($('main')[0]).getPropertyValue('--cube-vertice').replace('px', ''))
export function rotateCube({ x, y }, color) {
    const translateY = (cubeWidth * 0.5 * Math.cos((Math.PI * x) / 180)).toFixed(1)
    const translateZ = (cubeWidth * 0.5 * Math.sin((Math.PI * x) / 180)).toFixed(1)
    // console.log({ x, y, translateY, translateZ })
    $('.cube').css({
        transform: `rotateX(${x}deg) rotateY(${y}deg)`, // translateY(${translateY}px) translateZ(${translateZ}px)`,
    })
    $('.cube-face').css({
        backgroundColor: addAlphaToHsl(color, 0.8),
    })
}
