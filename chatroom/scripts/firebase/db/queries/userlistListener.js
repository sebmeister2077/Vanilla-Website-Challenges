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
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js'
import { DATABASE_ROUTES, MAX_USERS_CONNECTION_LIMIT } from '../../../global-vars/index.js'
import { MINUTE_MS } from '../../../constants/time.js'

export function initUserlistListener(db) {
    const currentValueKeys = []
    const usersListRef = ref(db, DATABASE_ROUTES.AllUsers)
    onValue(usersListRef, (snapshot) => {
        if (!snapshot.exists()) return
        const data = snapshot.val()
        const NOW = Date.now()
        const OFFSET = 1 * MINUTE_MS // 1 min
        const { origin } = location

        const keys = Object.keys(data).filter((k) => data[k].isOnline)

        currentValueKeys.filter((ck) => !keys.includes(ck)).forEach((key) => $(`[key=${key}]`).remove())

        const newText = 'Online friends:' + keys.length + '/' + MAX_USERS_CONNECTION_LIMIT
        const info = $('.info')
        if (info.text() !== newText) info.text(newText)

        keys.forEach((key) => {
            if (currentValueKeys.includes(key)) {
                $(`svg[key=${key}]`)
                    .css({
                        translate: `${data[key].coords.x}px ${data[key].coords.y}px`,
                    })
                    .children('g')
                    .children('path')
                    .attr('stroke', data[key].color)
                return
            }
            currentValueKeys.push(key)
            const newNode = $('#cursor')
                .html((i, old) => old.trim())
                .contents()
                .clone(true, true)
            newNode.attr('key', key).css({ opacity: 1 })
            if (key === window.currentUserData.uid) {
                newNode
                    .css({
                        translate: `${data[key].coords.x}px ${data[key].coords.y}px`,
                        transition: 'translate 0.2s cubic-bezier(0, 0, 0, 1.1), transform .3s',
                        animation: 'none',
                    })
                    .addClass('show-cursor')
            }
            newNode.children('g').children('path').attr('stroke', data[key].color)
            $(document.body).append(newNode)
        })
    })
}
