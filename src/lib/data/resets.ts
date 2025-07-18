function getNextReset(referenceDate: Date, dayInterval: number) {
    const now: Date = new Date()

    const intervalMs: number = dayInterval * (1000 * 60 * 60 * 24)

    const elapsedMs: number = now.getTime() - referenceDate.getTime()

    const msUntilNext: number = intervalMs - (elapsedMs % intervalMs)

    return new Date(now.getTime() + msUntilNext)
}

const PVE_raid40Reset: Date = getNextReset(new Date(Date.UTC(1970, 0, 7, 4, 0, 0)), 7)
const PVE_onyxiaReset: Date = getNextReset(new Date(Date.UTC(1970, 0, 3, 4, 0, 0)), 5)
const PVE_raid20Reset: Date = getNextReset(new Date(Date.UTC(1970, 0, 3, 4, 0, 0)), 3)
const PVE_karaReset: Date = getNextReset(new Date(Date.UTC(1970, 0, 4, 4, 0, 0)), 5)

const PVP_raid40Reset: Date = getNextReset(new Date(Date.UTC(1970, 0, 1, 4, 0, 0)), 7)
const PVP_onyxiaReset: Date = getNextReset(new Date(Date.UTC(1970, 0, 2, 4, 0, 0)), 5)
const PVP_raid20Reset: Date = getNextReset(new Date(Date.UTC(1970, 0, 1, 4, 0, 0)), 3)
const PVP_karaReset: Date = getNextReset(new Date(Date.UTC(1970, 0, 2, 4, 0, 0)), 5)

export const pveResets = new Map<number, Date>([
    [94, PVE_raid40Reset],
    [95, PVE_raid40Reset],
    [96, PVE_raid40Reset],
    [97, PVE_onyxiaReset],
    [98, PVE_raid20Reset],
    [99, PVE_raid40Reset],
    [100, PVE_raid20Reset],
    [101, PVE_karaReset],
    [102, PVE_raid40Reset],
    [109, PVE_karaReset]
])

export const pvpResets = new Map<number, Date>([
    [94, PVP_raid40Reset],
    [95, PVP_raid40Reset],
    [96, PVP_raid40Reset],
    [97, PVP_onyxiaReset],
    [98, PVP_raid20Reset],
    [99, PVP_raid40Reset],
    [100, PVP_raid20Reset],
    [101, PVP_karaReset],
    [102, PVP_raid40Reset],
    [109, PVP_karaReset]
])