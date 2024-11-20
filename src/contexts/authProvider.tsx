import { ReactNode, createContext } from "react";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { User } from "../interfaces/user";

const authProvider = createContext<{ user: User, login: (user: User) => void, logout: () => void; sessionOpen: () => { hasSessionOpen: boolean; user: User; } }>({
    user: {
        key: "",
        isAdmin: false
    },
    login: (user: User) => { },
    logout: () => { },
    sessionOpen: () => { return { hasSessionOpen: false, user: {} as User } }

})




function AuthProvider({ children }: { children: ReactNode }) {
    const { user, login, logout, sessionOpen } = useAuth()
    return (
        <authProvider.Provider value={{ user, login, logout, sessionOpen }}>{children}</authProvider.Provider>
    )
}

export { AuthProvider, authProvider }