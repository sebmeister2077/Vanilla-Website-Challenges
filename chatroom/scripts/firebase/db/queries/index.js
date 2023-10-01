import { initChatMessagesListener } from './chatMessagesListener.js'
import { initCubeChangeListener } from './cubeChangeLIstener.js'
import { initUserlistListener } from './userlistListener.js'

export function initDatabaseListeners(db) {
    initChatMessagesListener(db)
    initCubeChangeListener(db)
    initUserlistListener(db)
}
