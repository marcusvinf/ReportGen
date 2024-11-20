import { useEffect, useState } from "react"
import { User } from "../interfaces/user"
import { differenceInHours, } from "date-fns"


const initialState = { isAdmin: false, key: "" }

function useAuth() {
    const [user, setUser] = useState<User>(initialState)

    const login = (user: User) => {
        const userFormated = JSON.stringify({ user_key: user.key, is_admin: user.isAdmin, date_login: new Date() })
        localStorage.setItem("user_session_follow_up", userFormated)
        setUser(user)
    }


    const logout = () => {
        localStorage.removeItem("user_session_follow_up")
        setUser(initialState)
    }

    const sessionOpen = () => {
        const userSession = localStorage.getItem("user_session_follow_up")
        let hasSessionOpen: boolean


        if (!userSession) {
            return {
                hasSessionOpen: false,
                user: {} as User
            }

        }


        const parsedUserSession = JSON.parse(userSession)
        const durationSessionHours = differenceInHours(new Date(), new Date(parsedUserSession.date_login))


        if (durationSessionHours <= 2) {
            return {
                hasSessionOpen: true,
                user: { isAdmin: parsedUserSession.is_admin, key: parsedUserSession.user_key } as User
            }
        }

        return {
            hasSessionOpen: false,
            user: {} as User        }
    }

    return { user, login, logout, sessionOpen }

}

export { useAuth }