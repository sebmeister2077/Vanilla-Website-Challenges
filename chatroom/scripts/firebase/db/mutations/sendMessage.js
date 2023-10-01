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

export function pushToChat(db, message) {
    const messagesListRef = ref(db, DATABASE_ROUTES.Chat)
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
    // createDomMessage({
    //     ...data,
    //     timestamp: Date.now(),
    // })
}
