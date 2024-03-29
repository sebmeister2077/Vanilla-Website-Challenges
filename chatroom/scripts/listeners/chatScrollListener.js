import { scrollBackChatMessages } from '../firebase/db/queries/chatMessagesListener.js'
import { throttleFunction } from '../utils/throttleFunction.js'

let isFetching = false
let prevTop = 0
let moreData = true
export const chatScrollListener = function (e) {
    if (!window.db || isFetching || !moreData) return

    const { scrollHeight, scrollTop, clientHeight } = this
    const isScrollingDown = prevTop <= scrollTop
    prevTop = scrollTop
    if (isScrollingDown) return //user scrolling down (important for autoscrolling)

    const PAGE_OFFSET = 80 //pixels
    const isScrolledToTop = scrollTop <= PAGE_OFFSET
    if (!isScrolledToTop) return

    isFetching = true
    scrollBackChatMessages(window.db).then((hasMore) => {
        isFetching = false
        moreData = hasMore
    })
}
