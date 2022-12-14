import React, { ReactNode } from "react"
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    useColorMode,
    Button,
    Skeleton,
    SkeletonCircle,
} from "@chakra-ui/react"
import { SkipNavLink, SkipNavContent } from "@chakra-ui/skip-nav"
import { FiHome, FiLink, FiCompass, FiMenu, FiBell, FiChevronDown, FiMoon, FiSun, FiList } from "react-icons/fi"
import { IconType } from "react-icons"
import { ReactText } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import NextLink from "next/link"
import { Session } from "next-auth"
import { useRouter } from "next/router"

interface LinkItemProps {
    name: string
    icon: IconType
    linkTo?: string
}
const LinkItems: Array<LinkItemProps> = [
    { name: "Home", icon: FiHome, linkTo: "/" },
    { name: "Create a Link", icon: FiLink, linkTo: "/link/new" },
    { name: "Your Servers", icon: FiList, linkTo: "/servers" },
    // { name: "Favorites", icon: FiStar },
    // { name: "Settings", icon: FiSettings },
]

export default function Layout({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <SkipNavLink />
            <Box minH="100vh" bg={useColorModeValue("white", "gray.900")}>
                <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
                <Drawer
                    autoFocus={false}
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size="full"
                >
                    <DrawerContent>
                        <SidebarContent onClose={onClose} />
                    </DrawerContent>
                </Drawer>
                {/* mobilenav */}
                <MobileNav onOpen={onOpen} />
                <SkipNavContent />
                <Box h="100vh" justifyContent="center" alignItems="center" ml={{ base: 0, md: 60 }} p="4">
                    {children}
                </Box>
            </Box>
        </>
    )
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            bg={useColorModeValue("white", "gray.900")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="xl" fontFamily="monospace" fontWeight="bold">
                    DiscordMatch
                </Text>
                <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NextLink key={link.name} href={link.linkTo || ""} passHref>
                    <NavItem key={link.name} icon={link.icon}>
                        {link.name}
                    </NavItem>
                </NextLink>
            ))}
        </Box>
    )
}

interface NavItemProps extends FlexProps {
    icon: IconType
    children: ReactText
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <Link href="#" style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: useColorModeValue("gray.400", "gray.500"),
                    color: "white",
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: "white",
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    )
}

interface MobileProps extends FlexProps {
    onOpen: () => void
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const { colorMode, toggleColorMode } = useColorMode()
    const session = useSession()
    const data: Session | null = session?.data
    let isLoggedIn = false
    let isLoaded = false

    switch (session.status) {
        case "loading":
            isLoaded = false
            isLoggedIn = false
            break

        case "authenticated":
            isLoggedIn = true
            isLoaded = true
            break

        case "unauthenticated":
            isLoggedIn = false
            isLoaded = true
            break
    }

    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent={{ base: "space-between", md: "flex-end" }}
            {...rest}
        >
            <IconButton display={{ base: "flex", md: "none" }} onClick={onOpen} variant="outline" aria-label="open menu" icon={<FiMenu />} />

            <Text display={{ base: "flex", md: "none" }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                DiscordMatch
            </Text>

            <HStack spacing={{ base: "0", md: "6" }}>
                {/* <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} /> */}
                <IconButton
                    onClick={() => toggleColorMode()}
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
                />
                <Flex alignItems={"center"} zIndex={999}>
                    <Menu>
                        <MenuButton py={2} _focus={{ boxShadow: "none" }}>
                            <HStack>
                                <Avatar
                                    size={"sm"}
                                    src={data?.user?.image ?? ""}
                                    _after={
                                        isLoggedIn
                                            ? {
                                                  content: '""',
                                                  w: 3,
                                                  h: 3,
                                                  bg: "green.300",
                                                  border: "1.5px solid white",
                                                  rounded: "full",
                                                  pos: "absolute",
                                                  bottom: -0.5,
                                                  right: -0.5,
                                              }
                                            : {}
                                    }
                                />
                                <Skeleton isLoaded={isLoaded} fadeDuration={1}>
                                    <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                                        <Text fontSize="sm">{isLoggedIn ? data?.user?.name : "Not signed in"}</Text>
                                        {
                                            // <Text fontSize="xs" color="gray.600">
                                            //     Admin
                                            // </Text>
                                        }
                                    </VStack>
                                </Skeleton>
                                <Box display={{ base: "none", md: "flex" }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList bg={useColorModeValue("white", "gray.900")} borderColor={useColorModeValue("gray.200", "gray.700")}>
                            <MenuItem isDisabled={!isLoggedIn}>Profile</MenuItem>
                            <MenuItem isDisabled={!isLoggedIn}>Settings</MenuItem>
                            <MenuItem isDisabled={!isLoggedIn}>Billing</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={() => (isLoggedIn ? signOut() : signIn("discord"))}>{isLoggedIn ? "Sign Out" : "Sign In"}</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    )
}
