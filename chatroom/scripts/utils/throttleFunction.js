export function throttleFunction(cb, delay = 250) {
    let shouldWait = false
    let waitingArgs
    function timeoutFunc() {
        if (waitingArgs == null) {
            shouldWait = false
            return
        }
        cb.call(this, ...waitingArgs)
        waitingArgs = null
        setTimeout(timeoutFunc.bind(this), delay)
    }
    return function (...args) {
        if (shouldWait) {
            waitingArgs = args
            return
        }
        cb.call(this, ...args)
        shouldWait = true
        setTimeout(timeoutFunc.bind(this), delay)
    }
}
