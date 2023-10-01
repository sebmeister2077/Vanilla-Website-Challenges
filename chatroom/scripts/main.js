import { signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { initFirebase } from './firebase/init.js'
import { userConnectionMade } from './firebase/db/mutations/userConnectionMade.js'

import { initDOMListeners } from './listeners/index.js'
import { USER_ID_LOCATION } from './global-vars/index.js'

$(function () {
    var { analytics, appCheck, auth, db, performance } = initFirebase()
    window.db = db

    var lastActiveAtInterval = null
    auth.onAuthStateChanged((user) => {
        if (lastActiveAtInterval) clearInterval(lastActiveAtInterval)
        if (!user) {
            if (localStorage.getItem(USER_ID_LOCATION)) return
            signInAnonymously(auth)
            return
        }
        localStorage.setItem(USER_ID_LOCATION, user.uid)
        userConnectionMade(db, user)
        lastActiveAtInterval = setInterval(() => {
            window.currentUserData.lastActiveAt = Date.now()
            //1hour
        }, 3600000)
    })

    initDOMListeners()

    // //initial messages render
    // onValue(
    //     messagesListRef,
    //     (snapshot) => {
    //         if (!snapshot.exists()) return
    //         const values = snapshot.val()
    //         const messages = Object.keys(values)
    //             .map((k) => values[k])
    //             .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
    //         // .forEach(createDomMessage)
    //     },
    //     { onlyOnce: true },
    // )
    //listen for new messages
})
