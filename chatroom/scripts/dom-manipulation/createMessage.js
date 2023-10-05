import { DAY_MS } from '../constants/time.js'
import { utcTimestampToLocalTime } from '../utils/utcTimestampToLocalTime.js'

var scrollTimeout = null
let oldestTimestamp = null
let newestTimestamp = null
export function createDomMessage({ message, photoURL, username, timestamp, userId }, prepend = false) {
    oldestTimestamp = oldestTimestamp ?? timestamp
    newestTimestamp = newestTimestamp ?? timestamp

    if (scrollTimeout) clearTimeout(scrollTimeout)
    scrollTimeout = null

    const needsTimeSeparator = prepend
        ? new Date(oldestTimestamp).getDate() != new Date(timestamp).getDate()
        : new Date(newestTimestamp).getDate() != new Date(timestamp).getDate()
    oldestTimestamp = Math.min(oldestTimestamp, timestamp)
    newestTimestamp = Math.max(newestTimestamp, timestamp)

    const template = $('#message-template')
    const el = template
        .html((i, old) => old.trim())
        .contents()
        .clone(true, true)

    if (userId === window.currentUserData.uid) {
        applyCurrentUserChatStyles(el)
    }
    el.attr('data-uid', userId).attr('data-timestamp', timestamp)

    const userNameId = crypto.randomUUID()
    function removeLoader() {
        const loader = $('[data-loading-image]', el).css('opacity', 0)
        setTimeout(() => {
            loader.remove()
        }, 500)
    }
    $('[data-image]', el).one('load', removeLoader).attr('src', photoURL)

    $('[data-username]', el).text(username).attr('id', userNameId)

    const localTime = utcTimestampToLocalTime(timestamp)
    const messageEl = $('[data-message]', el).text(message).attr('aria-labelledby', `${userNameId} said`).attr('data-local-time', localTime)
    const NR_CHARACTERS_ON_ONE_ROW = 28
    if (message.length >= NR_CHARACTERS_ON_ONE_ROW) messageEl.addClass(`min-w-[${NR_CHARACTERS_ON_ONE_ROW}ch]`)
    else if (message.length < 3) messageEl.addClass('min-w-[3rem]')
    else messageEl.addClass('min-w-max')

    const messageContainer = $('#messages')
    const lastMessage = messageContainer.children('[data-uid]').last()
    const firstMessage = messageContainer.children('[data-uid]').first()

    const firstUserId = firstMessage.attr('data-uid')
    const lastUserId = lastMessage.attr('data-uid')

    if (lastUserId === userId && !prepend && !needsTimeSeparator) {
        const textEl = $('[data-message]', el)
        lastMessage.children('[data-messages]').append(textEl)
        return setScroll()
    }
    if (firstUserId === userId && prepend && !needsTimeSeparator) {
        const textEl = $('[data-message]', el)
        firstMessage.children('[data-messages]').children('[data-username]').after(textEl)
        // setScroll(textEl)
        return
    }

    function setScroll() {
        scrollTimeout = setTimeout(() => {
            messageContainer.get(0).scrollTo(0, messageContainer.get(0).scrollHeight)
        }, 100)
        return scrollTimeout
    }

    if (prepend) {
        if (needsTimeSeparator) messageContainer.prepend(getTimeSeparator(timestamp))
        messageContainer.prepend(el)
    } else {
        if (needsTimeSeparator) messageContainer.append(getTimeSeparator(timestamp))
        messageContainer.append(el)
    }
    return setScroll()
}
const timeFormattor = new Intl.RelativeTimeFormat(navigator.language, {
    numeric: 'auto',
})
function getTimeSeparator(timeStamp) {
    const daysAgo = Math.ceil((timeStamp - Date.now()) / DAY_MS)
    return $('#time-separator-template')
        .html((i, old) => old.trim())
        .contents()
        .clone(true, true)
        .text(timeFormattor.format(daysAgo, 'day'))
}

export function applyCurrentUserChatStyles(jqueryEl) {
    jqueryEl
        .addClass('flex-row-reverse')
        .children('[data-messages]')
        .removeClass('items-start')
        .addClass('items-end')
        .children('[data-message]')
        .addClass('bg-yellow-400/[.85]')
        .attr('data-currentuser', '')
        .removeClass('after:left-1')
        .addClass('after:right-1')
}
