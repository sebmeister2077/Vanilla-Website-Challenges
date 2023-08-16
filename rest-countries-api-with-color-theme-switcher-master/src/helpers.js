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

export const debounceFunction = (cb, delay) => {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args);
        }, delay);
    };
};
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

export function formatNumber(number) {
    return new Intl.NumberFormat(undefined, {
        notation: 'compact',
    }).format(number);
}

export function getPreviousSessionData() {
    const searchName = localStorage.getItem('currentSearch') ?? '';
    const region = localStorage.getItem('currentRegion') ?? '';
    return { searchName, region };
}

export function getCurrentQueryCountry() {
    return new URLSearchParams(location.search).get('country');
}

export function sleep(delay) {
    return new Promise((res, rej) => setTimeout(res, delay));
}

export async function getRGBValuesWithPercentage(imageUrl) {
    const imageData = await getImageData(imageUrl);
    if (!imageData) return null;

    const response = {};
    let R, G, B, A;
    for (let i = 0; i < imageData.data.length; i++) {
        const { data } = imageData;
        R = data[i + 0] || 0;
        G = data[i + 1] || 0;
        B = data[i + 2] || 0;
        A = data[i + 3] || 0;

        const hex = rgbToHex(R, G, B);
        if (response[hex]) response[hex]++;
        else response[hex] = 1;
    }
    Object.seal(response);
    const total = Object.values(response).reduce((prev, next) => prev + next, 0);
    Object.keys(response).forEach((key) => {
        response[key] = (response[key] / total).toFixed(2);
    });
    return response;
}

function rgbToHex(r, g, b) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

async function getImageData(imageUrl) {
    const image = await new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageUrl;
        image.onload = function () {
            resolve(image);
        };
        image.crossOrigin = 'Anonymous';
    });
    if (!(image instanceof HTMLImageElement)) return null;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    return ctx.getImageData(0, 0, parseFloat(image.width), parseFloat(image.height));
}
