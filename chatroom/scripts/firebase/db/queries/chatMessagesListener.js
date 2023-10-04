import {
    getDatabase,
    ref,
    set,
    onValue,
    push,
    child,
    update,
    get,
    serverTimestamp,
    onDisconnect,
    onChildAdded,
    onChildRemoved,
    onChildChanged,
    query,
    orderByValue,
    orderByKey,
    orderByChild,
    limitToLast,
    limitToFirst,
    endAt,
    endBefore,
    startAt,
    startAfter,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js'
import { DATABASE_ROUTES, PAGE_SIZE } from '../../../global-vars/index.js'
import { createDomMessage } from '../../../dom-manipulation/createMessage.js'
import { sortByComparer } from '../../../utils/sortByComparer.js'

export function initChatMessagesListener(db) {
    const messagesListRef = ref(db, DATABASE_ROUTES.Chat)

    onChildAdded(query(messagesListRef, orderByChild('timestamp'), limitToLast(PAGE_SIZE)), (snapshot) => {
        if (!snapshot.exists()) return
        const data = snapshot.val()
        createDomMessage(data)
        window.oldestMessageTimeStamp = Math.min(window.oldestMessageTimeStamp ?? Number.MAX_SAFE_INTEGER, data.timestamp)
    })
}

export function scrollBackChatMessages(db) {
    if (window.oldestMessageTimeStamp === undefined) throw new Error('last message was not found')
    const messagesListRef = ref(db, DATABASE_ROUTES.Chat)
    return new Promise((resolve, reject) => {
        onValue(
            query(messagesListRef, orderByChild('timestamp'), endBefore(window.oldestMessageTimeStamp), limitToLast(PAGE_SIZE)),
            (snapshot) => {
                if (!snapshot.exists()) return resolve(false)
                const objectValues = snapshot.val()

                const container = $('#messages').removeClass('scroll-smooth')
                const containerEl = container.get(0)
                const { scrollHeight, scrollTop } = containerEl

                const prepend = true
                Object.values(objectValues)
                    .sort(sortByComparer(['timestamp'], false))
                    .forEach((data) => {
                        const timeout = createDomMessage(data, prepend)
                        if (timeout) clearTimeout(timeout)
                        window.oldestMessageTimeStamp = Math.min(window.oldestMessageTimeStamp ?? Number.MAX_SAFE_INTEGER, data.timestamp)
                    })

                const { scrollHeight: newScrollHeight, scrollTop: newScrollTop } = containerEl
                const top = newScrollHeight - scrollHeight - scrollTop

                //seamlessly scroll to the current view without user noticing
                containerEl.scrollTo({
                    top,
                    left: 0,
                    behaviour: 'instant',
                })
                container.addClass('scroll-smooth')
                resolve(true)
            },
            {
                onlyOnce: true,
            },
        )
    })
}
