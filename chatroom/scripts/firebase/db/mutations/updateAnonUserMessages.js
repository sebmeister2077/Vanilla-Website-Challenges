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
    limitToFirst,
    equalTo,
    endBefore,
    endAt,
    startAfter,
    startAt,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js'
import { DATABASE_ROUTES } from '../../../global-vars/index.js'

export function updateAnonUserMessages(oldUserId = 'mgtlGaYVrEYlIc7yHjLFnuA8omr1', newData) {
    const db = getDatabase()
    const publicMessagesListRef = ref(db, DATABASE_ROUTES.PublicChat)
    if (!oldUserId || !publicMessagesListRef) return
    const { photoURL, userId, username } = newData
    onValue(
        query(publicMessagesListRef, orderByChild('userId'), equalTo(oldUserId)),
        (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key
                const childData = childSnapshot.val()
                const newData = {
                    ...childData,
                    photoURL,
                    username,
                    userId,
                }
                console.log('🚀 ~ file: updateAnonUserMessages.js:41 ~ snapshot.forEach ~ newData:', newData)
                // set(ref(db, `${DATABASE_ROUTES.PublicChat}/${childKey}`), newData)
            })
            console.log(snapshot.val())
        },
        {
            onlyOnce: true,
        },
    )
}
