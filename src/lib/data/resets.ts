function getNextReset(referenceDate: Date, dayInterval: number) {
    const now: Date = new Date()

    console.log(now)

    const intervalMs: number = dayInterval * (1000 * 60 * 60 * 24)

    const elapsedMs: number = now.getTime() - referenceDate.getTime()

    const msUntilNext: number = intervalMs - (elapsedMs % intervalMs)

    return new Date(now.getTime() + msUntilNext)
}

const raid40Reset: Date = getNextReset(new Date(Date.UTC(1970, 0, 7, 4, 0, 0)), 7)
const onyxiaReset: Date = getNextReset(new Date(Date.UTC(1970, 0, 3, 4, 0, 0)), 5)
const raid20Reset: Date = getNextReset(new Date(Date.UTC(1970, 0, 3, 4, 0, 0)), 3)
const karaReset: Date = getNextReset(new Date(Date.UTC(1970, 0, 4, 4, 0, 0)), 5)

const resets = new Map<number, Date>([
    [94, raid40Reset],
    [95, raid40Reset],
    [96, raid40Reset],
    [97, onyxiaReset],
    [98, raid20Reset],
    [99, raid40Reset],
    [100, raid20Reset],
    [101, karaReset],
    [102, raid40Reset],
    [109, karaReset]
])

export default resets