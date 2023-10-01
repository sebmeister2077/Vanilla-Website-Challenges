import {
    getDatabase,
    ref,
    set,
    onValue,
    push,
    child,
    update,
    get,
    serverTimestamp,
    onDisconnect,
    onChildAdded,
    onChildRemoved,
    onChildChanged,
    query,
    orderByValue,
    orderByKey,
    orderByChild,
    limitToLast,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js'
import { setCubeData } from '../../setGlobalData.js'
import { rotateCube } from '../../../dom-manipulation/rotateCube.js'
import { DATABASE_ROUTES } from '../../../global-vars/index.js'

export function initCubeChangeListener(db) {
    const cubeRef = ref(db, DATABASE_ROUTES.Cube)
    onValue(cubeRef, (snapshot) => {
        const DEFAULT_COLOR = 'hsl(0, 0%, 100%)'
        const DEFAULT_ROTATION = { x: 125, y: 0 }
        if (!snapshot.exists()) {
            setCubeData({ movingUserId: '', rotation: DEFAULT_ROTATION, color: DEFAULT_COLOR })
            return
        }
        window.currentCubeData = snapshot.val()

        if (!window.currentCubeData.rotation) {
            setCubeData({ ...window.currentCubeData, rotation: DEFAULT_ROTATION })
            return
        }
        rotateCube(window.currentCubeData.rotation, window.currentCubeData.color || DEFAULT_COLOR)
    })
}
