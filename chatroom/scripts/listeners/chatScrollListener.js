import { scrollBackChatMessages } from '../firebase/db/queries/chatMessagesListener.js'

export function testClick() {
    if (!window.db) return
    scrollBackChatMessages(db)
}
