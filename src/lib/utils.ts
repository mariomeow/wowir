import { intervalToDuration } from "date-fns"

export function toDate(unformattedDate: Date) {
    return unformattedDate.toLocaleString("en-gb", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    })
}

export function getTimeUntil(dateA: Date, dateB: Date) {
    const difference = intervalToDuration({
        start: dateA,
        end: dateB
    })

    return { months: difference.months || 0, days: difference.days || 0, hours: difference.hours || 0, minutes: difference.minutes || 0, seconds: difference.seconds || 0 }
}