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
    Wrap,
    WrapItem,
} from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useSession, signIn, signOut } from "next-auth/react"
import router, { useRouter } from "next/router"
import { APIGuild } from "discord-api-types/v10"
import ServerCard from "../components/Server"

export default function Page() {
    const [servers, setServers] = useState<APIGuild[]>([])
    const router = useRouter()

    useEffect(() => {
        if (!router.isReady) return
        fetch("/api/discord/servers", {
            method: "GET",
        }).then(async (res) => {
            const data = await res.json()
            if (res.status >= 400) {
                if (res.status === 401) {
                    signIn("discord", { callbackUrl: "/link/new" })
                } else {
                    router.push("/")
                }
            } else {
                setServers(data as APIGuild[])
            }
        })
    }, [router])

    return (
        <div>
            <Head>
                <title>Discord Match</title>
            </Head>
            {/* <main>{JSON.stringify(servers[0])}</main> */}
            <Center>{servers.length > 0 ? (
                <Wrap alignContent={"center"}>
                    {servers.map((x) => {
                        return (
                            <WrapItem key={x.id}>
                                <ServerCard serverData={x} />
                            </WrapItem>
                        )
                    })}
                </Wrap>
            ) : (
                <Center>
                    <CircularProgress isIndeterminate color="green.300" size={"100px"} />
                </Center>
            )}
			</Center>
        </div>
    )
}
