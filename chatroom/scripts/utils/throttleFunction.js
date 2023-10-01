export const throttleFunction = (cb, delay = 250) => {
    let shouldWait = false
    let waitingArgs
    const timeoutFunc = () => {
        if (waitingArgs == null) {
            shouldWait = false
            return
        }
        cb(...waitingArgs)
        waitingArgs = null
        setTimeout(timeoutFunc, delay)
    }
    return (...args) => {
        if (shouldWait) {
            waitingArgs = args
            return
        }
        cb(...args)
        shouldWait = true
        setTimeout(timeoutFunc, delay)
    }
}
