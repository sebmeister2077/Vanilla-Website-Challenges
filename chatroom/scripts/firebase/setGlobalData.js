import { updateUser } from './db/mutations/updateUser.js'
import { updateCube } from './db/mutations/updateCube.js'

window.currentUserData = {}
window.currentCubeData = {}
export function setCubeData(data) {
    Object.assign(window.currentCubeData, data)
    if (window.currentCubeData.color === undefined || window.currentCubeData.movingUserId === undefined || !window.db) return
    updateCube(window.db, window.currentCubeData)
}
export function setUserData(data) {
    Object.assign(window.currentUserData, data)
    if (!window.currentUserData.uid || !window.db) return
    updateUser(window.db, currentUserData)
}
