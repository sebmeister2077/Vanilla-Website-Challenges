import { setCubeData } from '../firebase/setGlobalData.js'

export function cubeMousedown(e) {
    if (!window.auth?.currentUser) return
    if (window.currentCubeData.movingUserId !== window.currentUserData.uid && window.currentCubeData.movingUserId) return

    e.stopPropagation()
    startPosition.x = e.clientX
    startPosition.y = e.clientY
    setCubeData({
        movingUserId: window.currentUserData.uid,
        color: window.currentUserData.color,
    })
}
