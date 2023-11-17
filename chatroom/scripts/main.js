import { initFirebase } from './firebase/init.js'
import { userConnectionMade } from './firebase/db/mutations/userConnectionMade.js'

import { initDOMListeners } from './listeners/index.js'
import { USER_ID_LOCATION } from './global-vars/index.js'
import { initDatabaseListeners } from './firebase/db/queries/index.js'
import { HOUR_MS } from './constants/time.js'
import { loginAnonymously } from './firebase/auth/loginAnonymously.js'

$(async function () {
    const { analytics, appCheck, auth, db, performance, storage } = await initFirebase()
    window.db = db
    window.auth = auth
    window.storage = storage

    let isLoggedIn = false
    let lastActiveAtInterval = null
    auth.onAuthStateChanged((user) => {
        if (lastActiveAtInterval) clearInterval(lastActiveAtInterval)
        if (!user) {
            if (localStorage.getItem(USER_ID_LOCATION)) return
            loginAnonymously(auth)
            return
        }
        localStorage.setItem(USER_ID_LOCATION, user.uid)
        userConnectionMade(db, user, isLoggedIn)
        if (isLoggedIn) return
        isLoggedIn = true
        initDatabaseListeners(db)
        lastActiveAtInterval = setInterval(() => {
            window.currentUserData.lastActiveAt = Date.now()
        }, 1 * HOUR_MS)
    })

    initDOMListeners()
})
