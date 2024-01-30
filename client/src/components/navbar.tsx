import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logowhitesimple.png'
import user from '../assets/icon/userwhite.png'
import menu from '../assets/icon/menu.png'
import { IMenu, MENU_LIST } from '../settings/menu-settings'
import styles from '../styles/navbar.module.css'
import useNavigator from '../contexts/navigator-context'

export default function Navbar() {

    const [showNav, setShowNav] = useState(true)
    const [showMobileNav, setShowMobileNav] = useState(false);

    const changePage = useNavigator();

    const location = useLocation();

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

    return (
        <>
            <nav className={styles.nav} style={showNav ? {'top' : '0px'} : {'top' : '-130px'}}>
                <div className={styles.navTray}>    
                    <div className='w-40 flex-center h-100 justify-between'>
                        <div></div>
                        <div className='flex-center w-25 justify-between pointer'>
                            <img src={user} className='h-12p'/>
                            <p className='font-p fs-xxs h-op2'>Your Account</p>
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
                    <div className='fixed w-screen h-screen bg-col-a transition-2 left-0' style={showMobileNav ? {'top' : '0px'} : {'top' : '100vh'}}>

                    </div>
                </div>
            </nav>
        </>
    )
}