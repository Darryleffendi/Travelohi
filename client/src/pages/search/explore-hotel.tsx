import { useEffect, useState } from "react";
import { HotelFacilitiesInteractable } from "../../components/cards/facilities-card";
import HotelCard from "../../components/cards/hotel-card";
import useDebounce from "../../hooks/use-debounce";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from  "../../styles/explore.module.css"

export default function ExploreHotel({query = '', isSticky} : any) {
    
    const [filteredFacility, setFilteredFacility] = useState<Array<string>>([])
    const [filteredCountry, setFilteredCountry] = useState<string>('');
    const [filteredCity, setFilteredCity] = useState<string>('');
    const [useFilter, setUseFilter] = useState<boolean>(false);

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);

    const [hotels, setHotels] = useState<Array<any>>([]);
    const [filteredHotels, setFilteredHotels] = useState<Array<any>>([]);
    const [hotelOpacity, setHotelOpacity] = useState(0);

    const fetchHotels = async () => {
        let response;
        response = await fetch(APP_SETTINGS.backend + "/api/search/hotel", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'query': query})
        });
        
        const data = await response.json();
        
        for (let i = 0; i < data.length; i++) {
            const response2 = await fetch(APP_SETTINGS.backend + "/api/get/room/from/hotel", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'id': data[i].ID}),
            });
            const roomData = await response2.json();
            data[i].rooms = roomData
        }
        
        setHotels(data);
    }

    useDebounce(() => {
        (async () => {
            if(hotelOpacity > 0) {
                setHotelOpacity(0)
                await new Promise(r => setTimeout(r, 400));
            }
            await fetchHotels();
            setHotelOpacity(100)

        })()
      }, [query], 500
    );
    
    useEffect(() => {

        if(filteredCity == '' && filteredCountry == '' && filteredFacility.length == 0) {
            setUseFilter(false)
            setFilteredHotels([]);
            return;
        }
        setUseFilter(true);

        let hotelFilter = [...hotels]

        for(let i = 0; i < hotels.length; i++) {
            for(let j = 0; j < filteredFacility.length; j ++) {
                if(!hotels[i].facilities.includes(filteredFacility[j])) {
                    hotelFilter = hotelFilter.filter(h => h.ID !== hotels[i].ID)
                }
            }
        }

        if(filteredCountry != '') {
            hotelFilter = hotelFilter.filter(h => h.City.Country.name == filteredCountry)
        }
        if(filteredCity != '') {
            hotelFilter = hotelFilter.filter(h => h.City.name == filteredCity)
        }

        setFilteredHotels(hotelFilter)

    }, [filteredCity, filteredCountry, filteredFacility, hotels])

    useEffect(() => {
        (async () => {
            const response = await fetch(APP_SETTINGS.backend + "/api/get/country", {
                method: 'GET',
            });
            const data = await response.json();
            setCountries(data);
        })()
    }, [])

    const filterChange = (e : any) => {
        const { name, value } = e.target;
        
        if(name === 'country') {

            if(value === 'Default') {
                setFilteredCountry('')
                setFilteredCity('')
                setCities([]);
            }
            else {
                (async () => {
                    const response = await fetch(APP_SETTINGS.backend + "/api/get/city/from/countryname", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({'countryName': value})
                    });
                    const data = await response.json();
                    setCities(data);
                    setFilteredCountry(value);
                })()
            }
        }

        else if(name === 'city') {
            
            if(value === 'Default') {
                setFilteredCity('')
            }
            else {
                setFilteredCity(value);
            }
        }
    }

    const facilityFilterChange = (facility : string) => {
        console.log(filteredFacility)
        if(filteredFacility.indexOf(facility) >= 0) {
            setFilteredFacility(prevData => prevData.filter(f => f !== facility))
            return
        }

        setFilteredFacility(prevData => [
            ...prevData,
            facility
        ])
    }

    let leftFacility = ["swimmingpool", "ac", "elevator", "h24"]
    let rightFacility = ["park", "wifi", "restaurant"]

    return (
        <div className="w-85 flex justify-between flex-start">
            {
                isSticky ? <div className="w-25 h-screen"></div> : <></>
            }
            <div className="w-s20 h-100 flex-col gap-s" style={isSticky ? {position:'fixed', top: '15vh'} : {}}>
                <div className="w-100">
                    <p className="font-h fc-a fs-s font-medium">Region</p>
                    <select 
                        className={`${styles.filterInput} mb-1`} id="country" 
                        onChange={filterChange}
                        defaultValue={"Default"}
                        name="country"
                    >
                        <option value={'Default'}>
                            Country
                        </option>
                        {
                            countries.map((country : any, index) => {
                                return <option key={index} value={country.name}>{country.name}</option>
                            })
                        }
                    </select>
                    <select 
                        className={styles.filterInput} id="city" 
                        onChange={filterChange}
                        defaultValue={"Default"}
                        name="city"
                    >
                        <option value={'Default'}>
                            City
                        </option>
                        {
                            cities.map((city : any, index) => {
                                return <option key={index} value={city.name}>{city.name}</option>
                            })
                        }
                    </select>
                </div>

                <div className="w-100">
                    <p className="font-h fc-a fs-s font-medium">Facilities</p>
                    
                    <div className="mobile-flex-col justify-between">
                        <div>
                        {
                            leftFacility.map((facility : any) => {
                                return filteredFacility.indexOf(facility) >= 0 ? (
                                    <HotelFacilitiesInteractable facility={facility} small={true} onClick={facilityFilterChange} active={true}/>
                                ) : (
                                    <HotelFacilitiesInteractable facility={facility} small={true} onClick={facilityFilterChange} active={false}/>
                                )
                            })
                        }
                        </div>
                        <div>
                        {
                            rightFacility.map((facility : any) => {
                                return filteredFacility.indexOf(facility) >= 0 ? (
                                    <HotelFacilitiesInteractable facility={facility} small={true} onClick={facilityFilterChange} active={true}/>
                                ) : (
                                    <HotelFacilitiesInteractable facility={facility} small={true} onClick={facilityFilterChange} active={false}/>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>

                <div className="w-100">
                    <p className="font-h fc-a fs-s font-medium">Rating</p>

                </div>
            </div>

            <div className="w-65 mb-10">
                <p className="font-h fc-a fs-s font-medium">Results</p>
                <div className={`w-100 flex gap-s wrap transition o-${hotelOpacity}`}>
                {
                    !useFilter ? (
                        hotels.map((hotel : any) => {
                            return <HotelCard hotel={hotel} className=" w-30 h-s45" />
                        })
                    ) : (
                        filteredHotels.map((hotel : any) => {
                            return <HotelCard hotel={hotel} className=" w-30 h-s45" />
                        })
                    )
                }
                </div>
            </div>
        </div>
    )
}