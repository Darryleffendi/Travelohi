import { useEffect } from "react";
import useNavigator from "../contexts/navigator-context";
import useUser from "../contexts/user-context";
import IChildren from "../interfaces/children-interface";


export default function RequireAdmin({children} : IChildren) {

    const navigate = useNavigator();
    const [user, refreshUser] = useUser();

    useEffect(() => {
        (async () => {
            await refreshUser();

            if(user != null && user.role != "admin") {
                navigate("/login")
            }
        })

    }, [])

    return (
        <>
            {children}
        </>
    )
}