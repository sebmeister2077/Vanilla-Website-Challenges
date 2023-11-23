import {
    GoogleAuthProvider,
    signInWithPopup,
    getAuth,
    linkWithCredential,
    signInWithRedirect,
    linkWithPopup,
    signInWithCredential,
    AuthErrorCodes,
    signOut,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { parseJwt } from '../../utils/parseJwt.js'
import { updateAnonUserMessages } from '../db/mutations/updateAnonUserMessages.js'
import { getUserByEmail } from '../db/queries/getUserByEmail.js'
import { removeCurrentUser } from '../db/mutations/removeCurrentUser.js'
import { USER_ID_LOCATION } from '../../global-vars/index.js'
import { SECOND_MS } from '../../constants/time.js'
import { changeMessageUid } from '../../dom-manipulation/createMessage.js'
import { updateUser } from '../db/mutations/updateUser.js'

const provider = new GoogleAuthProvider()
provider.addScope('openid')
// provider.setCustomParameters({
//     login_hint: 'user@example.com',
// })

const nonce = crypto.randomUUID()
const googleTokenRequestUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
googleTokenRequestUrl.searchParams.set('redirect_uri', location.href)
googleTokenRequestUrl.searchParams.set('response_type', 'id_token')
googleTokenRequestUrl.searchParams.set('nonce', nonce)
googleTokenRequestUrl.searchParams.set(
    'scope',
    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
)

let isLoginInProgress = false
export function loginWithGoogle() {
    const clientId = window.googleClientId
    if (isLoginInProgress || !clientId) return

    isLoginInProgress = true
    googleTokenRequestUrl.searchParams.set('client_id', clientId)
    const width = 500,
        height = 700,
        left = (window.innerWidth - width) / 2,
        top = (window.innerHeight - height) / 2
    const w = window.open(googleTokenRequestUrl, 'newWindow', `popup,width=${width},height=${height},top=${top},left=${left}`)
    window.addEventListener('token-load', function listenForHash(e) {
        window.removeEventListener('token-load', listenForHash)
        const hash = e.detail.hash
        handleHash(hash)
    })
    function handleHash(hash) {
        const params = new URLSearchParams(hash.replace(/^#/, ''))
        const prompt = params.get('prompt')
        const authUser = params.get('authuser')

        //response type token
        const tokenType = params.get('token_type')
        const accessToken = params.get('access_token')
        const expiresIn = params.get('expires_in')

        //response type idToken
        const versionInfo = params.get('version_info')
        const idToken = params.get('id_token')
        const credential = GoogleAuthProvider.credential(idToken)

        const jwt = parseJwt(idToken)
        const auth = getAuth()
        const { email, name } = jwt

        linkWithCredential(auth.currentUser, credential)
            .then((userCred) => {
                const user = userCred.user
                setUserData({ photoURL: jwt.picture, name })
                $('google-btn').remove()
            })
            .catch(async (err) => {
                switch (err.code) {
                    case AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE:
                        const currentUid = auth.currentUser.uid
                        const userForEmail = await getUserByEmail(email)
                        if (!userForEmail) throw new Error('Idk bro')

                        await updateAnonUserMessages(currentUid, {
                            photoURL: userForEmail.photoURL,
                            username: name,
                            userId: userForEmail.uid,
                        })
                        await removeCurrentUser()
                        await signOut(auth)
                        localStorage.removeItem(USER_ID_LOCATION)

                        const credential = GoogleAuthProvider.credential(idToken)
                        const { user } = await signInWithCredential(auth, credential)
                        changeMessageUid(currentUid, { uid: userForEmail, photoURL: userForEmail.photoURL, name: userForEmail.name })
                        window.currentUserData = {
                            ...window.currentUserData,
                            uid: userForEmail.uid,
                            name: userForEmail.name,
                            photoURL: userForEmail.photoURL,
                        }
                        $('google-btn').remove()

                        break
                    default:
                        throw err
                }
            })
            .finally(() => {
                isLoginInProgress = false
            })
    }
}
