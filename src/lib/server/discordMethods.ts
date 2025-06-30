import { type Cookies } from "@sveltejs/kit"
import { OAuth2RequestError, ArcticFetchError } from "arctic"
import { discord } from "$lib/server/authProviders"
import prisma from "./prisma"
import { cipher } from "./crypto"
import JWT from "jsonwebtoken"
import crypto from "node:crypto"
import bcrypt from "bcrypt"
import { JWT_KEY } from "$env/static/private"

export function removeStateCookie(cookies: Cookies) {
    cookies.delete("state", {
        path: "/"
    })
}

async function getUser(access_token: string): Promise<{ id: string, username: string, avatar: string }> {
    const response = await fetch("https://discord.com/api/users/@me", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })

    const user = await response.json()

    return user
}

export async function setCookies(cookies: Cookies, urlCode: string) {
    const tokens = await discord.validateAuthorizationCode(urlCode, null)

    const access_token: string = tokens.accessToken()
    const expires_at: Date = tokens.accessTokenExpiresAt()
    const refresh_token: string = tokens.refreshToken()

    try {
        const { id, username, avatar } = await getUser(access_token)

        const jwt_refresh_token: string = crypto.randomBytes(32).toString("hex")

        const jwt_refresh_token_hash: string = await bcrypt.hash(jwt_refresh_token, 10)

        const user = await prisma.user.upsert({
            where: {
                id
            },
            update: {
                username,
                avatar,
                discord_refresh_token: cipher.encrypt(refresh_token),
                jwt_refresh_token_hash: jwt_refresh_token_hash
            },
            create: {
                id,
                username,
                avatar,
                discord_refresh_token: cipher.encrypt(refresh_token),
                jwt_refresh_token_hash: jwt_refresh_token_hash
            }
        })

        const jwt = JWT.sign({
            id: user.id,
            username: user.username,
            avatar: user.avatar,
        }, JWT_KEY, {
            expiresIn: "15m"
        })

        cookies.set("jwt", jwt, {
            secure: true,
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 15),
            sameSite: "lax"
        })

        cookies.set("jwt_refresh_token", jwt_refresh_token, {
            secure: true,
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365
        })

        cookies.set("access_token", access_token, {
            secure: true,
            path: "/",
            httpOnly: true,
            expires: expires_at,
            sameSite: "lax"
        })
    } catch (error) {
        console.error(error)
    }
}

export async function revokeToken(token: string) {
    try {
        await discord.revokeToken(token)
    } catch (error) {
        if (error instanceof OAuth2RequestError) {
            console.error(error.code)
        }

        if (error instanceof ArcticFetchError) {
            console.error(error.cause)
        }
    }
}