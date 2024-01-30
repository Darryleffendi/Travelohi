import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IChildren from "../interfaces/children-interface";
import { APP_SETTINGS } from "../settings/app-settings";

const userContext = createContext(null);

export function UserProvider({children} : IChildren) {

    const navigate = useNavigate();
    
    const [user, setUser] = useState<any>(null)

    useEffect(() => {

        const fetchData = async () => {
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
        
        fetchData()

    }, []);

    return (
        <userContext.Provider value={user}>
            {children}
        </userContext.Provider>
    )

}

export default function useUser() {
    return useContext(userContext);
}