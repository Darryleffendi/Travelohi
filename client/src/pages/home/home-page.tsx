import React, { useEffect, useState } from "react";
import iceland from "../../assets/images/homepage/iceland.png";
import HomepageCard from "../../components/cards/homepage-card";
import styles from "../../styles/home.module.css"
import location from "../../assets/icon/location.png"
import bed from "../../assets/icon/bed.png"
import flight from "../../assets/icon/plane.png"
import search from "../../assets/icon/search_dark.png"
import left from "../../assets/icon/leftWhite.png"
import right from "../../assets/icon/rightWhite.png"
import { APP_SETTINGS } from "../../settings/app-settings";
import PromoCard from "../../components/cards/promo-card";
import HotelCard from "../../components/cards/hotel-card";
import PromoCardLarge from "../../components/cards/promo-card-large";
import Footer from "../../components/footer";
import FlightCard from "../../components/cards/flight-card";
import PromoSlider from "./promo-slider";
import HotelSlider from "./hotel-slider";
import FlightSlider from "./flight-slider";

export default function HomePage() {

    const [showSearchField, setShowSearchField] = useState(false);
    const [searchField, setSearchField] = useState('');

    const [countries, setCountries] = useState<any>([])
    const [country, setCountry] = useState<any>(null)
    
    const [filter, setFilter] = useState(1);
    const [filterOpacity, setFilterOpacity] = useState(100);

    const [cursorStyle, setCursorStyle] = useState({});
    const [cursorEffectStyle, setEffectCursorStyle] = useState({});
    const [cursorLeft, setCursorLeft] = useState(false)
    const [cursorRight, setCursorRight] = useState(false)

    const [showPromo, setShowPromo] = useState(false)
    const [promoOpacity, setPromoOpacity] = useState('0%')

    const [showCountriesDropdown, setShowCountriesDropdown] = useState(false);
    const [headerTransform, setHeaderTransform] = useState("translateY(0px)")

    const moveCursor = (e : any) => {

        let style : any = {}
        let effectStyle : any = {}
        
        style.left = e.pageX + 'px'
        style.top = e.pageY + 'px'

        if(e.pageY > 650 || scrollTop > 0) {
            effectStyle.transform = 'scale(0, 0)'
            document.body.style.cursor = '';
        }
        else if(e.pageX < 80) {
            effectStyle.transform = 'scale(5, 5)'
            setCursorLeft(true)
        }
        else if(e.pageX > screen.width - 80) {
            effectStyle.transform = 'scale(5, 5)'
            setCursorRight(true)
        }
        else {
            setCursorRight(false)
            setCursorLeft(false)
        }

        if(e.pageY <= 650 && scrollTop == 0) {
            document.body.style.cursor = 'none';
        }

        setCursorStyle(style)
        setEffectCursorStyle(effectStyle)
    }

    let scrollTop = 0;
    let topSliderVisible = false;
    let promoSliderVisible = false;

    const handleScroll = async () => {
        scrollTop = window.pageYOffset;

        if(scrollTop == 0) {
            changeFilter(0);
            topSliderVisible = false;
            setPromoOpacity('0%');
            setShowPromo(false)
            promoSliderVisible = false;
        }
        
        if(scrollTop > 150 && !topSliderVisible ) {
            changeFilter(1)
            topSliderVisible = true;
        }

        if(scrollTop > 1000 && !promoSliderVisible ) {
            setShowPromo(true)
            await new Promise(r => setTimeout(r, 100));
            setPromoOpacity('100%')
            promoSliderVisible = true;
        }

        if(scrollTop < 1800) {            
            setHeaderTransform(`translateY(${scrollTop * 0.5}px)`);
        }
    }

    useEffect(() => {

        (async () => {

            const response = await fetch(APP_SETTINGS.backend + "/api/get/country", {
                method: 'GET',
            });
            const data = await response.json();
            setCountries(data);
        })()

        changeFilter(0);

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("scroll", handleScroll);
            document.body.style.cursor = '';
        }
    }, [])

    const changeFilter = async (index : number) => {
        setFilterOpacity(0)
        
        await new Promise(r => setTimeout(r, 400));
        setFilter(index);

        setFilterOpacity(100)
    }

    return (
        <div>
            <div className={styles.cursor} style={cursorStyle}>
                <div className={styles.cursorEffect} style={cursorEffectStyle}>
                    {
                        cursorLeft ? <img src={left} alt="left" className="w-20 h-20" /> : cursorRight ? <img src={right} alt="left" className="w-20 h-20" /> : <></>
                    }
                    
                </div>
            </div>

            <div className="w-100 h-s90 overflow-hidden flex-center justify-center bg-col-a pointer-events-none z--10" style={{transform: headerTransform}}>
                <div className="w-screen h-s90 absolute bg-col-dark-transparent z-5 no-cursor"></div>
                <HomepageCard imgSrc={iceland} title="Iceland" subtitle="LAND OF FIRE AND ICE"/>
            </div> 

            <div className={`w-60 bg-col-main ml-20 z-10 absolute shadow-light ${styles.headerBar} flex`}>
                
                <div>
                    {
                        !showCountriesDropdown ? <></> : (
                            <>
                                <div className={styles.headerBar}></div>
                                <div className={styles.headerBar}></div>
                                <div className="w-100 h-s30 overflow-auto flex-col shadow bg-col-white scroll-simple absolute">
                                    {
                                        countries.map((country : any, index : number) => {
                                            return (
                                                <div className="flex-col w-100 hover-bg-col-dark transition" onClick={() => setCountry(country)}>
                                                    <div className="flex-center">
                                                        <p className="ml-1 font-p fc-a fs-xs">{country.name}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        ) 
                    }
                </div>

                <div className={`w-75 h-100 overflow-hidden flex ${styles.btnTab}`}>
                    {/* Button Tabs */}
                    <div className="w-100 h-100 flex transition-2 flex-shrink-0" style={showSearchField ? {'marginLeft': '-100%'} : {'marginLeft': '-0%'}}>
                        <div className={`w-100 h-100 pointer flex-center justify-around border-right border-a-transparent transition ${styles.headerBarBtn}`}
                            onClick={() => setShowCountriesDropdown(!showCountriesDropdown)}
                        >
                            <img src={location} className="h-32p transition"/>
                            <p className="fs-xs no-mobile">Destinations</p>
                            <div></div>
                        </div>
                        <div className={`w-100 h-100 pointer flex-center justify-around border-right border-a-transparent transition ${styles.headerBarBtn}`}
                            onClick={() => changeFilter(1)}
                        >
                            <img src={bed} className="h-32p transition"/>
                            <p className="fs-xs no-mobile">Hotels</p>
                            <div></div>
                        </div>
                        <div className={`w-100 h-100 pointer flex-center justify-around border-right border-a-transparent transition ${styles.headerBarBtn}`}
                            onClick={() => changeFilter(2)}
                        >
                            <img src={flight} className="h-32p transition"/>
                            <p className="fs-xs no-mobile">Flights</p>
                            <div></div>
                        </div>
                    </div>

                    {/* Search Field */}
                    <div className="w-100 h-100 flex-center justify-center transition-2 flex-shrink-0">
                    <input 
                        type="text" className={` ${styles.overlayInput}`} id="last" 
                        placeholder="Search for hotels or flights"
                        value={searchField} onChange={(e) => setSearchField(e.target.value)}
                    />
                    </div>
                </div>
                
                <div 
                    className={`w-10 h-100 pointer flex-center justify-around border-right border-a-transparent transition ${styles.headerBarBtn} ${styles.headerBarBtnSearch}`}
                    onClick={() => {
                        setShowSearchField(!showSearchField);
                        setSearchField('');
                    }}
                >
                    <img src={search} className="h-24p transition"/>
                </div>
                <div className={`w-15 h-100 pointer flex-center justify-around transition no-mobile ${styles.searchBtn}`}>
                    <p className="font-medium fs-xs fc-white">{showSearchField ? 'Search' : 'Clear Filters'}</p>
                </div>
            </div>
            
            <div className="w-100 bg-col-main relative z-5">
                <div className="w-100 h-s10"></div>
                <div className="w-100 h-screen flex-col flex-center justify-center transition" style={{opacity: filterOpacity + "%"}}>
                    {
                        filter == 1 ? <HotelSlider /> : filter == 2 ? <FlightSlider /> : <></>
                    }
                </div>

                <div className="w-100 h-screen flex-col flex-center justify-center mt-5 transition" style={{opacity: promoOpacity}}>
                    {
                        showPromo ? 
                            <PromoSlider />
                        : <></>
                    }
                </div>

            </div>
            <Footer />
        </div>
    )
}