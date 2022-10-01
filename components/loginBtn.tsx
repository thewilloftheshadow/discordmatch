import { useSession, signIn, signOut } from "next-auth/react"
const LoginButton = () => {
    const { data: session } = useSession()
    if (session?.user) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn("discord")}>Sign in</button>
        </>
    )
}

export default LoginButton