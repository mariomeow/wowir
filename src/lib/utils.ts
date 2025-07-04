export function toDate(unformattedDate: Date) {
    return unformattedDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    })
}