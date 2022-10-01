import "../styles/globals.css"
import { ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import Layout from "../components/Layout"

const App = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{
    session: Session
}>) => {
    return (
        <ChakraProvider>
            <SessionProvider session={session}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionProvider>
        </ChakraProvider>
    )
}

export default App
