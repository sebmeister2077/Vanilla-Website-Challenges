import {
    getDatabase,
    ref,
    set,
    onValue,
    push,
    child,
    update,
    get,
    remove,
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

let isRemoving = false
export async function removeCurrentUser() {
    const db = getDatabase()
    const uid = window.currentUserData.uid
    if (!uid || !db || isRemoving) return
    isRemoving = true
    const currentUserRef = ref(db, DATABASE_ROUTES.OneUser(uid))
    await remove(currentUserRef)
    isRemoving = false
}
