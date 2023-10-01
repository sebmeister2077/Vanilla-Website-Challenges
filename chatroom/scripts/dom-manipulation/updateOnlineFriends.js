import { MAX_USERS_CONNECTION_LIMIT } from '../global-vars/index.js'

let previous = 0
export function updateOnlineFriends(newCount) {
    if (previous == newCount) return
    previous = newCount
    const newText = 'Online friends:' + previous + '/' + MAX_USERS_CONNECTION_LIMIT
    $('.info').text(newText)
}
