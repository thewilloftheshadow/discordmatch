import { NextApiRequest, NextApiResponse } from "next"
import { APIError, MatchUser } from "../../../types"

import prisma from "../../../lib/prisma"

import { getUser } from "../user/me"

const handler = async (req: NextApiRequest, res: NextApiResponse<{ code: string } | APIError>) => {
	if(req.method !== "POST") return res.status(405).send({ message: "Method not allowed" })
    const userData = await getUser(req, res)
    if (!userData) return res.status(401).send({ message: "Unauthorized" })
    const user = userData as MatchUser

	const oldCode = await prisma.link.findFirst({
		where: {
			sharedBy: {
				id: user.id
			},
			linkedToId: null
		}
	})

	if(oldCode) return res.status(200).json({ code: oldCode.code })

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
    return res.status(200).json({ code: code.code })
}

export default handler
