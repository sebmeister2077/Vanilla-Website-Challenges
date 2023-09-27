import {
    _getProvider,
    getApp as e,
    _registerComponent as t,
    registerVersion as r,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
const n = {
    byteToCharMap_: null,
    charToByteMap_: null,
    byteToCharMapWebSafe_: null,
    charToByteMapWebSafe_: null,
    ENCODED_VALS_BASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    get ENCODED_VALS() {
        return this.ENCODED_VALS_BASE + '+/='
    },
    get ENCODED_VALS_WEBSAFE() {
        return this.ENCODED_VALS_BASE + '-_.'
    },
    HAS_NATIVE_SUPPORT: 'function' == typeof atob,
    encodeByteArray(n, e) {
        if (!Array.isArray(n)) throw Error('encodeByteArray takes an array as a parameter')
        this.init_()
        const o = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
            i = []
        for (let r = 0; r < n.length; r += 3) {
            var a = n[r],
                s = r + 1 < n.length,
                c = s ? n[r + 1] : 0,
                h = r + 2 < n.length,
                l = h ? n[r + 2] : 0
            let e = ((15 & c) << 2) | (l >> 6),
                t = 63 & l
            h || ((t = 64), s || (e = 64)), i.push(o[a >> 2], o[((3 & a) << 4) | (c >> 4)], o[e], o[t])
        }
        return i.join('')
    },
    encodeString(e, t) {
        return this.HAS_NATIVE_SUPPORT && !t
            ? btoa(e)
            : this.encodeByteArray(
                  (function (r) {
                      const n = []
                      let o = 0
                      for (let t = 0; t < r.length; t++) {
                          let e = r.charCodeAt(t)
                          e < 128
                              ? (n[o++] = e)
                              : (e < 2048
                                    ? (n[o++] = (e >> 6) | 192)
                                    : (55296 == (64512 & e) && t + 1 < r.length && 56320 == (64512 & r.charCodeAt(t + 1))
                                          ? ((e = 65536 + ((1023 & e) << 10) + (1023 & r.charCodeAt(++t))),
                                            (n[o++] = (e >> 18) | 240),
                                            (n[o++] = ((e >> 12) & 63) | 128))
                                          : (n[o++] = (e >> 12) | 224),
                                      (n[o++] = ((e >> 6) & 63) | 128)),
                                (n[o++] = (63 & e) | 128))
                      }
                      return n
                  })(e),
                  t,
              )
    },
    decodeString(r, n) {
        if (this.HAS_NATIVE_SUPPORT && !n) return atob(r)
        {
            var o = this.decodeStringToByteArray(r, n)
            const h = []
            let e = 0,
                t = 0
            for (; e < o.length; ) {
                var i,
                    a,
                    s,
                    c = o[e++]
                c < 128
                    ? (h[t++] = String.fromCharCode(c))
                    : 191 < c && c < 224
                    ? ((i = o[e++]), (h[t++] = String.fromCharCode(((31 & c) << 6) | (63 & i))))
                    : 239 < c && c < 365
                    ? ((i = (((7 & c) << 18) | ((63 & o[e++]) << 12) | ((63 & o[e++]) << 6) | (63 & o[e++])) - 65536),
                      (h[t++] = String.fromCharCode(55296 + (i >> 10))),
                      (h[t++] = String.fromCharCode(56320 + (1023 & i))))
                    : ((a = o[e++]), (s = o[e++]), (h[t++] = String.fromCharCode(((15 & c) << 12) | ((63 & a) << 6) | (63 & s))))
            }
            return h.join('')
        }
    },
    decodeStringToByteArray(t, e) {
        this.init_()
        const r = e ? this.charToByteMapWebSafe_ : this.charToByteMap_,
            n = []
        for (let e = 0; e < t.length; ) {
            var o = r[t.charAt(e++)],
                i = e < t.length ? r[t.charAt(e)] : 0,
                a = ++e < t.length ? r[t.charAt(e)] : 64,
                s = ++e < t.length ? r[t.charAt(e)] : 64
            if ((++e, null == o || null == i || null == a || null == s)) throw new DecodeBase64StringError()
            if ((n.push((o << 2) | (i >> 4)), 64 !== a)) {
                const t = ((i << 4) & 240) | (a >> 2)
                if ((n.push(t), 64 !== s)) {
                    const t = ((a << 6) & 192) | s
                    n.push(t)
                }
            }
        }
        return n
    },
    init_() {
        if (!this.byteToCharMap_) {
            ;(this.byteToCharMap_ = {}), (this.charToByteMap_ = {}), (this.byteToCharMapWebSafe_ = {}), (this.charToByteMapWebSafe_ = {})
            for (let e = 0; e < this.ENCODED_VALS.length; e++)
                (this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e)),
                    (this.charToByteMap_[this.byteToCharMap_[e]] = e),
                    (this.byteToCharMapWebSafe_[e] = this.ENCODED_VALS_WEBSAFE.charAt(e)),
                    (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e) >= this.ENCODED_VALS_BASE.length &&
                        ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e),
                        (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e))
        }
    },
}
class DecodeBase64StringError extends Error {
    constructor() {
        super(...arguments), (this.name = 'DecodeBase64StringError')
    }
}
const base64Decode = function (e) {
    try {
        return n.decodeString(e, !0)
    } catch (e) {
        console.error('base64Decode failed: ', e)
    }
    return null
}
class Deferred {
    constructor() {
        ;(this.reject = () => {}),
            (this.resolve = () => {}),
            (this.promise = new Promise((e, t) => {
                ;(this.resolve = e), (this.reject = t)
            }))
    }
    wrapCallback(r) {
        return (e, t) => {
            e ? this.reject(e) : this.resolve(t), 'function' == typeof r && (this.promise.catch(() => {}), 1 === r.length ? r(e) : r(e, t))
        }
    }
}
function isIndexedDBAvailable() {
    try {
        return 'object' == typeof indexedDB
    } catch (e) {
        return !1
    }
}
class FirebaseError extends Error {
    constructor(e, t, r) {
        super(t),
            (this.code = e),
            (this.customData = r),
            (this.name = 'FirebaseError'),
            Object.setPrototypeOf(this, FirebaseError.prototype),
            Error.captureStackTrace && Error.captureStackTrace(this, ErrorFactory.prototype.create)
    }
}
class ErrorFactory {
    constructor(e, t, r) {
        ;(this.service = e), (this.serviceName = t), (this.errors = r)
    }
    create(e, ...t) {
        var n,
            t = t[0] || {},
            r = this.service + '/' + e,
            e = this.errors[e],
            e = e
                ? ((n = t),
                  e.replace(o, (e, t) => {
                      var r = n[t]
                      return null != r ? String(r) : `<${t}?>`
                  }))
                : 'Error',
            e = this.serviceName + `: ${e} (${r}).`
        return new FirebaseError(r, e, t)
    }
}
const o = /\{\$([^}]+)}/g
function jsonEval(e) {
    return JSON.parse(e)
}
const issuedAtTime = function (e) {
    const t = (function (e) {
        let t = {},
            r = {},
            n = {},
            o = ''
        try {
            var i = e.split('.')
            ;(t = jsonEval(base64Decode(i[0]) || '')), (r = jsonEval(base64Decode(i[1]) || '')), (o = i[2]), (n = r.d || {}), delete r.d
        } catch (e) {}
        return {
            header: t,
            claims: r,
            data: n,
            signature: o,
        }
    })(e).claims
    return 'object' == typeof t && t.hasOwnProperty('iat') ? t.iat : null
}
class Component {
    constructor(e, t, r) {
        ;(this.name = e),
            (this.instanceFactory = t),
            (this.type = r),
            (this.multipleInstances = !1),
            (this.serviceProps = {}),
            (this.instantiationMode = 'LAZY'),
            (this.onInstanceCreated = null)
    }
    setInstantiationMode(e) {
        return (this.instantiationMode = e), this
    }
    setMultipleInstances(e) {
        return (this.multipleInstances = e), this
    }
    setServiceProps(e) {
        return (this.serviceProps = e), this
    }
    setInstanceCreatedCallback(e) {
        return (this.onInstanceCreated = e), this
    }
}
var i
!(function (e) {
    ;(e[(e.DEBUG = 0)] = 'DEBUG'),
        (e[(e.VERBOSE = 1)] = 'VERBOSE'),
        (e[(e.INFO = 2)] = 'INFO'),
        (e[(e.WARN = 3)] = 'WARN'),
        (e[(e.ERROR = 4)] = 'ERROR'),
        (e[(e.SILENT = 5)] = 'SILENT')
})((i = i || {}))
const a = {
        debug: i.DEBUG,
        verbose: i.VERBOSE,
        info: i.INFO,
        warn: i.WARN,
        error: i.ERROR,
        silent: i.SILENT,
    },
    s = i.INFO,
    c = {
        [i.DEBUG]: 'log',
        [i.VERBOSE]: 'log',
        [i.INFO]: 'info',
        [i.WARN]: 'warn',
        [i.ERROR]: 'error',
    },
    defaultLogHandler = (e, t, ...r) => {
        if (!(t < e.logLevel)) {
            var n = new Date().toISOString(),
                o = c[t]
            if (!o) throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)
            console[o](`[${n}]  ${e.name}:`, ...r)
        }
    },
    h = new Map(),
    l = {
        activated: !1,
        tokenObservers: [],
    },
    u = {
        initialized: !1,
        enabled: !1,
    }
function getStateReference(e) {
    return h.get(e) || Object.assign({}, l)
}
function getDebugState() {
    return u
}
const d = 'https://content-firebaseappcheck.googleapis.com/v1',
    p = 3e4,
    g = 96e4
class Refresher {
    constructor(e, t, r, n, o) {
        if (
            ((this.operation = e),
            (this.retryPolicy = t),
            (this.getWaitDuration = r),
            (this.lowerBound = n),
            (this.upperBound = o),
            (this.pending = null),
            o < (this.nextErrorWaitInterval = n))
        )
            throw new Error('Proactive refresh lower bound greater than upper bound!')
    }
    start() {
        ;(this.nextErrorWaitInterval = this.lowerBound), this.process(!0).catch(() => {})
    }
    stop() {
        this.pending && (this.pending.reject('cancelled'), (this.pending = null))
    }
    isRunning() {
        return !!this.pending
    }
    async process(e) {
        this.stop()
        try {
            ;(this.pending = new Deferred()),
                (t = this.getNextRun(e)),
                await new Promise((e) => {
                    setTimeout(e, t)
                }),
                this.pending.resolve(),
                await this.pending.promise,
                (this.pending = new Deferred()),
                await this.operation(),
                this.pending.resolve(),
                await this.pending.promise,
                this.process(!0).catch(() => {})
        } catch (e) {
            this.retryPolicy(e) ? this.process(!1).catch(() => {}) : this.stop()
        }
        var t
    }
    getNextRun(e) {
        if (e) return (this.nextErrorWaitInterval = this.lowerBound), this.getWaitDuration()
        {
            const e = this.nextErrorWaitInterval
            return (
                (this.nextErrorWaitInterval *= 2),
                this.nextErrorWaitInterval > this.upperBound && (this.nextErrorWaitInterval = this.upperBound),
                e
            )
        }
    }
}
const f = new ErrorFactory('appCheck', 'AppCheck', {
    'already-initialized':
        'You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.',
    'use-before-activation':
        'App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.',
    'fetch-network-error': 'Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.',
    'fetch-parse-error': 'Fetch client could not parse response. Original error: {$originalErrorMessage}.',
    'fetch-status-error': 'Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.',
    'storage-open': 'Error thrown when opening storage. Original error: {$originalErrorMessage}.',
    'storage-get': 'Error thrown when reading from storage. Original error: {$originalErrorMessage}.',
    'storage-set': 'Error thrown when writing to storage. Original error: {$originalErrorMessage}.',
    'recaptcha-error': 'ReCAPTCHA error.',
    throttled: 'Requests throttled due to {$httpStatus} error. Attempts allowed again after {$time}',
})
function getRecaptcha(e = !1) {
    return e ? (null == (e = self.grecaptcha) ? void 0 : e.enterprise) : self.grecaptcha
}
function ensureActivated(e) {
    if (!getStateReference(e).activated)
        throw f.create('use-before-activation', {
            appName: e.name,
        })
}
function getDurationString(e) {
    var e = Math.round(e / 1e3),
        t = Math.floor(e / 86400),
        r = Math.floor((e - 3600 * t * 24) / 3600),
        n = Math.floor((e - 3600 * t * 24 - 3600 * r) / 60),
        e = e - 3600 * t * 24 - 3600 * r - 60 * n
    let o = ''
    return t && (o += pad(t) + 'd:'), r && (o += pad(r) + 'h:'), (o += pad(n) + 'm:' + pad(e) + 's')
}
function pad(e) {
    return 0 === e ? '00' : 10 <= e ? e.toString() : '0' + e
}
async function exchangeToken({ url: e, body: t }, r) {
    const n = {
            'Content-Type': 'application/json',
        },
        o = r.getImmediate({
            optional: !0,
        })
    if (o) {
        const e = await o.getHeartbeatsHeader()
        e && (n['X-Firebase-Client'] = e)
    }
    r = {
        method: 'POST',
        body: JSON.stringify(t),
        headers: n,
    }
    let i, a
    try {
        i = await fetch(e, r)
    } catch (e) {
        throw f.create('fetch-network-error', {
            originalErrorMessage: null == e ? void 0 : e.message,
        })
    }
    if (200 !== i.status)
        throw f.create('fetch-status-error', {
            httpStatus: i.status,
        })
    try {
        a = await i.json()
    } catch (e) {
        throw f.create('fetch-parse-error', {
            originalErrorMessage: null == e ? void 0 : e.message,
        })
    }
    t = a.ttl.match(/^([\d.]+)(s)$/)
    if (!t || !t[2] || isNaN(Number(t[1])))
        throw f.create('fetch-parse-error', {
            originalErrorMessage: 'ttl field (timeToLive) is not in standard Protobuf Duration format: ' + a.ttl,
        })
    ;(r = 1e3 * Number(t[1])), (t = Date.now())
    return {
        token: a.token,
        expireTimeMillis: t + r,
        issuedAtTimeMillis: t,
    }
}
function getExchangeDebugTokenRequest(e, t) {
    var { projectId: e, appId: r, apiKey: n } = e.options
    return {
        url: d + `/projects/${e}/apps/${r}:exchangeDebugToken?key=` + n,
        body: {
            debug_token: t,
        },
    }
}
const k = 'firebase-app-check-store'
let T = null
function getDBPromise() {
    return (
        T ||
        (T = new Promise((t, r) => {
            try {
                const e = indexedDB.open('firebase-app-check-database', 1)
                ;(e.onsuccess = (e) => {
                    t(e.target.result)
                }),
                    (e.onerror = (e) => {
                        r(
                            f.create('storage-open', {
                                originalErrorMessage: null == (e = e.target.error) ? void 0 : e.message,
                            }),
                        )
                    }),
                    (e.onupgradeneeded = (e) => {
                        const t = e.target.result
                        0 === e.oldVersion &&
                            t.createObjectStore(k, {
                                keyPath: 'compositeKey',
                            })
                    })
            } catch (t) {
                r(
                    f.create('storage-open', {
                        originalErrorMessage: null == t ? void 0 : t.message,
                    }),
                )
            }
        }))
    )
}
async function write(e, t) {
    const n = (await getDBPromise()).transaction(k, 'readwrite'),
        o = n.objectStore(k).put({
            compositeKey: e,
            value: t,
        })
    return new Promise((t, r) => {
        ;(o.onsuccess = (e) => {
            t()
        }),
            (n.onerror = (e) => {
                r(
                    f.create('storage-set', {
                        originalErrorMessage: null == (e = e.target.error) ? void 0 : e.message,
                    }),
                )
            })
    })
}
async function read(e) {
    const n = (await getDBPromise()).transaction(k, 'readonly'),
        o = n.objectStore(k).get(e)
    return new Promise((t, r) => {
        ;(o.onsuccess = (e) => {
            e = e.target.result
            t(e ? e.value : void 0)
        }),
            (n.onerror = (e) => {
                r(
                    f.create('storage-get', {
                        originalErrorMessage: null == (e = e.target.error) ? void 0 : e.message,
                    }),
                )
            })
    })
}
function computeKey(e) {
    return e.options.appId + '-' + e.name
}
const E = new (class {
    constructor(e) {
        ;(this.name = e), (this._logLevel = s), (this._logHandler = defaultLogHandler), (this._userLogHandler = null)
    }
    get logLevel() {
        return this._logLevel
    }
    set logLevel(e) {
        if (!(e in i)) throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``)
        this._logLevel = e
    }
    setLogLevel(e) {
        this._logLevel = 'string' == typeof e ? a[e] : e
    }
    get logHandler() {
        return this._logHandler
    }
    set logHandler(e) {
        if ('function' != typeof e) throw new TypeError('Value assigned to `logHandler` must be a function')
        this._logHandler = e
    }
    get userLogHandler() {
        return this._userLogHandler
    }
    set userLogHandler(e) {
        this._userLogHandler = e
    }
    debug(...e) {
        this._userLogHandler && this._userLogHandler(this, i.DEBUG, ...e), this._logHandler(this, i.DEBUG, ...e)
    }
    log(...e) {
        this._userLogHandler && this._userLogHandler(this, i.VERBOSE, ...e), this._logHandler(this, i.VERBOSE, ...e)
    }
    info(...e) {
        this._userLogHandler && this._userLogHandler(this, i.INFO, ...e), this._logHandler(this, i.INFO, ...e)
    }
    warn(...e) {
        this._userLogHandler && this._userLogHandler(this, i.WARN, ...e), this._logHandler(this, i.WARN, ...e)
    }
    error(...e) {
        this._userLogHandler && this._userLogHandler(this, i.ERROR, ...e), this._logHandler(this, i.ERROR, ...e)
    }
})('@firebase/app-check')
async function readTokenFromStorage(t) {
    if (isIndexedDBAvailable()) {
        let e
        try {
            e = await read(computeKey(t))
        } catch (t) {
            E.warn('Failed to read token from IndexedDB. Error: ' + t)
        }
        return e
    }
}
function writeTokenToStorage(e, t) {
    return isIndexedDBAvailable()
        ? ((t = t),
          write(computeKey(e), t).catch((e) => {
              E.warn('Failed to write token to IndexedDB. Error: ' + e)
          }))
        : Promise.resolve()
}
async function readOrCreateDebugTokenFromStorage() {
    let e
    try {
        e = await read('debug-token')
    } catch (e) {}
    if (e) return e
    {
        const e = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (e) => {
            const t = (16 * Math.random()) | 0
            return ('x' === e ? t : (3 & t) | 8).toString(16)
        })
        return write('debug-token', e).catch((e) => E.warn('Failed to persist debug token to IndexedDB. Error: ' + e)), e
    }
}
function isDebugMode() {
    return getDebugState().enabled
}
async function getDebugToken() {
    var e = getDebugState()
    if (e.enabled && e.token) return e.token.promise
    throw Error("\n            Can't get debug token in production mode.\n        ")
}
function initializeDebugMode() {
    const e = (function () {
            if ('undefined' != typeof self) return self
            if ('undefined' != typeof window) return window
            if ('undefined' != typeof global) return global
            throw new Error('Unable to locate global object.')
        })(),
        t = getDebugState()
    if (((t.initialized = !0), 'string' == typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN || !0 === e.FIREBASE_APPCHECK_DEBUG_TOKEN)) {
        t.enabled = !0
        const r = new Deferred()
        ;(t.token = r),
            'string' == typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN
                ? r.resolve(e.FIREBASE_APPCHECK_DEBUG_TOKEN)
                : r.resolve(readOrCreateDebugTokenFromStorage())
    }
}
const m = {
    error: 'UNKNOWN_ERROR',
}
async function getToken$2(e, t = !1) {
    var r = e.app
    ensureActivated(r)
    const n = getStateReference(r)
    let o,
        i = n.token
    if ((i && !isValid(i) && ((n.token = void 0), (i = void 0)), !i)) {
        const e = await n.cachedTokenPromise
        e && (isValid(e) ? (i = e) : await writeTokenToStorage(r, void 0))
    }
    if (!t && i && isValid(i))
        return {
            token: i.token,
        }
    let a,
        s = !1
    if (isDebugMode()) {
        n.exchangeTokenPromise ||
            ((n.exchangeTokenPromise = exchangeToken(
                getExchangeDebugTokenRequest(r, await getDebugToken()),
                e.heartbeatServiceProvider,
            ).finally(() => {
                n.exchangeTokenPromise = void 0
            })),
            (s = !0))
        const t = await n.exchangeTokenPromise
        return (
            await writeTokenToStorage(r, t),
            {
                token: (n.token = t).token,
            }
        )
    }
    try {
        n.exchangeTokenPromise ||
            ((n.exchangeTokenPromise = n.provider.getToken().finally(() => {
                n.exchangeTokenPromise = void 0
            })),
            (s = !0)),
            (i = await getStateReference(r).exchangeTokenPromise)
    } catch (e) {
        'appCheck/throttled' === e.code ? E.warn(e.message) : E.error(e), (o = e)
    }
    return (
        i
            ? o
                ? (a = isValid(i)
                      ? {
                            token: i.token,
                            internalError: o,
                        }
                      : makeDummyTokenResult(o))
                : ((a = {
                      token: i.token,
                  }),
                  await writeTokenToStorage(r, (n.token = i)))
            : (a = makeDummyTokenResult(o)),
        s && notifyTokenListeners(r, a),
        a
    )
}
async function getLimitedUseToken$1(e) {
    var t = e.app
    ensureActivated(t)
    const r = getStateReference(t)['provider']
    if (isDebugMode()) {
        const r = await getDebugToken(),
            n = (await exchangeToken(getExchangeDebugTokenRequest(t, r), e.heartbeatServiceProvider))['token']
        return {
            token: n,
        }
    }
    {
        const e = (await r.getToken())['token']
        return {
            token: e,
        }
    }
}
function addTokenListener(e, t, r, n) {
    const o = e['app'],
        i = getStateReference(o),
        a = {
            next: r,
            error: n,
            type: t,
        }
    if (((i.tokenObservers = [...i.tokenObservers, a]), i.token && isValid(i.token))) {
        const t = i.token
        Promise.resolve()
            .then(() => {
                r({
                    token: t.token,
                }),
                    initTokenRefresher(e)
            })
            .catch(() => {})
    }
    i.cachedTokenPromise.then(() => initTokenRefresher(e))
}
function removeTokenListener(e, t) {
    const r = getStateReference(e),
        n = r.tokenObservers.filter((e) => e.next !== t)
    0 === n.length && r.tokenRefresher && r.tokenRefresher.isRunning() && r.tokenRefresher.stop(), (r.tokenObservers = n)
}
function initTokenRefresher(e) {
    const t = e['app'],
        r = getStateReference(t)
    let n = r.tokenRefresher
    n ||
        ((n = (function (t) {
            const r = t['app']
            return new Refresher(
                async () => {
                    var e = getStateReference(r).token ? await getToken$2(t, !0) : await getToken$2(t)
                    if (e.error) throw e.error
                    if (e.internalError) throw e.internalError
                },
                () => !0,
                () => {
                    var e,
                        t = getStateReference(r)
                    return t.token
                        ? ((e = t.token.issuedAtTimeMillis + 0.5 * (t.token.expireTimeMillis - t.token.issuedAtTimeMillis) + 3e5),
                          (t = t.token.expireTimeMillis - 3e5),
                          (e = Math.min(e, t)),
                          Math.max(0, e - Date.now()))
                        : 0
                },
                p,
                g,
            )
        })(e)),
        (r.tokenRefresher = n)),
        !n.isRunning() && r.isTokenAutoRefreshEnabled && n.start()
}
function notifyTokenListeners(e, t) {
    var r = getStateReference(e).tokenObservers
    for (const e of r)
        try {
            'EXTERNAL' === e.type && null != t.error ? e.error(t.error) : e.next(t)
        } catch (e) {}
}
function isValid(e) {
    return 0 < e.expireTimeMillis - Date.now()
}
function makeDummyTokenResult(e) {
    return {
        token: ((t = m), n.encodeString(JSON.stringify(t), !1)),
        error: e,
    }
    var t
}
class AppCheckService {
    constructor(e, t) {
        ;(this.app = e), (this.heartbeatServiceProvider = t)
    }
    _delete() {
        var e = getStateReference(this.app)['tokenObservers']
        for (const t of e) removeTokenListener(this.app, t.next)
        return Promise.resolve()
    }
}
function initializeV3(t, r) {
    const n = new Deferred(),
        o =
            ((getStateReference(t).reCAPTCHAState = {
                initialized: n,
            }),
            makeDiv(t)),
        e = getRecaptcha(!1)
    if (e) queueWidgetRender(t, r, e, o, n)
    else {
        var i = () => {
            var e = getRecaptcha(!1)
            if (!e) throw new Error('no recaptcha')
            queueWidgetRender(t, r, e, o, n)
        }
        const a = document.createElement('script')
        ;(a.src = 'https://www.google.com/recaptcha/api.js'), (a.onload = i), document.head.appendChild(a)
    }
    return n.promise
}
function initializeEnterprise(t, r) {
    const n = new Deferred(),
        o =
            ((getStateReference(t).reCAPTCHAState = {
                initialized: n,
            }),
            makeDiv(t)),
        e = getRecaptcha(!0)
    if (e) queueWidgetRender(t, r, e, o, n)
    else {
        var i = () => {
            var e = getRecaptcha(!0)
            if (!e) throw new Error('no recaptcha')
            queueWidgetRender(t, r, e, o, n)
        }
        const a = document.createElement('script')
        ;(a.src = 'https://www.google.com/recaptcha/enterprise.js'), (a.onload = i), document.head.appendChild(a)
    }
    return n.promise
}
function queueWidgetRender(a, s, c, h, l) {
    c.ready(() => {
        {
            var e = a,
                t = s,
                r,
                n = h
            const o = c.render(n, {
                    sitekey: t,
                    size: 'invisible',
                    callback: () => {
                        getStateReference(e).reCAPTCHAState.succeeded = !0
                    },
                    'error-callback': () => {
                        getStateReference(e).reCAPTCHAState.succeeded = !1
                    },
                }),
                i = getStateReference(e)
            i.reCAPTCHAState = Object.assign(Object.assign({}, i.reCAPTCHAState), {
                widgetId: o,
            })
        }
        l.resolve(c)
    })
}
function makeDiv(e) {
    const t = 'fire_app_check_' + e.name,
        r = document.createElement('div')
    return (r.id = t), (r.style.display = 'none'), document.body.appendChild(r), t
}
async function getToken$1(n) {
    ensureActivated(n)
    const e = getStateReference(n).reCAPTCHAState,
        o = await e.initialized.promise
    return new Promise((e, t) => {
        const r = getStateReference(n).reCAPTCHAState
        o.ready(() => {
            e(
                o.execute(r.widgetId, {
                    action: 'fire_app_check',
                }),
            )
        })
    })
}
class ReCaptchaV3Provider {
    constructor(e) {
        ;(this._siteKey = e), (this._throttleData = null)
    }
    async getToken() {
        throwIfThrottled(this._throttleData)
        var e,
            t = await getToken$1(this._app).catch((e) => {
                throw f.create('recaptcha-error')
            })
        if (null == (e = getStateReference(this._app).reCAPTCHAState) || !e.succeeded) throw f.create('recaptcha-error')
        let r
        try {
            r = await exchangeToken(
                (function (e, t) {
                    var { projectId: e, appId: r, apiKey: n } = e.options
                    return {
                        url: d + `/projects/${e}/apps/${r}:exchangeRecaptchaV3Token?key=` + n,
                        body: {
                            recaptcha_v3_token: t,
                        },
                    }
                })(this._app, t),
                this._heartbeatServiceProvider,
            )
        } catch (e) {
            throw null != (t = e.code) && t.includes('fetch-status-error')
                ? ((this._throttleData = setBackoff(Number(null == (t = e.customData) ? void 0 : t.httpStatus), this._throttleData)),
                  f.create('throttled', {
                      time: getDurationString(this._throttleData.allowRequestsAfter - Date.now()),
                      httpStatus: this._throttleData.httpStatus,
                  }))
                : e
        }
        return (this._throttleData = null), r
    }
    initialize(e) {
        ;(this._app = e), (this._heartbeatServiceProvider = _getProvider(e, 'heartbeat')), initializeV3(e, this._siteKey).catch(() => {})
    }
    isEqual(e) {
        return e instanceof ReCaptchaV3Provider && this._siteKey === e._siteKey
    }
}
class ReCaptchaEnterpriseProvider {
    constructor(e) {
        ;(this._siteKey = e), (this._throttleData = null)
    }
    async getToken() {
        throwIfThrottled(this._throttleData)
        var e,
            t = await getToken$1(this._app).catch((e) => {
                throw f.create('recaptcha-error')
            })
        if (null == (e = getStateReference(this._app).reCAPTCHAState) || !e.succeeded) throw f.create('recaptcha-error')
        let r
        try {
            r = await exchangeToken(
                (function (e, t) {
                    var { projectId: e, appId: r, apiKey: n } = e.options
                    return {
                        url: d + `/projects/${e}/apps/${r}:exchangeRecaptchaEnterpriseToken?key=` + n,
                        body: {
                            recaptcha_enterprise_token: t,
                        },
                    }
                })(this._app, t),
                this._heartbeatServiceProvider,
            )
        } catch (e) {
            throw null != (t = e.code) && t.includes('fetch-status-error')
                ? ((this._throttleData = setBackoff(Number(null == (t = e.customData) ? void 0 : t.httpStatus), this._throttleData)),
                  f.create('throttled', {
                      time: getDurationString(this._throttleData.allowRequestsAfter - Date.now()),
                      httpStatus: this._throttleData.httpStatus,
                  }))
                : e
        }
        return (this._throttleData = null), r
    }
    initialize(e) {
        ;(this._app = e),
            (this._heartbeatServiceProvider = _getProvider(e, 'heartbeat')),
            initializeEnterprise(e, this._siteKey).catch(() => {})
    }
    isEqual(e) {
        return e instanceof ReCaptchaEnterpriseProvider && this._siteKey === e._siteKey
    }
}
class CustomProvider {
    constructor(e) {
        this._customProviderOptions = e
    }
    async getToken() {
        var e = await this._customProviderOptions.getToken(),
            t = issuedAtTime(e.token),
            t = null !== t && t < Date.now() && 0 < t ? 1e3 * t : Date.now()
        return Object.assign(Object.assign({}, e), {
            issuedAtTimeMillis: t,
        })
    }
    initialize(e) {
        this._app = e
    }
    isEqual(e) {
        return (
            e instanceof CustomProvider && this._customProviderOptions.getToken.toString() === e._customProviderOptions.getToken.toString()
        )
    }
}
function setBackoff(e, t) {
    if (404 === e || 403 === e)
        return {
            backoffCount: 1,
            allowRequestsAfter: Date.now() + 864e5,
            httpStatus: e,
        }
    var t = t ? t.backoffCount : 0,
        r = (function (e, t, r) {
            ;(t *= Math.pow(r, e)), (r = Math.round(0.5 * t * (Math.random() - 0.5) * 2))
            return Math.min(144e5, t + r)
        })(t, 1e3, 2)
    return {
        backoffCount: t + 1,
        allowRequestsAfter: Date.now() + r,
        httpStatus: e,
    }
}
function throwIfThrottled(e) {
    if (e && Date.now() - e.allowRequestsAfter <= 0)
        throw f.create('throttled', {
            time: getDurationString(e.allowRequestsAfter - Date.now()),
            httpStatus: e.httpStatus,
        })
}
function initializeAppCheck(t = e(), r) {
    var n, o
    t = (c = t) && c._delegate ? c._delegate : c
    const i = _getProvider(t, 'app-check')
    if (
        (getDebugState().initialized || initializeDebugMode(),
        isDebugMode() &&
            getDebugToken().then((e) =>
                console.log(
                    `App Check debug token: ${e}. You will need to add it to your app's App Check settings in the Firebase console for it to work.`,
                ),
            ),
        i.isInitialized())
    ) {
        const e = i.getImmediate(),
            a = i.getOptions()
        if (a.isTokenAutoRefreshEnabled === r.isTokenAutoRefreshEnabled && a.provider.isEqual(r.provider)) return e
        throw f.create('already-initialized', {
            appName: t.name,
        })
    }
    const a = i.initialize({
        options: r,
    })
    {
        var s = t,
            c = r.provider
        ;(r = r.isTokenAutoRefreshEnabled), (n = s), (o = Object.assign({}, l)), h.set(n, o)
        const u = h.get(n)
        ;(u.activated = !0),
            (u.provider = c),
            (u.cachedTokenPromise = readTokenFromStorage(s).then(
                (e) => (
                    e &&
                        isValid(e) &&
                        ((u.token = e),
                        notifyTokenListeners(s, {
                            token: e.token,
                        })),
                    e
                ),
            )),
            (u.isTokenAutoRefreshEnabled = void 0 === r ? s.automaticDataCollectionEnabled : r),
            u.provider.initialize(s)
    }
    return getStateReference(t).isTokenAutoRefreshEnabled && addTokenListener(a, 'INTERNAL', () => {}), a
}
function setTokenAutoRefreshEnabled(e, t) {
    const r = getStateReference(e.app)
    r.tokenRefresher && (!0 === t ? r.tokenRefresher.start() : r.tokenRefresher.stop()), (r.isTokenAutoRefreshEnabled = t)
}
async function getToken(e, t) {
    e = await getToken$2(e, t)
    if (e.error) throw e.error
    return {
        token: e.token,
    }
}
function getLimitedUseToken(e) {
    return getLimitedUseToken$1(e)
}
function onTokenChanged(e, t, r, n) {
    let o,
        i = () => {}
    return (
        (o = null != t.next ? t.next.bind(t) : t),
        null != t.error ? (i = t.error.bind(t)) : r && (i = r),
        addTokenListener(e, 'EXTERNAL', o, i),
        () => removeTokenListener(e.app, o)
    )
}
t(
    new Component(
        'app-check',
        (e) => {
            var t = e.getProvider('app').getImmediate(),
                e = e.getProvider('heartbeat')
            return new AppCheckService(t, e)
        },
        'PUBLIC',
    )
        .setInstantiationMode('EXPLICIT')
        .setInstanceCreatedCallback((e, t, r) => {
            e.getProvider('app-check-internal').initialize()
        }),
),
    t(
        new Component(
            'app-check-internal',
            (e) => {
                var t = e.getProvider('app-check').getImmediate()
                return {
                    getToken: (e) => getToken$2(t, e),
                    getLimitedUseToken: () => getLimitedUseToken$1(t),
                    addTokenListener: (e) => addTokenListener(t, 'INTERNAL', e),
                    removeTokenListener: (e) => removeTokenListener(t.app, e),
                }
            },
            'PUBLIC',
        ).setInstantiationMode('EXPLICIT'),
    ),
    r('@firebase/app-check', '0.8.0')
export {
    CustomProvider,
    ReCaptchaEnterpriseProvider,
    ReCaptchaV3Provider,
    getLimitedUseToken,
    getToken,
    initializeAppCheck,
    onTokenChanged,
    setTokenAutoRefreshEnabled,
}
