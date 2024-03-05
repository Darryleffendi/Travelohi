import { useEffect } from "react";
import useNavigator from "../contexts/navigator-context";
import useUser from "../contexts/user-context";
import IChildren from "../interfaces/children-interface";


export default function RequireLogin({children} : IChildren) {

    const navigate = useNavigator();
    const [user, refreshUser] = useUser();

    useEffect(() => {
        (async () => {
            await refreshUser();

            if(user != null && "notAuthenticated" in user) {
                navigate("/login")
            }
        })()

    }, [])

    if(user != null && "notAuthenticated" in user) {
        navigate("/login")
    }

    return (
        <>
            {children}
        </>
    )
}