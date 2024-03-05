import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logowhitesimple.png'
import useNavigator from '../contexts/navigator-context';
import { IMenu, MENU_LIST } from '../settings/menu-settings';

export default function Footer({darkMode = false, color = ""}) {

    
    const observerTargetRef = useRef(null);
    const [showNavigableFooter, setShowNavigableFooter] = useState(false);

    const changePage = useNavigator();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
              const [entry] = entries;
              setShowNavigableFooter(entry.isIntersecting);
            }
          );
      
          if (observerTargetRef.current) {
            observer.observe(observerTargetRef.current);
          }
      
          return () => {
            if (observerTargetRef.current) {
              observer.unobserve(observerTargetRef.current);
            }
          };
    }, [])

    return (
        <>
        {
            darkMode ? <></> : <></>
        }
            <div className="w-100 h-s10" style={{backgroundColor: color}}></div>
            <div className="w-100 h-s70 pointer-events-none relative">
                <div className="w-100 h-s5 pointer-events-none absolute" style={{top:'-7.5vh', zIndex: showNavigableFooter ? '2' : '-1', backgroundColor: color}}></div>
                <div className="w-100 h-s10 shadow pointer-events-none absolute" style={{top:'-5vh', zIndex: showNavigableFooter ? '1' : '-2', backgroundColor: color}}></div>
            </div>
            <div className="w-100 h-8p" ref={observerTargetRef}></div>

            <div className={`fixed bottom-0 w-100 h-s70 bg-col-a3 flex-center justify-center ${showNavigableFooter ? 'z-0' : 'z-footer'}`}>
                <div className="w-30 h-75 flex-col justify-between mt-5">
                    <div className='flex-center nowrap w-20'>
                        <h2 className='font-main font-serif font-medium fs-xl'>TraveloHI</h2>
                        <img src={logo} alt="logo" className='h-24p mb-2'/>
                    </div>
                    <div></div>
                </div>
                <div className='w-50 ml-10 h-75 flex-start mobile-flex-col justify-between mt-5'>
                    <div className='mt-2'>
                        <p className='font-serif fc-white fs-s'>Socials</p>
                        <p className='font-p fs-xs mb-0 o-50 h-op2 pointer' onClick={() => {window.location.href = "https://www.instagram.com/darryl_ce/"}}>Instagram</p>
                        <p className='font-p fs-xs mt-1 mb-0 o-50 h-op2 pointer' onClick={() => {window.location.href = "https://twitter.com/darrryl_7"}}>Twitter</p>
                        <p className='font-p fs-xs mt-1 mb-0 o-50 h-op2 pointer' onClick={() => {window.location.href = "https://github.com/Darryleffendi"}}>Github</p>
                    </div>

                    <div className='mt-2'>
                        <p className='font-serif fc-white fs-s'>Pages</p>
                        {
                            MENU_LIST.map((menu : IMenu, index : number) => {

                                if(menu.hideOnNavbar && menu.name !== "Profile Page") return <span key={index}></span>

                                return (
                                    <p className='font-p fs-xs mb-0 o-50 h-op2 pointer' onClick={() => {if(menu.path !== location.pathname) changePage(menu.path)}} key={index}>{menu.name}</p>
                                )
                            })
                        }    
                    </div>

                    <div className='mt-2'>
                        <p className='font-serif fc-white fs-s'>About TraveloHI</p>
                        <p className='font-p fs-xs mb-0 o-50 h-op2 pointer' onClick={() => {window.location.href = "https://www.careers-page.com/wex-recruitment/job/L4VVR98V/refer"}}>Careers</p>
                        <p className='font-p fs-xs mt-1 mb-0 o-50 h-op2 pointer' onClick={() => {window.location.href = "https://generator.lorem-ipsum.info/terms-and-conditions"}}>Terms and Conditions</p>
                        <p className='font-p fs-xs mt-1 mb-0 o-50 h-op2 pointer' onClick={() => {window.location.href = "https://demonstration.engagementhq.com/cookie_policy"}}>Cookie Statement</p>
                        <p className='font-p fs-xs mt-1 mb-0 o-50 h-op2 pointer' onClick={() => {window.location.href = "https://loremipsum.io/privacy-policy/"}}>Privacy Statement</p>
                    </div>
                </div>
            </div>
        </>
    )
}