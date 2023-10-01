export function createDomMessage({ message, photoURL, username, timestamp, userId }) {
    const template = $('#message-template')
    const el = template
        .html((i, old) => old.trim())
        .contents()
        .clone(true, true)

    if (userId === window.currentUserData.uid) {
        applyCurrentUserChatStyles(el)
    }
    el.attr('data-uid', userId)

    const userNameId = crypto.randomUUID()
    function removeLoader() {
        const loader = $('[data-loading-image]', el).css('opacity', 0)
        setTimeout(() => {
            loader.remove()
        }, 500)
    }
    $('[data-image]', el).one('load', removeLoader).attr('src', photoURL)

    $('[data-username]', el).text(username).attr('id', userNameId)

    const messageEl = $('[data-message]', el).text(message).attr('aria-labelledby', `${userNameId} said`)
    const NR_CHARACTERS_ON_ONE_ROW = 28
    if (message.length >= NR_CHARACTERS_ON_ONE_ROW) messageEl.addClass(`min-w-[${NR_CHARACTERS_ON_ONE_ROW}ch]`)
    else messageEl.addClass('min-w-max')

    const messageContainer = $('#messages')
    const lastMessage = messageContainer.children('[data-uid]').last()

    const lastUserId = lastMessage.attr('data-uid')

    if (lastUserId === userId) {
        const textEl = $('[data-message]', el)
        lastMessage.children('[data-messages]').append(textEl)
        setTimeout(() => {
            textEl[0].scrollIntoView()
        }, 10)
        return
    }
    setTimeout(() => {
        el[0]?.scrollIntoView()
    }, 10)
    messageContainer.append(el)
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
}
