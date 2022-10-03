import { PrismaClient, Prisma } from "@prisma/client"
import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import prisma from "../../../lib/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "identify email guilds guilds.join",
                },
            },
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
			console.log(session, token, user)
            const userData = await prisma.user.findFirst({
                where: {
                    id: user.id,
                },
            })
			session.userData = userData
            console.log(session)
            return session
        },
    },
}
export default NextAuth(authOptions)
