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
import { DATABASE_ROUTES } from '../../../global-vars/index.js'

export function pushToChat(db, message, chatId) {
    const messagesListRef = ref(db, chatId ? DATABASE_ROUTES.PrivateChat(chatId) : DATABASE_ROUTES.PublicChat)
    if (!window.currentUserData.uid || !messagesListRef) return
    const newMessageRef = push(messagesListRef)
    const data = {
        userId: window.currentUserData.uid,
        username: window.currentUserData.name,
        photoURL: window.currentUserData.photoURL,
        message,
    }
    set(newMessageRef, {
        ...data,
        timestamp: serverTimestamp(),
    })
}
