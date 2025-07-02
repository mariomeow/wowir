import { type Handle } from "@sveltejs/kit"
import JWT from "jsonwebtoken"
import { JWT_KEY } from "$env/static/private"
import { authSetup, clearCookies, refreshDiscordToken } from "$lib/server/daMethods"

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
        console.log("FOUND JWT TOKEN")
        try {
            console.log("RUNNING AUTH SETUP")
            await authSetup(event, jwt_refresh_token, discord_access_token)
        } catch (error) {
            clearCookies(event)
        }
    } else {
        clearCookies(event)
    }

    return await resolve(event)
}