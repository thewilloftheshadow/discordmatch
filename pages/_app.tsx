import "../styles/globals.css"
import { NextUIProvider } from "@nextui-org/react"
import { AppProps } from "next/app"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

const App = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{
    session: Session
}>) => {
    return (
        <NextUIProvider>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </NextUIProvider>
    )
}

export default App
