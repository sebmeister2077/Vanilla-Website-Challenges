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
    startAt,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js'
import { DATABASE_ROUTES } from '../../../global-vars/index.js'
import { updateOnlineFriends } from '../../../dom-manipulation/updateOnlineFriends.js'

export function initUserlistListener(db) {
    const currentOnlineUserUids = new Set()

    const usersListRef = query(ref(db, DATABASE_ROUTES.AllUsers))

    //current user will show as offline
    onValue(
        usersListRef,
        (snapshot) => {
            if (!snapshot.exists()) return
            const data = snapshot.val()
            Object.keys(data).forEach((key) => {
                handleData(data[key])
            })
        },
        { onlyOnce: true },
    )
    onChildChanged(usersListRef, (snapshot) => {
        handleData(snapshot.val())
    })

    function handleData(data) {
        const svgEl = $(`.bubble[key=${data.uid}]`)

        if (!data.isOnline && currentOnlineUserUids.has(data.uid)) {
            svgEl.remove()
            currentOnlineUserUids.delete(data.uid)
            updateOnlineFriends(currentOnlineUserUids.size)
            return
        }
        if (!data.isOnline) return

        if (currentOnlineUserUids.has(data.uid)) {
            svgEl
                .css({
                    translate: `${data.coords.x}px ${data.coords.y}px`,
                })
                .children('g')
                .children('path')
                .attr('stroke', data.color)
            return
        }

        currentOnlineUserUids.add(data.uid)
        updateOnlineFriends(currentOnlineUserUids.size)

        const newNode = $('#cursor')
            .html((i, old) => old.trim())
            .contents()
            .clone(true, true)
        newNode.attr('key', data.uid).css({ opacity: 1 })
        if (svgEl === window.currentUserData.uid) {
            newNode
                .css({
                    translate: `${data.coords.x}px ${data.coords.y}px`,
                    transition: 'translate 0.2s cubic-bezier(0, 0, 0, 1.1), transform .3s',
                    animation: 'none',
                })
                .addClass('show-cursor')
        }
        newNode.children('g').children('path').attr('stroke', data.color)
        $(document.body).append(newNode)
    }
}
