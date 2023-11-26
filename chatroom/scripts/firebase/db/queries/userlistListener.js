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
    equalTo,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js'
import { DATABASE_ROUTES } from '../../../global-vars/index.js'
import { updateOnlineFriends } from '../../../dom-manipulation/updateOnlineFriends.js'
import { HOUR_MS } from '../../../constants/time.js'
import { getUTCDate } from '../../../utils/getUTCDate.js'

export function initUserlistListener(db) {
    const currentOnlineUserUids = new Set()

    const usersListRef = ref(db, DATABASE_ROUTES.AllUsers)

    onValue(
        query(usersListRef, orderByChild('isOnline'), equalTo(true)),
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
        const svgEl = $(`[data-cursor][key=${data.uid}]`)
        // In case our code faild to update the isOnline field;
        const isOnline = data.isOnline && getUTCDate().getTime() - data.lastActiveAt <= 2 * HOUR_MS

        if (!isOnline && currentOnlineUserUids.has(data.uid)) {
            svgEl.remove()
            currentOnlineUserUids.delete(data.uid)
            updateOnlineFriends(currentOnlineUserUids.size)
            return
        }
        if (!isOnline) return

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
        newNode
            .attr('key', data.uid)
            .css({ opacity: 1 })
            .on('contextmenu', function (e) {
                e.preventDefault()
            })
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
