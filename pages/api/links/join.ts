import { NextApiRequest, NextApiResponse } from "next"
import { APIError, MatchUser } from "../../../types"

import prisma from "../../../lib/prisma"

import { getUser } from "../user/me"

const handler = async (req: NextApiRequest, res: NextApiResponse<boolean | APIError>) => {
    if (req.method !== "POST") return res.status(405).send({ message: "Method not allowed" })
    const userData = await getUser(req, res)
    if (!userData) return res.status(401).send({ message: "Unauthorized" })
    const user = userData as MatchUser

    const { code } = req.query

    const codeData = await prisma.link.findFirst({
        where: {
            code: `${code}`,
        },
    })

    if (codeData?.linkedToId) return res.status(400).send({ message: "This invite has already been used by someone." })

    const done = await prisma.link.update({
        where: {
            code: `${code}`,
        },
        data: {
            linkedTo: {
                connect: {
                    id: user.id,
                },
            },
        },
    })
    if (done) return res.status(200).send(true)
    else return res.status(404).send({ message: "Invite link not found" })
}

export default handler
