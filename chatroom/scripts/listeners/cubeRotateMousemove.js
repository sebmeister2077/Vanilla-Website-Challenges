import { NO_BUTTON, SCROLL_BUTTON } from '../constants/mouseButtons.js'
import { setCubeData } from '../firebase/setGlobalData.js'
import { throttleFunction } from '../utils/throttleFunction.js'

export const throttleCubeRotate = (startPosition) =>
    throttleFunction((e) => {
        if (!window.auth?.currentUser) return

        if (e.buttons === SCROLL_BUTTON && !window.currentCubeData.movingUserId && auth.currentUser) {
            setCubeData({ movingUserId: window.currentUserData.uid })
            startPosition.x = e.clientX
            startPosition.y = e.clientY
        }
        if (
            window.currentCubeData.movingUserId !== window.currentUserData.uid ||
            !window.currentCubeData.movingUserId ||
            !window.currentUserData.uid
        )
            return

        if (e.buttons !== SCROLL_BUTTON) {
            if (window.currentCubeData.movingUserId === window.currentUserData.uid)
                setCubeData({
                    movingUserId: '',
                    color: '',
                })
            return
        }
        const SENSITIVITY = 0.05
        const { clientX, clientY } = e
        const currentRotation = window.currentCubeData.rotation
        const deltaX = startPosition.x - clientX
        const deltaY = startPosition.y - clientY

        currentRotation.x = (parseFloat(currentRotation.x) + deltaY * SENSITIVITY).toFixed(2)
        currentRotation.y = (parseFloat(currentRotation.y) + deltaX * SENSITIVITY).toFixed(2)
        setCubeData({
            rotation: currentRotation,
            color: window.currentUserData.color,
        })
    }, 80)
