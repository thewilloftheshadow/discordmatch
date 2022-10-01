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
        fetch("/api/sharecodes/create")
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
                <Text>Your link has been generated! Use it to share with another person!</Text>
                <Text>Note: Your link can only be used once!</Text>
                {code.code ? (
                    <>
                        <Link href={`${props.baseURL}/link/${code.code}`}>{`${props.baseURL}/link/${code.code}`}</Link>
                    </>
                ) : (
                    <Skeleton>
                        <Text>Generating link...</Text>
                    </Skeleton>
                )}
            </main>
        </div>
    )
}
