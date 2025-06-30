import type { Handle } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
    const jwt: string | undefined = event.cookies.get("jwt")
    const jwt_refresh_token: string | undefined = event.cookies.get("jwt_refresh_token")
    const access_token: string | undefined = event.cookies.get("access_token")

    return await resolve(event)
}