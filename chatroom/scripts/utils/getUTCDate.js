export function getUTCDate(date = new Date()) {
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    return date
}
