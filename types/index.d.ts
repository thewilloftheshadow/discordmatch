export interface APIError {
    message: string
}

export type MatchUser = User & {
    sharedCodes: ShareCode[]
    linkedCodes: ShareCode[]
}
