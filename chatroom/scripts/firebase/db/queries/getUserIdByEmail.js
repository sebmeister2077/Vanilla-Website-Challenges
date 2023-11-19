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

export async function getUserIdByEmail(email) {
    const db = getDatabase()
    const usersListRef = ref(db, DATABASE_ROUTES.AllUsers)
    return new Promise((resolve, reject) => {
        if (!email) {
            reject('Email is not valid')
            return
        }
        onValue(
            query(usersListRef, orderByChild('email'), equalTo(email.trim()), limitToFirst(1)),
            (snapshot) => {
                if (snapshot.exists()) resolve(Object.keys(snapshot.val())?.[0] ?? null)
                else resolve(null)
            },
            {
                onlyOnce: true,
            },
        )
    })
}
