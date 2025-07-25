import { intervalToDuration } from "date-fns"

export function toDate(unformattedDate: string | Date) {
    return new Date(unformattedDate).toLocaleString("en-gb", {
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

    return { months: difference.months, days: difference.days, hours: difference.hours, minutes: difference.minutes, seconds: difference.seconds }
}