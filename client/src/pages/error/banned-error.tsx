import useNavigator from "../../contexts/navigator-context";
import useUser from "../../contexts/user-context";
import { APP_SETTINGS } from "../../settings/app-settings";
import logoutIcon from "../../assets/icon/logout.png"

export default function BannedError() {
    
    const changePage = useNavigator();
    const [user, refreshUser] = useUser();

    const logout = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/auth/logout", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const data = await response.json();
        refreshUser()
        changePage("/")
    }

    return (
        <div className="w-screen h-screen flex-center flex-col justify-center bg-col-a">
            <p className="fs-3xl font-medium fc-white o-90 m-0">403</p>
            <p className="fs-xs font-medium fc-white o-50 m-0 mt--1">Your account is banned</p>
            <div className='flex-center justify-around pointer o-60 h-op2' onClick={logout}>
                <img src={logoutIcon} className='h-12p filter-white'/>
                <p className='font-p fs-2xs fc-white ml-1'>Logout</p>
            </div>
        </div>
    )
}