import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth/next"
import { APIError, MatchUser } from "../../../types"
import { authOptions } from "../auth/[...nextauth]"

import prisma from "../../../lib/prisma"
import { Link, User } from "@prisma/client"

import { getUser } from "../user/me"

const handler = async (req: NextApiRequest, res: NextApiResponse<Link | APIError>) => {
    const userData = await getUser(req, res)
    if (!userData) return res.status(401).send({ message: "Unauthorized" })
    const user = userData as MatchUser

    const { code } = req.query
    if (typeof code !== "string") res.status(400).json({ message: "Invalid id" })
    const codeData = await prisma.link.findUnique({
        where: { code: `${code}` },
		include: {
			sharedBy: true,
			linkedTo: true,
		},
    })
    if (!codeData) return res.status(404).json({ message: "Code not found" })
    return res.status(200).send(codeData)
}

export default handler
