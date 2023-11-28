import { getAuth, signOut as fbSignOut } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { USER_ID_LOCATION } from '../../global-vars/index.js'

export function signOut() {
    const auth = getAuth()
    return fbSignOut(auth)
}
