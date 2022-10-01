import type { NextApiRequest, NextApiResponse } from "next"
import { User } from "@prisma/client"
import { APIError } from "../../../types"

import prisma from "../../../lib/prisma"

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<User | APIError>
) => {
    const { id } = req.query
    if (typeof id !== "string") res.status(400).json({ message: "Invalid id" })
    const user = await prisma.user.findUnique({
        where: {
            id: `${id}`,
        },
    })
    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({ message: "User not found" })
    }
}

export default handler
