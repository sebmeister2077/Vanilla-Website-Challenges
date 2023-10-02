export const USER_ID_LOCATION = 'chatroom_user_uid'
export const IS_DEBUG = window.location.hostname === '127.0.0.1'
export const DATABASE_ROUTES = new (class {
    #BASE_ROUTE = 'env/' + (IS_DEBUG ? 'development' : window.location.hostname.replace(/\./g, '_'))
    Cube = this.#BASE_ROUTE + '/cube'
    AllUsers = this.#BASE_ROUTE + '/users'
    OneUser(uid) {
        if (!uid) throw Error('Uid is not defined')
        return this.AllUsers + '/' + uid
    }
    LastOnline(uid) {
        return this.OneUser(uid) + '/lastActiveAt'
    }
    OnlineStatus(uid) {
        return this.OneUser(uid) + '/isOnline'
    }
    InfoConnected = '.info/connected'
    Chat = this.#BASE_ROUTE + '/chat'
})()
export const MAX_USERS_CONNECTION_LIMIT = 100
export const PAGE_SIZE = 5
