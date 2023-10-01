import { initChatMessagesListener } from './queries/chatMessagesListener.js'
import { initCubeChangeListener } from './queries/cubeChangeLIstener.js'
import { initUserlistListener } from './queries/userlistListener.js'

export function initDatabaseListeners(db) {
    initChatMessagesListener(db)
    initCubeChangeListener(db)
    initUserlistListener(db)
}
