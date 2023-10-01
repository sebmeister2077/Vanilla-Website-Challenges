import { pushToChat } from '../firebase/db/mutations/sendMessage.js'

export function messageSubmit(e) {
    if (!window.auth?.currentUser || !window.db) return

    e.stopPropagation()
    e.preventDefault()
    const formData = new FormData(e.target)
    const message = formData.get('message').trim()
    if (!message) return
    e.target.reset()
    pushToChat(window.db, message)
}
