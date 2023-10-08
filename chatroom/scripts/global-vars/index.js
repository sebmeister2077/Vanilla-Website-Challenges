export const USER_ID_LOCATION = 'chatroom_user_uid'
export const IS_DEBUG = window.location.hostname === '127.0.0.1'
export const DATABASE_ROUTES = new (class {
    Cube = 'cube'
    AllUsers = 'users'
    OneUser(uid) {
        if (!uid) throw new Error('Uid is not defined')
        return this.AllUsers + '/' + uid
    }
    LastOnline(uid) {
        return this.OneUser(uid) + '/lastActiveAt'
    }
    OnlineStatus(uid) {
        return this.OneUser(uid) + '/isOnline'
    }
    InfoConnected = '.info/connected'
    #Chat = 'chat'
    PublicChat = this.#Chat + '/public'
    PrivateChat(chatId) {
        if (!chatId) throw new Error('chatId is not defined')
        return this.#Chat + '/' + chatId
    }
})()
export const STORAGE_ROUTES = {
    SavePublic: (id) => `public/${id || throwError('Bro, id is undefined')}`,
}
export const MAX_USERS_CONNECTION_LIMIT = 100
export const PAGE_SIZE = 20
