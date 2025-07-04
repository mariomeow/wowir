import prisma from "$lib/server/prisma"

async function getAllRaids(userId: string) {
    let allRaids = await prisma.raid.findMany({
        where: {
            raidParticipations: {
                some: {
                    userId
                }
            }
        },
        select: {
            instanceId: true,
            createdAt: true,
            id: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const allRaidsMap = new Map()

    allRaids.forEach(raid => {
        allRaidsMap.set(raid.instanceId, allRaidsMap.get(raid.instanceId) ? allRaidsMap.get(raid.instanceId) + 1 : 1)
    })

    return {
        raidsMap: allRaidsMap,
        lastFive: allRaids.slice(0, 5)
    }
}

export async function load({ locals }) {
    return {
        user: locals.user,
        raidData: locals.user && getAllRaids(locals.user.id)
    }
}