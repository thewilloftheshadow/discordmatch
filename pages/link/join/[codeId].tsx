import { Alert, AlertIcon, Avatar, Button, Container, HStack, Skeleton, Text, useToast, VStack } from "@chakra-ui/react"
import { Link, User } from "@prisma/client"
import { GetServerSideProps } from "next"
import { signIn } from "next-auth/react"
import Head from "next/head"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { APIError, MatchLink } from "../../../types"

interface props {
    code: string
    baseURL: string
}

export default function Page(props: props) {
    const router = useRouter()
    const { codeId } = router.query

    const [codeData, setCodeData] = useState<MatchLink>()
    const [error, setError] = useState<string>()
    const [btnLoading, setBtnLoading] = useState<boolean>(false)
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false)
    const [hideSkeleton, setHideSkeleton] = useState<boolean>(false)

    const toast = useToast()

    useEffect(() => {
        if (!router.isReady) return
        console.log(router.query)
        fetch(`/api/links/${codeId}`).then(async (res) => {
            const data = await res.json()
            if (res.status >= 400) {
                if (res.status === 401) {
                    signIn("discord", { callbackUrl: "/link/join/" + codeId })
                } else {
                    const error = data as APIError
                    setError(error.message)
                    setHideSkeleton(true)
                    return
                }
            } else {
                const code = data as MatchLink
                if (!data) {
                    router.push("/404")
                }
                setCodeData(data)
                setHideSkeleton(false)
            }
        })
    }, [codeId, router])

    const acceptInvite = () => {
        setBtnLoading(true)
        fetch(`/api/links/join?code=${codeId}`, {
            method: "POST",
        }).then(async (res) => {
            console.log(res)
            if (res.status >= 400) {
                const error: APIError = await res.json()
                setError(error.message)
                setBtnLoading(false)
            } else {
                setBtnDisabled(true)
                toast({
                    title: "Success",
                    description: "Invite Accepted!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
                setTimeout(() => router.push("/"), 5000)
            }
        })
    }
    return (
        <div>
            <Head>
                <title>Join {codeData?.sharedBy?.name ?? "me"} on Discord Match</title>
                <meta name="title" content={`Join ${codeData?.sharedBy?.name ?? "me"} on Discord Match`} />
                <meta name="og:title" content={`Join ${codeData?.sharedBy?.name ?? "me"} on Discord Match`} />
                <meta
                    name="description"
                    content={
                        codeData?.sharedBy?.name
                            ? `${codeData.sharedBy.name} has invited you to match with them on DiscordMatch!`
                            : "You have been invited to match on DiscordMatch!"
                    }
                />
                <meta
                    name="og:description"
                    content={
                        codeData?.sharedBy?.name
                            ? `${codeData.sharedBy.name} has invited you to match with them on DiscordMatch!`
                            : "You have been invited to match on DiscordMatch!"
                    }
                />
            </Head>
            <Container>
                <VStack spacing={3}>
                    {error ? (
                        <VStack>
                            <Alert status="error">
                                <AlertIcon />
                                There was an error processing your request:
                                <br />
                                {error}
                            </Alert>
                            <Button onClick={() => router.push("/link/join")}>Go Back</Button>
                        </VStack>
                    ) : (
                        ""
                    )}
                    <Skeleton isLoaded={codeData ? true : false} hidden={hideSkeleton}>
                        <VStack>
                            <HStack>
                                <Avatar src={codeData?.sharedBy?.avatar} />
                                <Text>{codeData?.sharedBy?.name} has invited you to Match!</Text>
                            </HStack>
                            <Button
                                variant="solid"
                                onClick={() => acceptInvite()}
                                disabled={btnDisabled}
                                isLoading={btnLoading}
                                loadingText="Accepting"
                            >
                                Accept
                            </Button>
                        </VStack>
                    </Skeleton>
                </VStack>
            </Container>
        </div>
    )
}
