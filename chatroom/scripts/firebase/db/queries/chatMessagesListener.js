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
import { DATABASE_ROUTES } from '../../../global-vars.js'

export function initChatMessagesListener(db) {
    const messagesListRef = ref(db, DATABASE_ROUTES.Chat)
    onChildAdded(query(messagesListRef, orderByChild('timestamp'), limitToLast(100)), (data) => {
        const val = data.val()
        createDomMessage(val)
    })
}
