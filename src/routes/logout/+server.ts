import { clearCookies, revokeToken } from "$lib/server/daMethods"
import prisma from "$lib/server/prisma"
import { redirect } from "@sveltejs/kit"
import crypto from "node:crypto"

export async function POST(event) {
    const discord_access_token: string | undefined = event.cookies.get("access_token")
    const jwt_refresh_token: string | undefined = event.cookies.get("jwt_refresh_token")

    try {
        if (discord_access_token) await revokeToken(discord_access_token)

        if (jwt_refresh_token) await prisma.session.delete({
            where: {
                jwt_refresh_token_hash: crypto.createHash("sha256").update(jwt_refresh_token).digest("base64")
            }
        })

        clearCookies(event)
    } catch (error) {
        console.error(error)
    }

    redirect(303, "/")
}