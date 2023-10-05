import { MINUTE } from '../constants/time.js'

const formatter = Intl.DateTimeFormat(navigator.language, {
    hourCycle: 'h24',
    timeStyle: 'short',
})
export function utcTimestampToLocalTime(timestamp) {
    const date = new Date(timestamp)
    const hourOffset = date.getTimezoneOffset() / MINUTE
    date.setHours(date.getHours() + hourOffset)

    return formatter.format(date)
}
