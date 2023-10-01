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
import { setUserData } from '../../setGlobalData.js'
import { applyCurrentUserChatStyles } from '../../../dom-manipulation/createMessage.js'
import { getRandomImage } from '../../../utils/randomImage.js'

export function userConnectionMade(db, user) {
    const currentUserRef = child(ref(db), DATABASE_ROUTES.OneUser(user.uid))
    get(currentUserRef).then(async (snapshot) => {
        var val = {}
        if (snapshot.exists()) {
            val = snapshot.val()
        }
        window.currentUserData.color = val.color ?? getRandomColor()
        window.currentUserData.photoURL = val.photoURL ?? (await getRandomImage())
        window.currentUserData.name = val.name ?? user.displayName ?? faker.internet.userName()
        setUserData({
            isOnline: true,
            uid: user.uid,
            coords: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            lastActiveAt: Date.now(),
        })
        applyCurrentUserChatStyles($(`#messages > [data-uid=${user.uid}]`))

        onDisconnect(ref(db, DATABASE_ROUTES.LastOnline(user.uid))).set(serverTimestamp())
        onDisconnect(ref(db, DATABASE_ROUTES.OnlineStatus(user.uid))).set(false)
    })
}
