import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Center,
    CircularProgress,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Skeleton,
    Text,
    useColorModeValue,
    useToast,
    VStack,
} from "@chakra-ui/react"
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
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
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
                    setIsLoaded(true)
                    return
                }
            } else {
                if (!data.code) {
                    setError("An unknown error has occured, please try again.")
                    setIsLoaded(true)
                }
                setCodeData({ code: data.code! })
                setIsLoaded(true)
            }
        })
    }, [])

    const copyCode = () => {
        navigator.clipboard.writeText(`${props.baseURL}/link/join/${codeData.code}`)
        toast({
            title: "Copied to clipboard",
            description: "The link has been copied to your clipboard.",
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
                {/* <Skeleton isLoaded={isLoaded}> */}
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
                {isLoaded ? (
                    <VStack>
                        <Text>Your link has been generated! Use it to share with another person!</Text>
                        <Text>Note: Your link can only be used once!</Text>

                        <InputGroup size="md">
                            <Input pr="5.5rem" readOnly={true} value={`${props.baseURL}/link/join/${codeData.code}`} />
                            <InputRightElement width="5.5rem">
                                {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                                <Button bg={useColorModeValue("gray.50", "gray.800")} h="2.25rem" size="sm" onClick={() => copyCode()}>
                                    Copy Link
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </VStack>
                ) : (
                    <Center><CircularProgress isIndeterminate color="green.300" size={"100px"} /></Center>
                )}
                {/* </Skeleton> */}
            </main>
        </div>
    )
}
