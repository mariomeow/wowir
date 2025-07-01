import { OAuth2RequestError, ArcticFetchError } from "arctic"
import { redirect } from "@sveltejs/kit"
import { removeStateCookie, setCookies } from "$lib/server/daMethods"

export async function GET({ cookies, url }) {
    const urlState: string | null = url.searchParams.get("state")
    const urlCode: string | null = url.searchParams.get("code")

    const storedState: string | undefined = cookies.get("state")

    if (!urlCode || !storedState || urlState != storedState) {
        return redirect(302, "/")
    }

    try {
        removeStateCookie(cookies)
        await setCookies(cookies, urlCode)
    } catch (error) {
        if (error instanceof OAuth2RequestError) {
            console.error(error.code)
        }

        if (error instanceof ArcticFetchError) {
            console.error(error.cause)
        }
    }

    return redirect(302, "/")
} 