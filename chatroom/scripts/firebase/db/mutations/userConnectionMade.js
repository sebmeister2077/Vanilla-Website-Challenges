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
import { getRandomColor } from '../../../utils/randomColor.js'
import { uploadRandomImage } from '../../storage/uploadImage.js'

export function userConnectionMade(db, user, isAlreadyLoggedIn = false) {
    const currentUserRef = child(ref(db), DATABASE_ROUTES.OneUser(user.uid))
    get(currentUserRef).then(async (snapshot) => {
        var val = {}
        if (snapshot.exists()) val = snapshot.val()
        else toastr.info('Setting up anonymous profile...')

        window.currentUserData.color = val.color ?? getRandomColor()
        window.currentUserData.photoURL = user.photoURL ?? val.photoURL ?? (await uploadRandomImage())
        window.currentUserData.name = user.displayName ?? val.name ?? faker.internet.userName()
        if (user.email) window.currentUserData.email = user.email
        setUserData({
            isOnline: true,
            uid: user.uid,
            coords: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            lastActiveAt: Date.now(),
        })
        applyCurrentUserChatStyles($(`#messages > [data-uid=${user.uid}]`))
        if (isAlreadyLoggedIn) return

        //these are applied on the server after user looses connection
        onDisconnect(ref(db, DATABASE_ROUTES.LastOnline(user.uid))).set(serverTimestamp())
        onDisconnect(ref(db, DATABASE_ROUTES.OnlineStatus(user.uid))).set(false)
    })
}
