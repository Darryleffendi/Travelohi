import styles from  "../../styles/explore.module.css"
import searchIcon from "../../assets/icon/search_dark.png"
import bedIcon from "../../assets/icon/bed.png"
import flightIcon from "../../assets/icon/plane.png"
import { useEffect, useRef, useState } from "react"
import { APP_SETTINGS } from "../../settings/app-settings"
import { HotelFacilities } from "../../components/cards/facilities-card"
import ExploreHotel from "./explore-hotel"
import ExploreFlight from "./explore-flight"

export default function ExplorePage() {

    const [searchMode, setSearchMode] = useState(0)
    const [contentOpacity, setContentOpacity] = useState(100);

    const [isSticky, setIsSticky] = useState(false);
    const observerTargetRef = useRef(null);

    const [search, setSearch] = useState("");

    const changeSearchMode = async (index : number) => {
        setContentOpacity(0)
        
        await new Promise(r => setTimeout(r, 400));
        setSearchMode(index);

        setContentOpacity(100)
    }

    useEffect(() => {
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
          };
    }, [])

    return (
        <>
        <div className="w-screen bg-col-a  overflow-hidden flex-col flex-center relative">
            <div className="w-80 h-s80 flex-col justify-center relative" ref={observerTargetRef}>
                <div className="w-100 h-32p"></div>
                <p className="font-h fs-3xl text-narrow font-medium m-0">Explore</p>
                <div className="w-50">
                    <p className="font-p fs-s text-narrow font-light m-0">This is your explore page. You can explore the hotels and the flights in the city</p>
                </div>
                {/* <img src={snowMountain} className="absolute w-80 o-10 right-0 bottom-0 self-flex-center mb--5"/> */}
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
                    onChange={(e) => setSearch(e.target.value)}
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
                    searchMode == 0 ? <ExploreHotel isSticky={isSticky} query={search}/> : <ExploreFlight isSticky={isSticky} query={search}/>
                }
            </div>
        </div>
        </>
    )
}