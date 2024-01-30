import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import IChildren from "../interfaces/children-interface";
import AuthPage from "../pages/auth/auth-page";
import { IMenu, MENU_LIST } from "../settings/menu-settings";


export default function MainTemplate({children} : IChildren) {

    let showNavbar : boolean = true;
    const location = useLocation();

    MENU_LIST.map((menu : IMenu) => {
        if (menu.path === location.pathname) {
            showNavbar = !menu.hideNavbar
        }
    })

    return (
        <div>
            {
                showNavbar ? <Navbar /> : <></>
            }
            {/* Contents */}
            <div className="w-screen h-100 overflow-y">
                {children}
            </div>
        </div>
    )
}