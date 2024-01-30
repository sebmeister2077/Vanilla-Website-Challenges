import { DAY_MS } from '../constants/time.js';
import { utcTimestampToLocalTime } from '../utils/utcTimestampToLocalTime.js';
import { getUTCDate } from '../utils/getUTCDate.js';

var scrollTimeout = null;
let oldestTimestamp = null;
let newestTimestamp = null;
export function createDomMessage({ message, imageUrl, imageThumbUrl, photoURL, username, timestamp, userId }, prepend = false) {
    oldestTimestamp = oldestTimestamp ?? timestamp;
    newestTimestamp = newestTimestamp ?? timestamp;

    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = null;

    const needsTimeSeparator = prepend
        ? getUTCDate(oldestTimestamp).getDate() != getUTCDate(timestamp).getDate()
        : getUTCDate(newestTimestamp).getDate() != getUTCDate(timestamp).getDate();
    oldestTimestamp = Math.min(oldestTimestamp, timestamp);
    newestTimestamp = Math.max(newestTimestamp, timestamp);

    const isMessage = message && typeof message === 'string';
    const template = $('#message-template');
    const el = template
        .html((i, old) => old.trim())
        .contents()
        .clone(true, true);

    if (userId === window.currentUserData.uid) {
        applyCurrentUserChatStyles(el);
    }
    el.attr('data-uid', userId);

    const userNameId = crypto.randomUUID();
    function removeLoader() {
        const loader = $('[data-loading-image]', el).css('opacity', 0);
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
    $('[data-image]', el).one('load', removeLoader).attr('src', photoURL);

    $('[data-username]', el).text(username).attr('id', userNameId);

    const localTime = utcTimestampToLocalTime(timestamp);
    const messageContainer = $('#messages');

    const messageEl = $('[data-message]', el).attr('data-local-time', localTime).attr('data-timestamp', timestamp);
    if (isMessage) {
        messageEl.text(message).attr('aria-labelledby', `${userNameId} said`);
        const NR_CHARACTERS_ON_ONE_ROW = 28;
        const NR_TIME_CHARACTERS = 5;
        if (message.length >= NR_CHARACTERS_ON_ONE_ROW) messageEl.addClass(`min-w-[${NR_CHARACTERS_ON_ONE_ROW}ch]`);
        else if (message.length < NR_TIME_CHARACTERS) messageEl.addClass('min-w-[3rem]');
        else messageEl.addClass('min-w-max');
    } else {
        //is image
        const image = $(document.createElement('img'));
        const imageContainer = messageEl;
        imageContainer.get(0).className = '';
        imageContainer
            .addClass('p-4')
            .addClass('rounded-xl')
            .addClass('w-full')
            .addClass('bg-no-repeat')
            .addClass('relative')
            .addClass('bg-cover')
            .addClass('bg-center')
            .addClass('shadow-lg')
            .addClass('min-h-32');
        if (imageThumbUrl) imageContainer.addClass('animate-pulse').addClass(`bg-[url('${imageThumbUrl}')]`);

        function removeLoadingAnimation() {
            imageContainer.removeClass('animate-pulse');
            image.removeClass('opacity-0');
        }
        // if (image.get(0).complete) removeLoadingAnimation();
        image.on('load', removeLoadingAnimation);
        image
            .addClass('opacity-0')
            .addClass('duration-1000')
            .addClass('w-full')
            .addClass('object-cover')
            .addClass('object-center')
            .addClass('rounded-xl')
            .addClass('border')
            .addClass('border-gray-50/[.20]')
            .attr('data-chat-image', '')
            .attr('loading', 'lazy')
            .attr('src', imageUrl);

        imageContainer.append(image);
    }

    const lastMessage = messageContainer.children('[data-uid]').last();
    const firstMessage = messageContainer.children('[data-uid]').first();

    const firstUserId = firstMessage.attr('data-uid');
    const lastUserId = lastMessage.attr('data-uid');

    if (lastUserId === userId && !prepend && !needsTimeSeparator) {
        const textEl = $('[data-message]', el);
        lastMessage.children('[data-messages]').append(textEl);
        return setScroll();
    }
    if (firstUserId === userId && prepend && !needsTimeSeparator) {
        const textEl = $('[data-message]', el);
        firstMessage.children('[data-messages]').children('[data-username]').after(textEl);
        // setScroll(textEl)
        return;
    }

    function setScroll() {
        scrollTimeout = setTimeout(() => {
            const height = messageContainer.get(0).scrollHeight + 300;
            messageContainer.get(0).scrollTo(0, height);
        }, 100);
        return scrollTimeout;
    }

    if (prepend) {
        if (needsTimeSeparator) {
            const lastMessageTimestamp = parseInt($('[data-timestamp][data-message]', messageContainer).attr('data-timestamp'));
            const newTimeStamp = getTimeSeparator(lastMessageTimestamp);
            messageContainer.prepend(newTimeStamp);
        }
        messageContainer.prepend(el);
    } else {
        if (needsTimeSeparator) messageContainer.append(getTimeSeparator(timestamp));
        messageContainer.append(el);
    }
    return setScroll();
}
const timeFormattor = new Intl.RelativeTimeFormat(navigator.language, {
    numeric: 'auto',
});
export function getTimeSeparator(timeStamp) {
    const utcNow = getUTCDate(new Date());
    const dayDifference = (timeStamp - utcNow.getTime()) / DAY_MS;

    const daysAgo = dayDifference > 0 ? Math.floor(dayDifference) : Math.ceil(dayDifference);

    return $('#time-separator-template')
        .html((i, old) => old.trim())
        .contents()
        .clone(true, true)
        .text(timeFormattor.format(daysAgo, 'day'));
}

export function applyCurrentUserChatStyles(uidOrEl = window.currentUserData.uid) {
    const messageContainers = uidOrEl instanceof jQuery ? uidOrEl : $(`[data-uid=${uidOrEl}]`);
    messageContainers
        .addClass('flex-row-reverse')
        .attr('data-currentuser', '')
        .children('[data-messages]')
        .removeClass('items-start')
        .addClass('items-end')
        .children('[data-message]')
        .addClass('bg-yellow-400/[.85]')
        .removeClass('after:left-1')
        .addClass('after:right-1');
}

export function resetUserStyles(uid) {
    const messageContainers = $(`[data-uid=${uid}][data-currentuser]`);
    messageContainers
        .removeClass('flex-row-reverse')
        .removeAttr('data-currentuser', '')
        .children('[data-messages]')
        .addClass('items-start')
        .removeClass('items-end')
        .children('[data-message]')
        .removeClass('bg-yellow-400/[.85]')
        .addClass('after:left-1')
        .removeClass('after:right-1');
}

export function changeMessageUid(oldUid, { uid, name, photoURL }) {
    const messageContainers = $(`[data-uid=${oldUid}]`).attr('data-uid', uid);
    applyCurrentUserChatStyles(uid);
    $('[data-username]', messageContainers).text(name);
    $('[data-image]', messageContainers).attr('src', photoURL);
}
