import { Link, User } from "@prisma/client"

export interface APIError {
    message: string
}

export type MatchUser = User & {
    sharedCodes: Link[]
    linkedCodes: Link[]
}

export type MatchLink = Link & {
    sharedBy: User
    linkedTo: User
}
