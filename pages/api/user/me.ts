import { NextApiRequest, NextApiResponse } from "next"
import { User } from "next-auth"
import { unstable_getServerSession } from "next-auth/next"
import { APIError } from "../../../types"
import { authOptions } from "../auth/[...nextauth]"

import prisma from "../../../lib/prisma"

const handler = async (req: NextApiRequest, res: NextApiResponse<User | APIError>) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session || !session?.user) {
        res.status(401).send({
            message: "You must be signed in to view the protected content on this page.",
        })
    }

	const user = await prisma.user.findUnique({
		where: {
			email: `${session!.user!.email}`,
		},
		include: {
			shareCodes: true,
		}
	})
}

export default handler
