import { type Handle } from "@sveltejs/kit"
import JWT from "jsonwebtoken"
import { JWT_KEY } from "$env/static/private"
import { authSetup, clearCookies, refreshDiscordToken } from "$lib/server/daMethods"
import type { ServerInit } from "@sveltejs/kit"
import cron from "node-cron"

export const init: ServerInit = () => {
    // NEED TO SETUP DB CLEANUP
    cron.schedule("0 0 * * *", () => {
        console.log(123)
    })
}

export const handle: Handle = async ({ event, resolve }) => {
    const jwt: string | undefined = event.cookies.get("jwt")
    const jwt_refresh_token: string | undefined = event.cookies.get("jwt_refresh_token")
    const discord_access_token: string | undefined = event.cookies.get("access_token")

    if (jwt) {
        try {
            const user = JWT.verify(jwt, JWT_KEY) as { id: string, username: string, avatar: string }

            event.locals.user = {
                id: user.id,
                username: user.username,
                avatar: user.avatar
            }

            if (!discord_access_token) {
                await refreshDiscordToken(event, user.id)
            }
        } catch (error) {
            if (error instanceof JWT.TokenExpiredError && jwt_refresh_token) {
                await authSetup(event, jwt_refresh_token, discord_access_token)
            } else {
                clearCookies(event)
            }
        }
    } else if (jwt_refresh_token) {
        try {
            await authSetup(event, jwt_refresh_token, discord_access_token)
        } catch (error) {
            clearCookies(event)
        }
    } else {
        clearCookies(event)
    }

    return await resolve(event)
}