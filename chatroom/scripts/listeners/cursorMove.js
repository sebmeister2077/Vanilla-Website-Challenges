import { setUserData } from '../firebase/setGlobalData.js'
import { throttleFunction } from '../utils/throttleFunction.js'

export const throttledCursorMove = throttleFunction(function (e) {
    const { buttons } = e.originalEvent

    // e.stopPropagation()
    if (!window.auth?.currentUser) return

    const cursorSvg = $(`svg[key=${window.currentUserData.uid}]`)
    //because aside is now higher z-index
    // const isInChat = false && isUnderElement('aside', e)
    // if (isInChat) {
    //     cursorSvg.css('opacity', 0)
    //     return
    // }

    cursorSvg.css({
        translate: `${e.clientX}px ${e.clientY}px`,
    })
    if (buttons === 1) cursorSvg.addClass('scale-150')
    else cursorSvg.removeClass('scale-150')

    const coords = { x: e.clientX, y: e.clientY }
    if (!coords.x && !coords.y) {
        const touch = e.touches[0]
        coords.x = touch.clientX
        coords.y = touch.clientY
    }
    setUserData({
        coords,
    })
}, 70)
