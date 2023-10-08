import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js'
import {
    getAuth,
    signInAnonymously,
    setPersistence,
    indexedDBLocalPersistence,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getPerformance } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-performance.js'
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js'
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js'

import { getToken } from 'https://cdnjs.cloudflare.com/ajax/libs/firebase/10.4.0/firebase-app-check.min.js'
import { IS_DEBUG } from '../global-vars/index.js'
import { getAppCheck } from './appcheck/index.js'

export async function initFirebase() {
    const ENV_LOCATION = 'firebase_config'
    let config
    try {
        // x50 faster that await import();
        const localEnvData = sessionStorage.getItem(ENV_LOCATION)
        if (localEnvData) config = JSON.parse(localEnvData)
    } catch {
        //its mallformed
        sessionStorage.removeItem(ENV_LOCATION)
    }
    if (!config) {
        if (IS_DEBUG) {
            config = (await import('../../env.local.json', { assert: { type: 'json' } })).default
            self.FIREBASE_APPCHECK_DEBUG_TOKEN = config.LOCAL_RECAPTCHA_DEBUG_TOKEN
        } else config = (await import('../../env.json', { assert: { type: 'json' } })).default
        sessionStorage.setItem(ENV_LOCATION, JSON.stringify(config))
    }
    Object.freeze(config)

    // Initialize Firebase
    const app = initializeApp(config)
    const performance = getPerformance(app)
    const analytics = getAnalytics(app)
    const storage = getStorage(app)

    //If you get lots of errors in console you have to paste the new id in the firebase console / app check section
    const appCheck = getAppCheck(app, config.appCheckPublicId)
    getToken(appCheck)
    const auth = getAuth(app)
    setPersistence(auth, indexedDBLocalPersistence)
    const db = getDatabase(app)

    return { performance, analytics, appCheck, auth, db, storage }
}
