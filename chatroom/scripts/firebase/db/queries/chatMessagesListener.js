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
import { createDomMessage, getTimeSeparator } from '../../../dom-manipulation/createMessage.js'
import { sortByComparer } from '../../../utils/sortByComparer.js'
import { SECOND_MS } from '../../../constants/time.js'

export function initChatMessagesListener(db, chatId) {
    const messagesListRef = ref(db, chatId ? DATABASE_ROUTES.PrivateChat(chatId) : DATABASE_ROUTES.PublicChat)

    let timeout = null
    let firstTimestamp = null
    let initialMessageCount = 0
    function prepareTimeSeparatorTimeout(newTimestamp) {
        firstTimestamp = Math.min(firstTimestamp ?? Number.MAX_SAFE_INTEGER, newTimestamp)
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
            if (initialMessageCount >= PAGE_SIZE) return
            console.log('ok')

            $('#messages').prepend(getTimeSeparator(firstTimestamp))
        }, 0.6 * SECOND_MS)
    }
    onChildAdded(query(messagesListRef, orderByChild('timestamp'), limitToLast(PAGE_SIZE)), (snapshot) => {
        if (!snapshot.exists()) return
        const data = snapshot.val()
        initialMessageCount++
        prepareTimeSeparatorTimeout(data.timestamp)

        createDomMessage(data)
        window.oldestMessageTimeStamp = Math.min(window.oldestMessageTimeStamp ?? Number.MAX_SAFE_INTEGER, data.timestamp)
    })
}

export function scrollBackChatMessages(db, chatId) {
    if (window.oldestMessageTimeStamp === undefined) throw new Error('last message was not found')
    const messagesListRef = ref(db, chatId ? DATABASE_ROUTES.PrivateChat(chatId) : DATABASE_ROUTES.PublicChat)

    return new Promise((resolve, reject) => {
        onValue(
            query(messagesListRef, orderByChild('timestamp'), endBefore(window.oldestMessageTimeStamp), limitToLast(PAGE_SIZE)),
            (snapshot) => {
                if (!snapshot.exists()) return resolve(false)
                const valuesArr = Object.values(snapshot.val()).sort(sortByComparer(['timestamp'], false))

                const container = $('#messages').removeClass('scroll-smooth')
                const containerEl = container.get(0)
                const { scrollHeight: oldScrollHeight, scrollTop: oldScrollTop } = containerEl

                const prepend = true
                valuesArr.forEach((data) => {
                    const timeout = createDomMessage(data, prepend)
                    if (timeout) clearTimeout(timeout)
                    window.oldestMessageTimeStamp = Math.min(window.oldestMessageTimeStamp ?? Number.MAX_SAFE_INTEGER, data.timestamp)
                })

                const { scrollHeight: newScrollHeight, scrollTop: newScrollTop } = containerEl
                const top = newScrollHeight - oldScrollHeight - oldScrollTop

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
