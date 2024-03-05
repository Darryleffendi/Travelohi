import { useEffect } from "react"
import useNavigator from "../../contexts/navigator-context";
import useUser from "../../contexts/user-context"
import IProfileSubpage from "../../interfaces/profile-subpage"
import { APP_SETTINGS } from "../../settings/app-settings";

export default function LogoutSubpage({setLeftCard} : IProfileSubpage) {

    const [user, refreshUser] = useUser();
    const navigate = useNavigator();

    useEffect(() => {
        (async () => {
            const response = await fetch(APP_SETTINGS.backend + "/auth/logout", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            navigate("/")
            refreshUser()
        })()
    }, [])

    return (
        <>
        </>
    )
}