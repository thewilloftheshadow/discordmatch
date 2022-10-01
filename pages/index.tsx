import type { NextPage } from "next"
import Head from "next/head"
import LoginButton from "../components/loginBtn"

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Discord Match</title>
            </Head>
            <main>
                <h1>Coming soon to a web near you</h1>
            </main>

            <LoginButton />
        </div>
    )
}

export default Home
