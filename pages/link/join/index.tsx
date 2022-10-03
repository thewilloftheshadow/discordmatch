import { Box, Button, Container, Flex, Input, Spacer, VStack } from "@chakra-ui/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"

interface props {
    code: string
    baseURL: string
}

export default function Page(props: props) {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isDisabled, setIsDisabled] = useState<boolean>(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        const element = event.currentTarget.elements[0] as HTMLInputElement
        router.push(`/link/join/${element.value}`)
    }

    return (
        <div>
            <Head>
                <title>Discord Match</title>
            </Head>
            <Flex height="100%" margin={"auto"} flexDir={"column"} alignItems="center" verticalAlign={"center"}>
                <Container maxW={"container.sm"}>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing="3">
                            <Input size={"lg"} placeholder="Enter Link Code" />
                            <Box>
                                <Button isLoading={isLoading} type="submit" w="lg">
                                    Join
                                </Button>
                            </Box>
                        </VStack>
                    </form>
                </Container>
            </Flex>
        </div>
    )
}
