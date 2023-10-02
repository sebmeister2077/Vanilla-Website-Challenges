export function onOnlineListener(e) {
    toastr.success('You are back online!')
}
export function onOfflineListener(e) {
    toastr.error('Seems you are offline!')
}

export function initNetworkChangeListener() {
    navigator.connection.onchange = (e) => {
        if (['2g', 'slow-2g'].includes(e.target.effectiveType)) toastr.warning('Your connection has been downgraded.')
    }
}
