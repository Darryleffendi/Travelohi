import styles from  "../../styles/explore.module.css"
import searchIcon from "../../assets/icon/search_dark.png"
import bedIcon from "../../assets/icon/bed.png"
import flightIcon from "../../assets/icon/plane.png"
import { useEffect, useRef, useState } from "react"
import { APP_SETTINGS } from "../../settings/app-settings"
import { HotelFacilities } from "../../components/cards/facilities-card"
import ExploreHotel from "./explore-hotel"
import ExploreFlight from "./explore-flight"
import { useParams } from "react-router-dom"

export default function ExplorePage() {

    const [searchMode, setSearchMode] = useState(0)
    const [contentOpacity, setContentOpacity] = useState(100);

    const [isSticky, setIsSticky] = useState(false);
    const [headerTransform, setHeaderTransform] = useState("translateY(0px)")
    const [headerTextTransform, setHeaderTextTransform] = useState("translateY(0px)")
    const [search, setSearch] = useState("");
    
    const observerTargetRef = useRef(null);
    const { params, page} = useParams();
    const [country, setCountry] = useState("");
    
    const handleScroll = async () => {
        let scrollTop = window.pageYOffset;
        if(scrollTop < 1800) {            
            setHeaderTransform(`translateY(${scrollTop * 0.5}px)`);
            setHeaderTextTransform(`translateY(${scrollTop * 0.35}px)`);
        }
    }

    const changeSearchMode = async (index : number) => {
        setContentOpacity(0)
        
        await new Promise(r => setTimeout(r, 400));
        setSearchMode(index);

        setContentOpacity(100)
    }

    useEffect(() => {

        if(params != undefined) {
            if(params.includes("query:")) {
                setSearch(params.replace("query:", ""));
            }
            if(params.includes("country:")) {
                setCountry(params.replace("country:", "").replace("_", " "));
            }
        }
        else {
            setCountry("")
            setSearch("")
        }

        if(page != undefined) {
            if(page == "hotel") {
                setSearchMode(0);
            }
            else if(page == "flight") {
                setSearchMode(1);
            }
        }

        window.addEventListener("scroll", handleScroll);
        const observer = new IntersectionObserver(
            (entries) => {
              const [entry] = entries;
              setIsSticky(!entry.isIntersecting);
            }
          );
      
          if (observerTargetRef.current) {
            observer.observe(observerTargetRef.current);
          }
      
          return () => {
            if (observerTargetRef.current) {
              observer.unobserve(observerTargetRef.current);
            }
            window.removeEventListener("scroll", handleScroll);
          };
    }, [])

    return (
        <>
        <div className="w-screen bg-col-a  overflow-hidden flex-col flex-center relative">
        <img className="absolute w-screen h-s90 cover o-30 filter-blur" src="/cities/bergen.jpg"  style={{transform: headerTransform}}/>
            <div className="w-80 h-s80 flex-col justify-center relative" ref={observerTargetRef}>
                <div className="w-100 h-32p"></div>
                <p className="font-h fs-3xl text-narrow font-medium m-0" style={{transform: headerTextTransform}}>Explore</p>
                <div className="w-50">
                    <p className="font-p fs-s text-narrow font-light m-0" style={{transform: headerTextTransform}}>This is your explore page. You can explore the hotels and the flights in the city</p>
                </div>

            </div>

            
        </div>
        <div className={`w-60 bg-col-main ml-20 z-10 absolute shadow-light ${styles.headerBar} flex`}>
            <div className={`w-75 h-100 overflow-hidden flex ${styles.btnTab}`}>

                {/* Search Field */}
                <div className="w-100 h-100 flex-center justify-center transition-2 flex-shrink-0">
                <input 
                    type="text" className={` ${styles.overlayInput}`} id="last" 
                    style={{backgroundImage: `url(${searchIcon}`}}
                    placeholder={`Search for ${searchMode == 0 ? 'hotels' : 'flights'}`}
                    onChange={(e) => setSearch(e.target.value)} value={search}
                />
                </div>
            </div>

            <div 
                className={`w-10 h-100 pointer flex-center justify-around border-right border-a-transparent transition ${styles.headerBarBtn} ${styles.headerBarBtnSearch}`}
                onClick={() => changeSearchMode(searchMode === 0 ? 1 : 0)}
            >
                <img src={searchMode == 0 ? bedIcon : flightIcon} className="h-24p transition"/>
            </div>
            <div className={`w-15 h-100 pointer flex-center justify-around transition no-mobile ${styles.searchBtn}`}>
                <p className="font-medium fs-xs fc-white">Search</p>
            </div>
        </div>

        <div className="bg-col-main">
            <div className="w-screen flex-col flex-center justify-center transition" style={{opacity: contentOpacity + "%"}}>
                <div className="w-100 h-s15"></div>
                {
                    searchMode == 0 ? <ExploreHotel isSticky={isSticky} query={search} country={country}/> : <ExploreFlight isSticky={isSticky} query={search} country={country}/>
                }
            </div>
        </div>
        </>
    )
}