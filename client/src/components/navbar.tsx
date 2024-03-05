import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logowhitesimple.png'
import userIcon from '../assets/icon/user2.png'
import menu from '../assets/icon/menu.png'
import logoutIcon from "../assets/icon/logout.png"
import currencyIcon from "../assets/icon/currency.png"
import credit from "../assets/icon/credit.png"
import close from '../assets/icon/cross.png'
import { IMenu, MENU_LIST } from '../settings/menu-settings'
import styles from '../styles/navbar.module.css'
import useNavigator from '../contexts/navigator-context'
import useUser from '../contexts/user-context'
import { APP_SETTINGS } from '../settings/app-settings'
import radioIcon from "../assets/icon/radio.png"
import radioActiveIcon from "../assets/icon/radio_active.png"
import creditIcon from "../assets/icon/credit.png"
import wallet from "../assets/icon/wallet.png"

export default function Navbar({disableNavbarEffect = false} : any) {

    const [showNav, setShowNav] = useState(true)
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [showMobileNavBtn, setShowMobileNavBtn] = useState(false);

    const [showCurrency, setShowCurrency] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const changePage = useNavigator();
    const location = useLocation();
    const [user, refreshUser] = useUser();

    var prevScroll = 0;

    const logout = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/auth/logout", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const data = await response.json();
        changePage("/")
        refreshUser()
    }

    useEffect(() => {
        if(!disableNavbarEffect) {
            window.addEventListener('scroll', handleScroll);
        }
        else {
            window.removeEventListener('scroll', handleScroll);
            setShowNav(true);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [disableNavbarEffect]);

    const handleScroll = (event : any) => {
        let scrollTop = window.scrollY

        if(scrollTop == 0) {
            setShowNav(true);
        }
        else if(scrollTop - prevScroll > 0) {
            setShowNav(false);
        }
        else if(scrollTop - prevScroll < 0) {
            setShowNav(true);
        }
        prevScroll = scrollTop;
    }

    useEffect(() => {
        if(showMobileNav) {
            (async () => {
                await new Promise(r => setTimeout(r, 350));
                setShowMobileNavBtn(true);
            })()
        }
        else {
            setShowMobileNavBtn(false);
        }
    }, [showMobileNav])

    return (
        <>
            <nav className={styles.nav} style={{'top' : showNav ? '0px' : '-135px', 'position' : disableNavbarEffect ? 'absolute' : 'fixed'}}>
                <div className={styles.navTray}>    
                    <div className='w-40 flex-center h-100 justify-between'>
                        <div className='flex-center w-20 justify-around pointer o-60 h-op3 relative' 
                            onMouseEnter={() => setShowPayment(true)} onMouseLeave={() => setShowPayment(false)}
                        >
                            <img src={credit} className='h-12p filter-white'/>
                            <p className='font-p fs-2xs fc-white '>Payment</p>

                            <div className={`absolute w-s12 left-0 bg-col-white transition-3 flex-col flex-center shadow-light ${showPayment ? "mt-15 o-100" : "mt-10 o-0"}`}>
                                <div className='flex-center justify-between w-80 mt-1'>
                                    <div className='flex-center gap-10 '>
                                        <img src={creditIcon} className="w-16p h-16p"/>
                                        <p className='font-medium fs-xs o-60 m-0'>Credit Card</p>
                                    </div>
                                    <p className='font-medium fs-xs m-0 fc-a2'>{user?.cardNumber != "" ? "**" + user?.cardNumber?.substring(user?.cardNumber.length - 4, user?.cardNumber.length) : "Unset"}</p>
                                </div>
                                <div className='flex-center justify-between gap-10 w-80 mb-1'>
                                    <div className='flex-center gap-10 '>
                                        <img src={wallet} className="w-16p h-16p"/>
                                        <p className='font-medium fs-xs o-60 m-0'>HiWallet</p>
                                    </div>
                                    <p className='font-medium fs-xs m-0 fc-a2'>${user?.walletBalance}</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex-center w-20 justify-around pointer o-60 h-op3 relative' 
                            onMouseEnter={() => setShowCurrency(true)} onMouseLeave={() => setShowCurrency(false)}
                        >
                            <img src={currencyIcon} className='h-12p filter-white'/>
                            <p className='font-p fs-2xs fc-white '>Currency</p>
                            
                            <div className={`absolute w-s10 left-0 bg-col-white transition-3 flex-col flex-center shadow-light ${showCurrency ? "mt-15 o-100" : "mt-10 o-0"}`}>
                                <div className='flex-center justify-between w-80 mt-1'>
                                    <div className='flex-center gap-10 '>
                                        <img src={radioActiveIcon} className="w-16p h-16p"/>
                                        <p className='font-medium fs-xs o-60 m-0'>USD</p>
                                    </div>
                                    <p className='font-medium fs-xs m-0 fc-a2'>$</p>
                                </div>
                                <div className='flex-center justify-between gap-10 w-80'>
                                    <div className='flex-center gap-10 '>
                                        <img src={radioIcon} className="w-16p h-16p o-40"/>
                                        <p className='font-medium fs-xs o-60 m-0'>EUR</p>
                                    </div>
                                    <p className='font-medium fs-xs m-0 fc-a2'>€</p>
                                </div>
                                <div className='flex-center justify-between gap-10 w-80 mb-1'>
                                    <div className='flex-center gap-10 '>
                                        <img src={radioIcon} className="w-16p h-16p o-40"/>
                                        <p className='font-medium fs-xs o-60 m-0'>IDR</p>
                                    </div>
                                    <p className='font-medium fs-xs m-0 fc-a2'>Rp</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex-center w-20 justify-around pointer o-60 h-op2' onClick={logout}>
                            <img src={logoutIcon} className='h-12p filter-white'/>
                            <p className='font-p fs-2xs fc-white '>Logout</p>
                        </div>
                        <div className='flex-center w-20 justify-around pointer o-60 h-op2' onClick={() => changePage("/profile")}>
                            <img src={userIcon} className='h-12p filter-white'/>
                            <p className='font-p fs-2xs fc-white '>{user?.firstName == null ? 'login' : user.firstName}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.navMain}>
                    <div className='flex-center nowrap w-30'>
                        <h2 className='font-main font-serif font-medium fs-xl'>TraveloHI</h2>
                        <img src={logo} alt="logo" className='h-24p mb-2'/>
                    </div>
                    <div className={`no-mobile ${styles.navNavigate}`}>
                        {
                            MENU_LIST.map((menu : IMenu, index : number) => {

                                if(menu.hideOnNavbar) return <span key={index}></span>

                                return (
                                    <div className={`${styles.navLink} pointer`} onClick={() => {if(menu.path !== location.pathname) changePage(menu.path)}} key={index}>
                                        <p className=' fc-white mb--1'>
                                        {menu.name}
                                        </p>
                                        <p className='fs-xs font-light m-0 fc-white o-80'>
                                            {menu.subtitle}
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>

                    {/* Mobile Navbar */}
                    <div className="mobile pointer" onClick={() => setShowMobileNav(true)}>
                        <img src={menu} className="h-24p"/>
                    </div>
                    <div className='fixed w-screen h-screen bg-col-a transition-2 left-0 mobile flex-col' style={showMobileNav ? {'top' : '0px'} : {'top' : '100vh'}}>
                        
                        <div className='w-100 absolute flex justify-end'>
                            <img src={close} className='h-32p mr-5 mt-2 o-50' onClick={() => setShowMobileNav(false)}/>
                        </div>
                        <div className='transition-2 w-screen h-80 mt-10 flex-col flex-center' style={showMobileNavBtn ? {opacity : '100%'} : {opacity:'0%'}}>
                        {
                            MENU_LIST.map((menu : IMenu, index : number) => {

                                if(menu.hideOnNavbar) return <span key={index}></span>

                                return (
                                    <div 
                                        className={`${styles.navLink} pointer `} 
                                        onClick={() => {if(menu.path !== location.pathname) { changePage(menu.path, false); setShowMobileNav(false); }}}
                                        key={index}
                                    >
                                        <p className=' fc-white mb--1 font-serif fs-l'>
                                        {menu.name}
                                        </p>
                                        <p className='fs-xs font-light m-0 fc-white o-60'>
                                            {menu.subtitle}
                                        </p>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}