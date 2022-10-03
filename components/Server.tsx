import { Avatar, Badge, Box, Button, Heading, Image, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { APIGuild } from "discord-api-types/v10"

export default function ServerCard({ serverData }: { serverData: APIGuild }) {
    let iconUrl = ""
    if (serverData.icon) {
        const format = serverData.icon?.startsWith("a_") ? "gif" : "png"
        iconUrl = `https://cdn.discordapp.com/icons/${serverData.id}/${serverData.icon}.${format}?size=128`
    } else {
        iconUrl = "https://discord.com/assets/322c936a8c8be1b803cd94861bdfa868.png"
    }
    return (
        // <Box>
        //     <Image borderRadius="full" boxSize="128px" src={iconUrl} alt="Dan Abramov" />
        //     <Text>{serverData.name}</Text>
        // </Box>
        <Box maxH="500px" maxW={"200px"} w={"full"} bg={useColorModeValue("white", "gray.700")} color={useColorModeValue("gray.800", "gray.100")} boxShadow={"2xl"} rounded={"lg"} p={6} textAlign={"center"}>
            <Avatar
                size={"xl"}
                src={iconUrl}
                mb={4}
                pos={"relative"}
                _after={{
                    content: '""',
                    w: 4,
                    h: 4,
                    bg: "green.300",
                    border: "2px solid white",
                    rounded: "full",
                    pos: "absolute",
                    bottom: 0,
                    right: 3,
                }}
            />
            <Heading fontSize={"lg"} fontFamily={"body"}>
                {serverData.name}
            </Heading>
        </Box>
    )
}
