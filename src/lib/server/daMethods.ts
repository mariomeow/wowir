import { type Cookies, type RequestEvent } from "@sveltejs/kit"
import { OAuth2RequestError, ArcticFetchError } from "arctic"
import { discord } from "$lib/server/authProviders"
import prisma from "./prisma"
import { cipher } from "./crypto"
import JWT from "jsonwebtoken"
import crypto from "node:crypto"
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

        const jwt_refresh_token_hash: string = crypto.createHash("sha256").update(jwt_refresh_token).digest("base64")

        const [user, _] = await prisma.$transaction([
            prisma.user.upsert({
                where: {
                    id
                },
                update: {
                    username,
                    avatar,
                    discord_refresh_token: cipher.encrypt(refresh_token)
                },
                create: {
                    id,
                    username,
                    avatar,
                    discord_refresh_token: cipher.encrypt(refresh_token)
                }
            }),
            prisma.session.create({
                data: {
                    userId: id,
                    jwt_refresh_token_hash,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
                }
            })
        ])

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
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
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

export function clearCookies(event: RequestEvent) {
    event.cookies.delete("jwt", {
        path: "/"
    })

    event.cookies.delete("jwt_refresh_token", {
        path: "/"
    })

    event.cookies.delete("access_token", {
        path: "/"
    })

    event.locals.user = null
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

export async function refreshDiscordToken(event: RequestEvent, userId: string) {
    try {
        const old_cookie: string | undefined = event.cookies.get("access_token")

        if (old_cookie) await revokeToken(old_cookie)

        const { discord_refresh_token } = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            select: {
                discord_refresh_token: true
            }
        })

        const decrypted: string = cipher.decrypt(discord_refresh_token)

        const tokens = await discord.refreshAccessToken(decrypted)

        const access_token: string = tokens.accessToken()
        const expires_at: Date = tokens.accessTokenExpiresAt()
        const refresh_token: string = tokens.refreshToken()

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                discord_refresh_token: cipher.encrypt(refresh_token)
            }
        })

        event.cookies.set("access_token", access_token, {
            secure: true,
            path: "/",
            httpOnly: true,
            expires: expires_at,
            sameSite: "lax"
        })
    } catch (error) {
        clearCookies(event)
    }
}

export async function authSetup(event: RequestEvent, jwt_refresh_token: string, discord_token?: string) {
    const session = await prisma.session.findUnique({
        where: {
            jwt_refresh_token_hash: crypto.createHash("sha256").update(jwt_refresh_token).digest("base64"),
            expiresAt: {
                gt: new Date()
            }
        },
        include: {
            User: true
        }
    })

    console.log(session)

    if (session) {
        const new_jwt_refresh_token: string = crypto.randomBytes(32).toString("hex")
        const new_jwt_refresh_token_hash: string = crypto.createHash("sha256").update(new_jwt_refresh_token).digest("base64")

        const [_, newSession] = await prisma.$transaction([
            prisma.session.delete({
                where: {
                    id: session.id
                }
            }),
            prisma.session.create({
                data: {
                    userId: session.User.id,
                    jwt_refresh_token_hash: new_jwt_refresh_token_hash,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
                },
                include: {
                    User: true
                }
            })
        ])

        const jwt = JWT.sign({
            id: newSession.User.id,
            username: newSession.User.username,
            avatar: newSession.User.avatar,
        }, JWT_KEY, {
            expiresIn: "15m"
        })

        event.cookies.set("jwt", jwt, {
            secure: true,
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 15),
            sameSite: "lax"
        })

        event.cookies.set("jwt_refresh_token", new_jwt_refresh_token, {
            secure: true,
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
        })

        event.locals.user = {
            id: session.User.id,
            username: session.User.username,
            avatar: session.User.avatar as string
        }

        console.log("DONE")

        if (!discord_token) {
            await refreshDiscordToken(event, session.User.id)
        }
    }
}