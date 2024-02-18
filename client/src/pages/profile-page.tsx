import useUser from "../contexts/user-context"
import snowMountain from "../assets/images/profileBackground.png"
import { APP_SETTINGS } from "../settings/app-settings";

export default function ProfilePage() {

    const [user, refreshUser] = useUser();

    if(user == null) {
        return <></>
    }
    
    console.log(user.imageUrl)

    return (
        <div className="w-screen bg-col-a  overflow-hidden flex-col flex-center relative">
            <div className="w-80 h-s80 flex-col justify-center relative">
                <div className="w-100 h-32p"></div>
                <p className="font-h fs-3xl text-narrow font-medium m-0">Hello, {user.firstName}!</p>
                <div className="w-50">
                    <p className="font-p fs-s text-narrow font-light m-0">This is your profile page. You can edit your user information and manage your tickets and hotels cart</p>
                </div>
                {/* <img src={snowMountain} className="absolute w-80 o-10 right-0 bottom-0 self-flex-center mb--5"/> */}
            </div>

            <div className="w-100 bg-col-main flex justify-center">
                <div className="w-85 mt--10 flex gap-s">
                    <div className="w-30 h-s70 bg-col-white rounded shadow-light z-10 mb-10">
                        <div className="w-100 flex-center justify-center border-bottom border-a-transparent">
                            <img src={APP_SETTINGS.backend + "/" + user.imageUrl} className="w-20 rounded-50 mt-1 mb-1" />
                            <div className="flex-col justify-start w-50 ml-2">
                                <p className="font-main fc-a m-0">{user.firstName + " " + user.lastName}</p>
                                <p className="font-main fs-2xs m-0 fc-a o-50">{user.email}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-70 h-screen bg-col-white rounded shadow-light z-10 mb-10">

                    </div>

                </div>
            </div>
        </div>
    )
}