import { MAX_USERS_CONNECTION_LIMIT } from '../global-vars/index.js'

let previous = 0
export function updateOnlineFriends(newCount) {
    if (previous == newCount) return
    previous = newCount
    $('.info').attr('data-online-friends', previous + '/' + MAX_USERS_CONNECTION_LIMIT)
}
