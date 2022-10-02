import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth/next"
import { APIError, MatchUser } from "../../../types"
import { authOptions } from "../auth/[...nextauth]"

import prisma from "../../../lib/prisma"
import { Link, User } from "@prisma/client"

import { getUser } from "../user/me"

const handler = async (req: NextApiRequest, res: NextApiResponse<{code: string} | APIError>) => {
    const userData = await getUser(req, res)
    if (!userData) return res.status(401).send({ message: "Unauthorized" })
    const user = userData as MatchUser

    const code = await prisma.link.create({
        data: {
            sharedBy: {
                connect: {
                    id: user.id,
                },
            },
            code: req.body.code,
        },
    })
    return res.status(200).json({code: code.code})
}

export default handler
