import "../styles/globals.css"
import { ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import Layout from "../components/Layout"
import Head from "next/head"

const App = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{
    session: Session
}>) => {
    return (
        <ChakraProvider>
            <SessionProvider session={session}>
                <Head>
                    <title>Discord Match</title>
                    <meta name="title" content="Discord Match" />
                    <meta name="description" content="See how well you and your friend match on Discord!" />
                    <meta property="og:title" content="DiscordMatch" />
                    <meta property="og:description" content="See how well you and your friend match on Discord!" />
                    <meta property="og:type" content="website" />
                    <meta property="og:image" content="https://discordmatch.com/handshake.png" />
					<link rel="icon" type="image/png" href="/handshake.png"></link>
                </Head>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionProvider>
        </ChakraProvider>
    )
}

export default App
