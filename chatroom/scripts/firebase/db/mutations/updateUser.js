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
import { SECOND_MS } from '../../../constants/time.js'

let lastErrorTime = null
let lastErrorTimeout = null
export function updateUser(db, userData) {
    if (lastErrorTime !== null || Date.now() - lastErrorTime < 5 * SECOND_MS) return

    update(ref(db), { [DATABASE_ROUTES.OneUser(userData.uid)]: userData }).catch(({ code }) => {
        if (code === 'PERMISSION_DENIED') {
            console.log(userData)
            window.toastr.error('Something went wrong')
            lastErrorTime = Date.now()
            if (lastErrorTime) clearTimeout(lastErrorTimeout)
            setTimeout(() => {
                lastErrorTime = null
                lastErrorTimeout = null
            }, 7 * SECOND_MS)
        }
    })
}
