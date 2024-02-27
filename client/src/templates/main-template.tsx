import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import IChildren from "../interfaces/children-interface";
import RequireAdmin from "../middleware/require-admin";
import RequireLogin from "../middleware/require-login";
import { IMenu, MENU_LIST } from "../settings/menu-settings";


export default function MainTemplate({children} : IChildren) {

    const [menu, setMenu] = useState<any>();

    const [showNavbar, setShowNavbar] = useState<any>(true);
    const [disableNavbarEffect, setDisableNavbarEffect] = useState<any>(false)
    const [footerColor, setFooterColor] = useState<any>("")

    const location = useLocation();

    useEffect(() => {
        MENU_LIST.map((menu : IMenu) => {
            
            let pathname = location.pathname
            let locationParams = pathname.split("/")
            let validate = false;
            
            if(locationParams.length > 2) {
                pathname = locationParams[1]
    
                validate = menu.path.includes(pathname)
            }
            else {
                validate = menu.path === pathname
            }
    
            if(validate) {
                setMenu(menu);
            }
        })
    }, [location])

    useEffect(() => {

        if(menu == null) return

        setShowNavbar(!menu.hideNavbar)
        setDisableNavbarEffect(menu.disableNavbarEffect);
        
        if(menu.footerColor !== undefined) {
            setFooterColor(menu.footerColor)
        }
        else {
            setFooterColor("")
        }
    }, [menu])

    const pageContent = (
        <div className="overflow-hidden">
            {
                showNavbar ? <Navbar disableNavbarEffect={disableNavbarEffect}/> : <></>
            }
            {/* Contents */}
            <div className="w-screen h-100 overflow-y">
                {children}
            </div>
            
            {
                footerColor.length > 0 ? <Footer color={footerColor} /> : <></>
            }
        </div>
    )

    return menu?.requireLogin ? (
        <RequireLogin>{pageContent}</RequireLogin>
    ) : menu?.requireAdmin ? (
        <RequireAdmin>{pageContent}</RequireAdmin>
    ) : pageContent
}