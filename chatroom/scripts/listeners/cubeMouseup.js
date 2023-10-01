import { setCubeData } from '../firebase/setGlobalData.js'

export function cubeMouseup(e) {
    if (!window.auth?.currentUser) return

    if (window.currentCubeData.movingUserId === window.currentUserData.uid && window.currentUserData.uid) return
    setCubeData({ movingUserId: '', color: '' })
}
