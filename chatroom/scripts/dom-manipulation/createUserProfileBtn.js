import { loginWithGoogle } from '../firebase/auth/loginWithGoogle.js'
import { signOut } from '../firebase/auth/signOut.js'
import { setUserData } from '../firebase/setGlobalData.js'
import { USER_ID_LOCATION } from '../global-vars/index.js'
import { resetUserStyles } from './createMessage.js'

export function createUserProfileBtn(photoURL) {
    const button = $('#current-user-profile-template')
        .html((i, old) => old.trim())
        .contents()
        .clone(true, true)
    let isOpen = false

    button.on('click', function (e) {
        const backdrop = button.children('[data-backdrop]')
        if (isOpen)
            setTimeout(() => {
                backdrop.addClass('hidden').addClass('z-[-10]').removeClass('z-10')
            }, 350)
        else backdrop.removeClass('hidden').removeClass('z-[-10]').addClass('z-10')
        requestAnimationFrame(() => {
            backdrop.toggleClass('bg-transparent').toggleClass('bg-gray-900/25')
        })
        button.children('[data-list]').toggleClass('scale-0')

        isOpen = !isOpen
    })
    button
        .children('[data-list]')
        .children('[data-change-account]')
        .on('click', function (e) {
            loginWithGoogle()
            button.remove()
            setUserData({
                isOnline: false,
            })
        })
    button
        .children('[data-list]')
        .children('[data-signout]')
        .on('click', function () {
            localStorage.removeItem(USER_ID_LOCATION)
            setUserData({
                isOnline: false,
            })
            const oldUid = window.currentUserData.uid
            window.currentUserData = {}
            signOut().then(() => {
                resetUserStyles(oldUid)
                button.remove()
                $('#google-btn').removeClass('hidden')
            })
        })

    button.children('[data-current-user-img]').attr('src', photoURL)
    return button
}
