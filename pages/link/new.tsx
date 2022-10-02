import { Skeleton, Text } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"

interface props {
    code: string
    baseURL: string
}

// serversideprops
export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: { baseURL: process.env.NEXTAUTH_URL },
    }
}

export default function Page(props: props) {
    const [code, setCode] = useState({ code: null })

    useEffect(() => {
        fetch("/api/links/create")
            .then((res) => {
                console.log(res)
                return res.json()
            })
            .then((data) => {
                setCode(data)
            })
    }, [])
    return (
        <div>
            <Head>
                <title>Discord Match</title>
            </Head>
            <main>
                <Skeleton isLoaded={code.code ? true : false}>
                    <Text>Your link has been generated! Use it to share with another person!</Text>
                    <Text>Note: Your link can only be used once!</Text>

                    <Link href={`${props.baseURL}/link/join/${code.code}`}>{`${props.baseURL}/link/join/${code.code}`}</Link>
                </Skeleton>
            </main>
        </div>
    )
}
