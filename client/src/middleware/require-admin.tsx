import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNavigator from "../contexts/navigator-context";
import useUser from "../contexts/user-context";
import IChildren from "../interfaces/children-interface";


export default function RequireAdmin({children} : IChildren) {

    const navigate = useNavigate();
    const [user, refreshUser] = useUser();

    useEffect(() => {
        (async () => {
            await refreshUser();

            if(user != null && user.role != "admin") {
                navigate("/")
            }
        })()
    }, [])

    if(user != null && user.role != "admin") {
        navigate("/")
    }

    return (
        <>
            {children}
        </>
    )
}