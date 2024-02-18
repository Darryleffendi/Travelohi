import { createContext, useContext, useEffect, useState } from "react";
import IChildren from "../interfaces/children-interface";
import IUser from "../interfaces/user";
import { APP_SETTINGS } from "../settings/app-settings";
import useNavigator from "./navigator-context";

type UserContextType = [IUser | null, () => Promise<void>];

const userContext = createContext<UserContextType>([
    null,
    async () => {}
]);

export function UserProvider({children} : IChildren) {

    const navigate = useNavigator();
    
    const [user, setUser] = useState<any>(null)

    const refreshUser = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/auth/user", {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json()
        if("error" in data) {
            setUser({'notAuthenticated' : true})
            navigate("/login")
        }
        else {
            setUser(data)
        }
    }

    useEffect(() => {
        refreshUser()
    }, []);

    return (
        <userContext.Provider value={[user, refreshUser]}>
            {children}
        </userContext.Provider>
    )

}

export default function useUser() {
    return useContext(userContext);
}