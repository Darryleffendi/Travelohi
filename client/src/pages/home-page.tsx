import React, { useState } from "react";
import iceland from "../assets/images/homepage/iceland.png";
import HomepageCard from "../components/cards/homepage-card";
import styles from "../styles/home.module.css"
import location from "../assets/icon/location.png"
import bed from "../assets/icon/bed.png"
import flight from "../assets/icon/plane.png"
import search from "../assets/icon/search_dark.png"

export default function HomePage() {

    const [showSearchField, setShowSearchField] = useState(false);
    const [searchField, setSearchField] = useState('');

    return (
        <div>
            <div className="w-100 h-s90 overflow-hidden flex-center justify-center bg-col-a">
                <div className="w-screen h-s90 absolute bg-col-dark-transparent z-5"></div>
                <HomepageCard imgSrc={iceland} title="Iceland" subtitle="LAND OF FIRE AND ICE"/>
            </div> 

            <div className={`w-60 bg-col-main ml-20 z-10 absolute shadow-light ${styles.headerBar} flex`}>
                
                
                <div className="w-75 h-100 overflow-hidden flex">
                    {/* Button Tabs */}
                    <div className="w-100 h-100 flex transition-2 flex-shrink-0" style={showSearchField ? {'marginLeft': '-100%'} : {'marginLeft': '-0%'}}>
                        <div className={`w-100 h-100 pointer flex-center justify-around border-right border-a-transparent transition ${styles.headerBarBtn}`}>
                            <img src={location} className="h-32p transition"/>
                            <p className="fs-xs">Destinations</p>
                            <div></div>
                        </div>
                        <div className={`w-100 h-100 pointer flex-center justify-around border-right border-a-transparent transition ${styles.headerBarBtn}`}>
                            <img src={bed} className="h-32p transition"/>
                            <p className="fs-xs">Hotels</p>
                            <div></div>
                        </div>
                        <div className={`w-100 h-100 pointer flex-center justify-around border-right border-a-transparent transition ${styles.headerBarBtn}`}>
                            <img src={flight} className="h-32p transition"/>
                            <p className="fs-xs">Flights</p>
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
                    className={`w-10 h-100 pointer flex-center justify-around border-right border-a-transparent transition ${styles.headerBarBtn}`}
                    onClick={() => {
                        setShowSearchField(!showSearchField);
                        setSearchField('');
                    }}
                >
                    <img src={search} className="h-24p transition"/>
                </div>
                <div className={`w-15 h-100 pointer flex-center justify-around transition ${styles.searchBtn}`}>
                    <p className="font-medium fs-xs fc-white">{showSearchField ? 'Search' : 'Clear Filters'}</p>
                </div>
            </div>

            <div className="w-100 h-screen flex-col flex-center justify-center">
                <p className="m-0 font-p fc-a2 font-medium">MOST POPULAR</p>
                <h1 className="font-main font-serif fc-a fs-3xl font-bold m-0">Flight Tickets</h1>
            </div>
        </div>
    )
}