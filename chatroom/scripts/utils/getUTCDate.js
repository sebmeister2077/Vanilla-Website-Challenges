export function getUTCDate(date) {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return date
}
