import NextAuth, { Account, NextAuthOptions, User } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import prisma from "../../../lib/prisma"
export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            //console.log(user, account, profile, email, credentials)

            if (user.email) {
                prisma.user.upsert({
                    where: {
                        id: user.id,
                    },
                    update: {},
                    create: {
                        id: user.id,
                        email: user.email,
						avatar: user.image || "",
                    },
                })
            }
            return true
        },
        async session({ session, token, user }) {
            //console.log(session, token, user)
            const userData = await prisma.user.upsert({
                where: {
                    id: token.sub,
                },
                update: {},
                create: {
                    id: token.sub!,
                    email: session.user!.email!,
					avatar: session.user!.image || "",
                },
            })
            session.userData = userData
            return session
        },
    },
}
export default NextAuth(authOptions)
