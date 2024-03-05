import { useEffect, useState } from "react";
import { HotelFacilitiesInteractable } from "../../components/cards/facilities-card";
import HotelCard from "../../components/cards/hotel-card";
import useDebounce from "../../hooks/use-debounce";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from  "../../styles/explore.module.css"
import StarRating from "../../util/star-rating";
import sortIcon from "../../assets/icon/sort.png";
import leftArrow from "../../assets/icon/leftWhite.png"
import rightArrow from "../../assets/icon/rightWhite.png"

export default function ExploreHotel({query = '', isSticky, country = ""} : any) {
    
    const [filteredFacility, setFilteredFacility] = useState<Array<string>>([])
    const [filteredCountry, setFilteredCountry] = useState<string>(country);
    const [filteredCity, setFilteredCity] = useState<string>('');
    const [rating, setRating] = useState(0);
    const [useFilter, setUseFilter] = useState<boolean>(false);
    const [useSort, setUseSort] = useState<boolean>(false);
    const [minPrice, setMinPrice] = useState<any>("")
    const [maxPrice, setMaxPrice] = useState<any>("")

    const [countries, setCountries] = useState<Array<any>>([]);
    const [cities, setCities] = useState([]);

    const [hotels, setHotels] = useState<Array<any>>([]);
    const [filteredHotels, setFilteredHotels] = useState<Array<any>>([]);
    const [hotelOpacity, setHotelOpacity] = useState(0);

    const [showSort, setShowSort] = useState(false);
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState(1); // if desc then -1d

    const [paginatedHotels, setPaginatedHotels] = useState<Array<any>>([])
    const [paginatedIndex, setPaginatedIndex] = useState(0);
    const [paginate, setPaginate] = useState(20);

    useEffect(() => {
        if(country != "" && countries.length > 0) {
            for(let i = 0; i < countries.length; i++) {
                if(countries[i].name === country) {
                    setFilteredCountry(country);
                }
            }
        }
    }, [country, countries])

    const nextPaginate = async (back : boolean) => {

        let len = hotels.length;
        
        if(useFilter || useSort) {
            len = filteredHotels.length
        }
        
        if(back) {
            if(paginatedIndex * paginate > 0) {
                setHotelOpacity(0)
                await new Promise(r => setTimeout(r, 400));
                setPaginatedIndex(paginatedIndex - 1)
                setHotelOpacity(100)
            }
        }
        else {
            if((paginatedIndex + 1) * paginate < len) {
                setHotelOpacity(0)
                await new Promise(r => setTimeout(r, 400));
                setPaginatedIndex(paginatedIndex + 1)
                setHotelOpacity(100)
            }
        }
    }

    const fetchHotels = async () => {
        let response;
        response = await fetch(APP_SETTINGS.backend + "/api/search/hotel", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'query': query})
        });
        
        let data = await response.json();
        
        for (let i = 0; i < data.length; i++) {
            const response2 = await fetch(APP_SETTINGS.backend + "/api/get/room/from/hotel", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'id': data[i].ID}),
            });
            const roomData = await response2.json();
            data[i].rooms = roomData

            let minPrice = roomData[0].price;
            data[i].rooms.forEach((element : any) => {
                if (element.price < minPrice) {
                    minPrice = element.price
                }
            });
            data[i].minPrice = minPrice;
        }

        // Untuk testing pagination
        // data = [...data, ...data, ...data, ...data]

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

        if(filteredCity == '' && filteredCountry == '' && filteredFacility.length == 0 && rating == 0 && maxPrice == '' && minPrice == '') {
            setUseFilter(false)
            if(!useSort) {
                setFilteredHotels([]);
            }
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

        if(rating > 0) {
            hotelFilter = hotelFilter.filter(h => h.rating == rating)
        }

        if(minPrice != '') {
            hotelFilter = hotelFilter.filter(h => h.minPrice >= minPrice)
        }

        if(maxPrice != '') {
            hotelFilter = hotelFilter.filter(h => h.minPrice <= maxPrice)
        }

        setFilteredHotels(hotelFilter)

    }, [filteredCity, filteredCountry, filteredFacility, hotels, rating, minPrice, maxPrice])

    useEffect(() => {
        if(sortBy === "") {
            setUseSort(false)
            if(!useFilter) {
                setFilteredHotels([]);
            }
            return;
        }

        let hotelFilter;
        if(useFilter) {
            hotelFilter = [...filteredHotels]
        }
        else {
            hotelFilter = [...hotels]
        }
        setUseSort(true)
        
        if(sortBy === "Rating") {
            hotelFilter.sort((a, b) => (a.rating - b.rating) * sortOrder);
        }
        else if(sortBy === "Price") {
            hotelFilter.sort((a, b) => (a.minPrice - b.minPrice) * sortOrder);
        }

        setFilteredHotels(hotelFilter)
        
    }, [sortBy, sortOrder])

    useEffect(() => {
        (async () => {
            const response = await fetch(APP_SETTINGS.backend + "/api/get/country", {
                method: 'GET',
            });
            const data = await response.json();
            setCountries(data);
        })()
    }, [])

    useEffect(() => {
        let paginated = []

        for(let i = paginatedIndex * paginate; i < (paginatedIndex + 1) * paginate; i++) {
            
            if(useFilter || useSort) {
                if(i >= filteredHotels.length) {
                    break;
                }
                paginated.push(filteredHotels[i])
            }
            else {
                if(i >= hotels.length) {
                    break;
                }
                paginated.push(hotels[i])
            }
        }
        setPaginatedHotels(paginated)

    }, [filteredHotels, hotels, paginate, paginatedIndex])

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
            <div className="w-s20 h-screen flex-col gap-xs" style={isSticky ? {position:'fixed', top: '15vh'} : {}}>
                <div className="w-100">
                    <p className="font-h fc-a fs-s font-medium mb-2">Region</p>
                    <select 
                        className={`${styles.filterInput} mb-1`} id="country" 
                        onChange={filterChange}
                        value={filteredCountry}
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
                    <p className="font-h fc-a fs-s font-medium mb-1">Facilities</p>
                    
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
                    <p className="font-h fc-a fs-s font-medium mt-1 mb-1">Rating</p>
                    <StarRating rating={rating} setRating={(r) => { if(r == rating) r = 0; setRating(r)}}/>
                </div>

                <div className="w-100">
                    <p className="font-h fc-a fs-s font-medium mb-1 mt-1">Price</p>
                    
                    <div className="w-100 flex-center gap-10">
                        <input 
                            className={styles.filterInput} type="number" placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <input 
                            className={styles.filterInput} type="number" placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="w-65 mb-10">
                <div className="w-100 flex-center justify-between">
                    <p className="font-h fc-a fs-s font-medium">Results</p>
                    <div 
                        className="flex-center relative"
                        onMouseEnter={() => setShowSort(true)} onMouseLeave={() => setShowSort(false)}
                    >
                        <img src={sortIcon} className="w-20p h-20p cover filter-black o-50 h-op3"/>

                        <div className={`absolute w-s20 bg-col-white top-0 right-0 transition-2 shadow flex-center flex-col ${showSort ? "o-100 mt-5 z-100" : "o-0 mt-0 z--1"}`}>
                            <p className="fs-xs w-80 font-medium o-60">Sort based on</p>
                            <select 
                                className={`${styles.filterInput2} mb-2 w-80`} id="country" 
                                onChange={(e) => setSortBy(e.target.value)}
                                defaultValue={""}
                                name="sort"
                            >
                                <option value={''}>
                                    None
                                </option>
                                <option value={'Rating'}>
                                    Rating
                                </option>
                                <option value={'Price'}>
                                    Price
                                </option>
                            </select>
                            <select 
                                className={`${styles.filterInput2} mb-2 w-80`} id="country" 
                                onChange={(e) => setSortOrder(parseInt(e.target.value))}
                                defaultValue={1}
                                name="sort"
                            >
                                <option disabled value={1}>
                                    Sort Order
                                </option>
                                <option value={1}>
                                    Ascending
                                </option>
                                <option value={-1}>
                                    Descending
                                </option>
                            </select>

                            <p className="fs-xs w-80 font-medium o-60">Paginate</p>
                            <select 
                                className={`${styles.filterInput2} mb-5 w-80`} id="country" 
                                onChange={(e) => setPaginate(parseInt(e.target.value))}
                                defaultValue={20} value={paginate}
                                name="sort"
                            >
                                <option value={20}>
                                    20
                                </option>
                                <option value={25}>
                                    25
                                </option>
                                <option value={30}>
                                    30
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className={`w-100 flex gap-s wrap transition o-${hotelOpacity}`}>
                {
                    paginatedHotels.map((hotel : any) => {
                        return <HotelCard hotel={hotel} className=" w-30 h-s45" />
                    })
                }
                </div>
                <div className="w-100 mt-10 flex-center justify-between z-100">
                    <p className="font-medium o-50 fs-xs">Showing {paginate} results</p>
                    <div className="flex-center">
                        <div 
                            className="h-48p bg-col-a-transparent w-48p rounded-50 flex-center justify-center o-60 transition-2s hover-bg-col-a2 mr-1 pointer"
                            onClick={() => nextPaginate(true)}
                        >
                            <div className="h-40p bg-col-main w-40p rounded-50 flex-center justify-center" >
                                <img src={leftArrow} className="w-40 filter-black" />
                            </div>
                        </div>
                        <div 
                            className="h-48p bg-col-a-transparent w-48p rounded-50 flex-center justify-center o-60 transition-2s hover-bg-col-a2 pointer"
                            onClick={() => nextPaginate(false)}
                        >
                            <div className="h-40p bg-col-main w-40p rounded-50 flex-center justify-center" >
                                <img src={rightArrow} className="w-40 filter-black" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}