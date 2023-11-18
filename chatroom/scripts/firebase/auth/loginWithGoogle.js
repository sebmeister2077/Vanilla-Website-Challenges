import {
    GoogleAuthProvider,
    signInWithPopup,
    getAuth,
    linkWithCredential,
    signInWithRedirect,
    linkWithPopup,
    AuthErrorCodes,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
const provider = new GoogleAuthProvider()
// provider.addScope()
// provider.setCustomParameters({
//     login_hint: 'user@example.com',
// })

const googleTokenRequestUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
googleTokenRequestUrl.searchParams.set('redirect_uri', location.href)
googleTokenRequestUrl.searchParams.set('response_type', 'token')
googleTokenRequestUrl.searchParams.set('scope', 'email profile')

let isLoginInProgress = false
export function loginWithGoogle() {
    const clientId = window.googleClientId
    if (isLoginInProgress || !clientId) return

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
        const tokenType = params.get('token_type')
        const accessToken = params.get('access_token')
        const expiresIn = params.get('expires_in')
        const prompt = params.get('prompt')
        const authUser = params.get('authuser')
    }
    // isLoginInProgress = true

    // const auth = getAuth()
    // console.log('🚀 ~ file: loginWithGoogle.js:13 ~ loginWithGoogle ~ auth:', auth)
    // signInWithPopup(auth, provider)
    //     .then((result) => {
    //         const credential = GoogleAuthProvider.credentialFromResult(result)
    //         console.log('🚀 ~ file: loginWithGoogle.js:14 ~ signInWithPopup ~ credential:', credential)
    //     })
    //     .catch((error) => {
    //         console.dir(error)

    //         switch (error.code) {
    //             case AuthErrorCodes.NEED_CONFIRMATION:
    //                 break
    //             default:
    //                 toastr.error('Something went wrong')
    //         }

    //         const credential = GoogleAuthProvider.credentialFromError(error)
    //         console.log('🚀 ~ file: loginWithGoogle.js:18 ~ signInWithPopup ~ credential:', credential)
    //     })
    //     .finally(() => {
    //         isLoginInProgress = false
    //     })
}
