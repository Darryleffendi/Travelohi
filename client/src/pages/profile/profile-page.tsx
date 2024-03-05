import { useEffect, useState } from "react";
import useUser from "../../contexts/user-context"
import profile from "../../assets/icon/user2.png"
import cart from "../../assets/icon/cart2.png"
import order from "../../assets/icon/order.png"
import history from "../../assets/icon/history.png"
import logout from "../../assets/icon/logout.png"
import { APP_SETTINGS } from "../../settings/app-settings";
import ProfileButton from "../../components/buttons/profile-button";
import ProfileSubpage from "./profile-subpage";
import CartSubpage from "./cart-subpage";
import LogoutSubpage from "./logout-subpage";
import OngoingSubpage from "./ongoing-subpage";
import HistorySubpage from "./history-subpage";

export default function ProfilePage() {

    const [user, refreshUser] = useUser();
    const [headerTransform, setHeaderTransform] = useState("translateY(0px)")
    const [headerTextTransform, setHeaderTextTransform] = useState("translateY(0px)")
    const [subpageOpacity, setSubpageOpacity] = useState(100);

    const [subpage, setSubpage] = useState(0);
    const [leftCard, setLeftCard] = useState(<></>);

    const changeSubpage = async (index: number) => {
        setSubpageOpacity(0);
        await new Promise(r => setTimeout(r, 400));
        setSubpage(index);
        setSubpageOpacity(100);
    }

    const subpages = [
        {
            name: "Profile",
            icon: profile,
            subpage: <ProfileSubpage setLeftCard={setLeftCard} />
        },
        {
            name: "Cart",
            icon: cart,
            subpage: <CartSubpage setLeftCard={setLeftCard}/>
        },
        {
            name: "Order",
            icon: order,
            subpage: <OngoingSubpage setLeftCard={setLeftCard}/>
        },
        {
            name: "History",
            icon: history,
            subpage: <HistorySubpage setLeftCard={setLeftCard} />
        },
        {
            name: "Logout",
            icon: logout,
            subpage: <LogoutSubpage setLeftCard={setLeftCard}/>
        }
    ]

    const handleScroll = async () => {
        let scrollTop = window.pageYOffset;
        if(scrollTop < 1800) {            
            setHeaderTransform(`translateY(${scrollTop * 0.5}px)`);
            setHeaderTextTransform(`translateY(${scrollTop * 0.35}px)`);
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [])
    
    if(user == null) {
        return <></>
    }

    return (
        <div className="w-screen bg-col-a  overflow-hidden flex-col flex-center relative">
            <img className="absolute w-screen h-s90 cover object-bottom o-30 filter-blur" src="/cities/glacier.jpg" style={{transform: headerTransform}}/>
            <div className="w-80 h-s80 flex-col justify-center relative">
                <div className="w-100 h-32p"></div>
                <p className="font-h fs-3xl text-narrow font-medium m-0 o-70" style={{transform: headerTextTransform}}>Hello, {user.firstName}!</p>
            </div>

            <div className="w-100 bg-col-main flex-col flex-center z-1">
                <div className="w-screen h-s10 bg-col-a3 shadow-light absolute">

                </div>
                <div className="w-85 flex justify-between mw-80">
                    <div className="w-25 mb-10 mt--10 z-10 no-mobile">
                        <div className="w-100 h-s60 bg-col-white shadow-light flex-col flex-center mb-10">
                            <img src={APP_SETTINGS.backend + "/" + user.imageUrl} className="w-98p h-98p cover rounded-50 mb-2 mt-5" />
                            <p className="font-main fs-s fc-a m-0">{user.firstName + " " + user.lastName}</p>
                            <p className="font-main fs-3xs m-0 fc-a o-50 mb-5">{user.email}</p>
                        </div>
                        
                        <div className={`transition o-${subpageOpacity}`}>
                        {
                            leftCard
                        }
                        </div>
                    </div>
                    
                    <div className="w-65 z-10 mb-10 flex-col mw-100">
                        <div className="w-100 h-s10 flex-center gap-10 mb-10">
                            {
                                subpages.map((page, index) => {
                                    return <ProfileButton imgSrc={page.icon} text={page.name} isActive={subpage == index} onClick={() => changeSubpage(index)}/>
                                })
                            }
                        </div>

                        <div className={`transition flex-col o-${subpageOpacity}`}>
                            {
                                subpages[subpage].subpage
                            }
                        </div>
                    </div>

                </div>
                <div className="w-80 mb-10 z-10 mobile">
                    <div className={`transition w-100 o-${subpageOpacity}`}>
                    {
                        leftCard
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}