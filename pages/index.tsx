import type { NextPage } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"

export default function Page() {
    const session = useSession()
    return (
        <div>
            <Head>
                <title>Discord Match</title>
            </Head>
                <h1>Coming soon to a web near you</h1>
                <p>{JSON.stringify(session)}</p>
        </div>
    )
}
