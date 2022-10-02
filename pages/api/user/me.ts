import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth/next"
import { APIError, MatchUser } from "../../../types"
import { authOptions } from "../auth/[...nextauth]"

import prisma from "../../../lib/prisma"
import { Link, User } from "@prisma/client"

const getUser = async (req: NextApiRequest, res: NextApiResponse): Promise<boolean | null | MatchUser> => {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session || !session?.user) return false

    const user = await prisma.user.findUnique({
        where: {
            email: `${session!.user!.email}`,
        },
        include: {
            sharedCodes: true,
            linkedCodes: true,
        },
    })
    if (!user) return null
    return user
}

const handler = async (req: NextApiRequest, res: NextApiResponse<MatchUser | APIError>) => {
	if(req.method !== "GET") return res.status(405).send({ message: "Method not allowed" })
    const userData = await getUser(req, res)
    if (userData === false) {
        res.redirect("/api/auth/signin")
    }
    if (userData === null) {
        res.status(404).send({ message: "User not found" })
    }
    const user = userData as MatchUser
    if (user) res.status(200).json(user)
    else res.status(404).send({ message: "User not found" })
}

export default handler
export { getUser }
