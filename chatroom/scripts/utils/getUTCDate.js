export function getUTCDate(date = new Date()) {
    if (typeof date === 'number') date = new Date(date) //timestamp
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    return date
}
