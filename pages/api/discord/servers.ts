import { NextApiRequest, NextApiResponse } from "next"
import { APIError, MatchUser } from "../../../types"

import prisma from "../../../lib/prisma"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { User } from "@prisma/client"

import { APIGuild } from "discord-api-types/v10"

const handler = async (req: NextApiRequest, res: NextApiResponse<APIGuild[] | APIError>) => {
    if (req.method !== "GET") return res.status(405).send({ message: "Method not allowed" })
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) return res.status(401).send({ message: "Unauthorized" })

    const userData = session.userData as User

    const account = await prisma.account.findFirst({
        where: {
            userId: userData.id,
        },
    })

    if (!account) return res.status(401).send({ message: "Unauthorized" })

    const discordGuildsRequest = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
        headers: {
            Authorization: `Bearer ${account.access_token}`,
        },
    })

    if (discordGuildsRequest.status !== 200) return res.status(500).send({ message: "Failed to fetch guilds" })

    const discordGuilds = (await discordGuildsRequest.json()) as APIGuild[]

    return res.status(200).json(discordGuilds)
}

export default handler
