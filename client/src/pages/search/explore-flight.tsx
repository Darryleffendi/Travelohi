import { useEffect, useState } from "react";
import { HotelFacilitiesInteractable } from "../../components/cards/facilities-card";
import FlightCard from "../../components/cards/flight-card";
import FlightCard2 from "../../components/cards/flight-card-2";
import HotelCard from "../../components/cards/hotel-card";
import useDebounce from "../../hooks/use-debounce";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from  "../../styles/explore.module.css"
import sortIcon from "../../assets/icon/sort.png";
import leftArrow from "../../assets/icon/leftWhite.png"
import rightArrow from "../../assets/icon/rightWhite.png"

export default function ExploreFlight({query = '', isSticky, country = ''} : any) {
    
    const [filteredDepartureCountry, setFilteredDepartureCountry] = useState<string>('');
    const [filteredDepartureCity, setFilteredDepartureCity] = useState<string>('');
    const [filteredArrivalCountry, setFilteredArrivalCountry] = useState<string>(country);
    const [filteredArrivalCity, setFilteredArrivalCity] = useState<string>('');
    const [useFilter, setUseFilter] = useState<boolean>(false);
    const [useSort, setUseSort] = useState<boolean>(false);
    const [minPrice, setMinPrice] = useState<any>("")
    const [maxPrice, setMaxPrice] = useState<any>("")

    const [countries, setCountries] = useState<Array<any>>([]);
    const [cities, setCities] = useState([]);

    const [flights, setFlights] = useState<Array<any>>([]);
    const [filteredFlights, setFilteredFlights] = useState<Array<any>>([]);
    const [flightOpacity, setFlightOpacity] = useState(0);

    const [showSort, setShowSort] = useState(false);
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState(1); // if desc then -1d

    const [paginatedFlights, setPaginatedFlights] = useState<Array<any>>([])
    const [paginatedIndex, setPaginatedIndex] = useState(0);
    const [paginate, setPaginate] = useState(20);

    useEffect(() => {
        if(country != "" && countries.length > 0) {
            for(let i = 0; i < countries.length; i++) {
                if(countries[i].name === country) {
                    setFilteredArrivalCountry(country);
                }
            }
        }
    }, [country, countries])

    const nextPaginate = async (back : boolean) => {

        let len = flights.length;
        
        if(useFilter || useSort) {
            len = filteredFlights.length
        }
        
        if(back) {
            if(paginatedIndex * paginate > 0) {
                setFlightOpacity(0)
                await new Promise(r => setTimeout(r, 400));
                setPaginatedIndex(paginatedIndex - 1)
                setFlightOpacity(100)
            }
        }
        else {
            if((paginatedIndex + 1) * paginate < len) {
                setFlightOpacity(0)
                await new Promise(r => setTimeout(r, 400));
                setPaginatedIndex(paginatedIndex + 1)
                setFlightOpacity(100)
            }
        }
    }


    const fetchFlights = async () => {
        let response;
        response = await fetch(APP_SETTINGS.backend + "/api/search/flight", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({'query': query})
        });
        
        let data = await response.json();

        // Untuk testing pagination
        // data = [...data, ...data, ...data, ...data, ...data, ...data]

        setFlights(data);
    }

    useDebounce(() => {
        (async () => {
            if(flightOpacity > 0) {
                setFlightOpacity(0)
                await new Promise(r => setTimeout(r, 400));
            }
            await fetchFlights();
            setFlightOpacity(100)

        })()
      }, [query], 500
    );

    useEffect(() => {

        if(filteredArrivalCity == '' && filteredArrivalCountry == '' && filteredDepartureCity == '' && filteredDepartureCountry == '' && maxPrice != '' && minPrice != '') {
            setUseFilter(false)
            if(!useSort) {
                setFilteredFlights([]);
            }
            return;
        }
        setUseFilter(true);

        let flightFilter = [...flights]


        if(filteredArrivalCountry != '') {
            flightFilter = flightFilter.filter(f => f.arrivalCity.Country.name == filteredArrivalCountry)
        }
        if(filteredArrivalCity != '') {
            flightFilter = flightFilter.filter(f => f.arrivalCity.name == filteredArrivalCity)
        }
        if(filteredDepartureCountry != '') {
            flightFilter = flightFilter.filter(f => f.departureCity.Country.name == filteredDepartureCountry)
        }
        if(filteredDepartureCity != '') {
            flightFilter = flightFilter.filter(f => f.departureCity.name == filteredDepartureCity)
        }
        if(minPrice != '') {
            flightFilter = flightFilter.filter(h => h.price >= minPrice)
        }
        if(maxPrice != '') {
            flightFilter = flightFilter.filter(h => h.price <= maxPrice)
        }

        setFilteredFlights(flightFilter)

    }, [filteredArrivalCity, filteredArrivalCountry, flights, filteredDepartureCity, filteredDepartureCountry, minPrice, maxPrice])

    useEffect(() => {
        if(sortBy === "") {
            setUseSort(false)
            if(!useFilter) {
                setFilteredFlights([]);
            }
            return;
        }

        let flightFilter;
        if(useFilter) {
            flightFilter = [...filteredFlights]
        }
        else {
            flightFilter = [...flights]
        }
        setUseSort(true)
        
        if(sortBy === "Duration") {
            flightFilter.sort((a, b) => ((new Date(a.departureTime).getTime() - new Date(a.arrivalTime).getTime()) - (new Date(b.departureTime).getTime() - new Date(b.arrivalTime).getTime())) * sortOrder);
        }
        else if(sortBy === "Price") {
            flightFilter.sort((a, b) => (a.price - b.price) * sortOrder);
        }
        setFilteredFlights(flightFilter)
        
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
                if(i >= filteredFlights.length) {
                    break;
                }
                paginated.push(filteredFlights[i])
            }
            else {
                if(i >= flights.length) {
                    break;
                }
                paginated.push(flights[i])
            }
        }
        setPaginatedFlights(paginated)

    }, [filteredFlights, flights, paginate, paginatedIndex])

    const filterChange = (e : any) => {
        const { name, value } = e.target;
        
        if(name === 'arrivalCountry') {

            if(value === 'Default') {
                setFilteredArrivalCountry('')
                setFilteredArrivalCity('')
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
                    setFilteredArrivalCountry(value);
                })()
            }
        }

        else if(name === 'arrivalCity') {
            if(value === 'Default') {
                setFilteredArrivalCity('')
            }
            else {
                setFilteredArrivalCity(value);
            }
        }

        else if(name === 'departureCountry') {

            if(value === 'Default') {
                setFilteredDepartureCountry('')
                setFilteredDepartureCity('')
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
                    setFilteredDepartureCountry(value);
                })()
            }
        }

        else if(name === 'departureCity') {
            if(value === 'Default') {
                setFilteredDepartureCity('')
            }
            else {
                setFilteredDepartureCity(value);
            }
        }
    }

    return (
        <div className="w-85 flex justify-between flex-start">
            {
                isSticky ? <div className="w-25 h-screen"></div> : <></>
            }
            <div className="w-s20 h-100 flex-col gap-s" style={isSticky ? {position:'fixed', top: '15vh'} : {}}>
                <div className="w-100">
                    <p className="font-h fc-a fs-s font-medium">Departure</p>
                    <select 
                        className={`${styles.filterInput} mb-1`} id="departureCountry" 
                        onChange={filterChange}
                        defaultValue={"Default"}
                        name="departureCountry"
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
                        className={styles.filterInput} id="departureCity" 
                        onChange={filterChange}
                        defaultValue={"Default"}
                        name="departureCity"
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
                    <p className="font-h fc-a fs-s font-medium">Arrival</p>
                    <select 
                        className={`${styles.filterInput} mb-1`} id="arrivalCountry" 
                        onChange={filterChange}
                        defaultValue={"Default"}
                        value={filteredArrivalCountry}
                        name="arrivalCountry"
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
                        className={styles.filterInput} id="arrivalCity" 
                        onChange={filterChange}
                        defaultValue={"Default"}
                        name="arrivalCity"
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
                <div className="flex-center w-100 mt-2">
                    <input 
                        type="checkbox" id="agree" 
                        onChange={(e) => {e.target.checked ? setFlightOpacity(0) : setFlightOpacity(100)}}
                    />
                    <label className="font-p fs-2xs fc-gray text-left w-80 ml-1" htmlFor="agree">Show Transit Flights</label>
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
                                <option value={'Price'}>
                                    Price
                                </option>
                                <option value={'Duration'}>
                                    Duration
                                </option>
                                <option value={'Transits'}>
                                    Transits
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
                <div className={`w-100 flex gap-s wrap transition o-${flightOpacity}`}>
                {
                    paginatedFlights.map((flight : any) => {
                        return <FlightCard ticket={flight} className=" w-30 h-s45" />
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