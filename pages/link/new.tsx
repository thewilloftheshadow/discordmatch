import { Alert, AlertIcon, Button, Heading, Input, InputGroup, InputRightElement, Skeleton, Text, useToast, VStack } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useSession, signIn, signOut } from "next-auth/react"
import { APIError, MatchLink } from "../../types"
import router from "next/router"

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
    const [hideSkeleton, setHideSkeleton] = useState<boolean>(false)
    const [codeData, setCodeData] = useState({ code: "" })
    const [error, setError] = useState<string>()

    const toast = useToast()

    useEffect(() => {
        fetch("/api/links/create", {
            method: "POST",
        }).then(async (res) => {
            const data: { code: string | null } = await res.json()
            if (res.status >= 400) {
                if (res.status === 401) {
                    signIn("discord", { callbackUrl: "/link/new" })
                } else {
                    const error = (await res.json()) as APIError
                    setError(error.message)
                    setHideSkeleton(true)
                    return
                }
            } else {
                if (!data.code) {
                    setError("An unknown error has occured, please try again.")
                    setHideSkeleton(true)
                }
                setCodeData({ code: data.code! })
                setHideSkeleton(true)
            }
        })
    }, [])

    const copyCode = () => {
        navigator.clipboard.writeText(`${props.baseURL}/link/join/${codeData.code}`)
        toast({
            title: "Copied to clipboard",
            description: "The code has been copied to your clipboard.",
            status: "success",
            duration: 5000,
            isClosable: true,
        })
    }

    return (
        <div>
            <Head>
                <title>Discord Match</title>
            </Head>
            <main>
                <Skeleton isLoaded={hideSkeleton}>
                    {error ? (
                        <VStack>
                            <Alert status="error">
                                <AlertIcon />
                                There was an error processing your request:
                                <br />
                                {error}
                            </Alert>
                            <Button onClick={() => router.push("/")}>Go Back</Button>
                        </VStack>
                    ) : (
                        ""
                    )}
                    <VStack>
                        <Text>Your link has been generated! Use it to share with another person!</Text>
                        <Text>Note: Your link can only be used once!</Text>

                        <InputGroup size="md">
                            <Input pr="5.5rem" value={`${props.baseURL}/link/join/${codeData.code}`} />
                            <InputRightElement width="5.5rem">
                                <Button h="2.25rem" size="sm" onClick={() => copyCode()}>
                                    Copy Link
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </VStack>
                </Skeleton>
            </main>
        </div>
    )
}
