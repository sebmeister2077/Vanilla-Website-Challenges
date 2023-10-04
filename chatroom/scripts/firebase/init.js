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

const firebaseConfig = Object.freeze({
    apiKey: 'AIzaSyBbn4bnhT_c3j2gwaOWUoMI7iSo3qvFYu0',
    projectId: 'chatroom-000',
    appId: '1:55067342796:web:9488295327025826df8f69',
    databaseURL: 'https://chatroom-000-default-rtdb.europe-west1.firebasedatabase.app/',
    storageBucket: 'chatroom-000.appspot.com',
    measurementId: 'G-DS9YNWPK0C',
})
const appCheckPublicId = '6LdkVlcoAAAAAFgaHecRfj1tr5R58czFim3D77QB'

export function initFirebase() {
    if (IS_DEBUG) self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const performance = getPerformance(app)
    const analytics = getAnalytics(app)
    const storage = getStorage(app)

    //If you get lots of errors in console you have to paste the new id in the firebase console / app check section
    const appCheck = getAppCheck(app, appCheckPublicId)
    getToken(appCheck)
    const auth = getAuth(app)
    setPersistence(auth, indexedDBLocalPersistence)
    const db = getDatabase(app)

    return { performance, analytics, appCheck, auth, db, storage }
}
