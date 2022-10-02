import { Avatar, Button, Container, HStack, Skeleton, Text, VStack } from "@chakra-ui/react"
import { Link, User } from "@prisma/client"
import { GetServerSideProps } from "next"
import Head from "next/head"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { MatchLink } from "../../../types"

interface props {
    code: string
    baseURL: string
}

export default function Page(props: props) {
    const router = useRouter()
    const { codeId } = router.query

    const [codeData, setCodeData] = useState<MatchLink>()

    useEffect(() => {
        fetch(`/api/links/${codeId}`)
            .then((res) => {
                console.log(res)
                return res.json()
            })
            .then((data) => {
                if (!data) {
                    router.push("/404")
                }
                setCodeData(data)
            })
    }, [codeId, router])
    return (
        <div>
            <Head>
                <title>Discord Match</title>
            </Head>
            <Container>
                <Skeleton isLoaded={codeData ? true : false}>
                    <VStack>
                        <HStack>
                            <Avatar src={codeData?.sharedBy.avatar} />
                            <Text>{codeData?.sharedBy.name} has invited you to Match!</Text>
                        </HStack>
                        <Button variant="solid">Accept</Button>
                    </VStack>
                </Skeleton>
            </Container>
        </div>
    )
}
