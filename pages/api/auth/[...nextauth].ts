import NextAuth, { Account, NextAuthOptions, User } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log(user, account, profile, email, credentials)
            return true
        },
    },
}
export default NextAuth(authOptions)
