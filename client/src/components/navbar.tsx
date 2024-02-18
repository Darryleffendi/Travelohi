import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logowhitesimple.png'
import userIcon from '../assets/icon/userwhite.png'
import menu from '../assets/icon/menu.png'
import close from '../assets/icon/cross.png'
import { IMenu, MENU_LIST } from '../settings/menu-settings'
import styles from '../styles/navbar.module.css'
import useNavigator from '../contexts/navigator-context'
import useUser from '../contexts/user-context'

export default function Navbar() {

    const [showNav, setShowNav] = useState(true)
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [showMobileNavBtn, setShowMobileNavBtn] = useState(false);

    const changePage = useNavigator();
    const location = useLocation();
    const [user, refreshUser] = useUser();

    var prevScroll = 0;

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

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
            <nav className={styles.nav} style={showNav ? {'top' : '0px'} : {'top' : '-135px'}}>
                <div className={styles.navTray}>    
                    <div className='w-40 flex-center h-100 justify-between'>
                        <div></div>
                        <div className='flex-center w-20 justify-around pointer' onClick={() => changePage("/profile")}>
                            <img src={userIcon} className='h-12p'/>
                            <p className='font-p fs-2xs h-op2 '>{user == null ? 'login' : user.firstName}</p>
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
                            MENU_LIST.map((menu : IMenu) => {

                                if(menu.hideOnNavbar) return <></>

                                return (
                                    <div className={`${styles.navLink} pointer`} onClick={() => {if(menu.path !== location.pathname) changePage(menu.path)}}>
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
                            MENU_LIST.map((menu : IMenu) => {

                                if(menu.hideOnNavbar) return <></>

                                return (
                                    <div 
                                        className={`${styles.navLink} pointer `} 
                                        onClick={() => {if(menu.path !== location.pathname) { changePage(menu.path, false); setShowMobileNav(false); }}}
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