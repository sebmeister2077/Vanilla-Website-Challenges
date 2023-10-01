import { initializeAppCheck, ReCaptchaV3Provider } from 'https://cdnjs.cloudflare.com/ajax/libs/firebase/10.4.0/firebase-app-check.min.js'
export function getAppCheck(app, token) {
    return initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(token),
        isTokenAutoRefreshEnabled: true,
    })
}
