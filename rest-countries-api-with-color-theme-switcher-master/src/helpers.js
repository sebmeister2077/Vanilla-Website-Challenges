export function normalizeText(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

//so that page size will be dynamic
export function calculatePageSize() {
    const { innerHeight, innerWidth } = window;
    const APPROXIMATE_COUNTRY_WIDTH = 300,
        APPROXIMATE_COUNTRY_HEIGHT = 300;
    return Math.round((innerWidth * innerHeight) / (APPROXIMATE_COUNTRY_WIDTH * APPROXIMATE_COUNTRY_HEIGHT) + 2);
}
export const throttleFunction = (cb, delay = 250) => {
    let shouldWait = false;
    let waitingArgs;
    const timeoutFunc = () => {
        if (waitingArgs == null) {
            shouldWait = false;
            return;
        }
        cb(...waitingArgs);
        waitingArgs = null;
        setTimeout(timeoutFunc, delay);
    };
    return (...args) => {
        if (shouldWait) {
            waitingArgs = args;
            return;
        }
        cb(...args);
        shouldWait = true;
        setTimeout(timeoutFunc, delay);
    };
};

export function getUrlParams() {
    const urlParams = new URLSearchParams(location.search);
    return urlParams;
}
