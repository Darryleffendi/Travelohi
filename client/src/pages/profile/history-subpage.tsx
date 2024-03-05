import { useEffect, useState } from "react";
import IProfileSubpage from "../../interfaces/profile-subpage";
import cart from "../../assets/icon/cart2.png"
import useUser from "../../contexts/user-context";
import { APP_SETTINGS } from "../../settings/app-settings";
import FlightCartCard from "../../components/cards/flight-cart-card";
import HotelCartCard from "../../components/cards/hotel-cart-card";
import UpdateHotelCartModal from "../../components/modal/update-hotel-cart-modal";
import PaymentModal from "../../components/modal/payment-modal";
import styles from "../../styles/profile.module.css"
import useDebounce from "../../hooks/use-debounce";
import ReviewModal from "../../components/modal/review-modal";

export default function HistorySubpage({setLeftCard} : IProfileSubpage) {

    const [flightCart, setFlightCart] = useState<Array<any>>([]);
    const [hotelCart, setHotelCart] = useState<Array<any>>([]);
    const [filteredFlightCart, setFilteredFlightCart] = useState<Array<any>>([]);
    const [filteredHotelCart, setFilteredHotelCart] = useState<Array<any>>([]); 
    const [user, refreshUser] = useUser();

    const [query, setQuery] = useState("");

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [showFlights, setShowFlights] = useState(true);
    const [showHotels, setShowHotels] = useState(true);

    const [reviewHotelId, setReviewHotelId] = useState<number>(-1);

    const fetchSeats = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/api/get/seat/history", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                'userId' : user?.ID
            })
        });
        const data = await response.json();
        setFlightCart(data);
    }

    const fetchRooms = async () => {
        const response2 = await fetch(APP_SETTINGS.backend + "/api/get/room/history", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                'userId' : user?.ID
            })
        });
        const data2 = await response2.json();

        for(let i = 0; i < data2.length; i++) {
            data2[i].room.imageUrls = JSON.parse(data2[i].room.imageUrls)
        }
        setHotelCart(data2);
    }

    useEffect(() => {
        (async () => {
            await fetchSeats()
            await fetchRooms()            
        })()

    }, [])

    useDebounce(() => {
        let hotels = []
        let flights = []

        console.log(hotelCart)
        console.log(flightCart)

        for(let i = 0; i < hotelCart.length; i++) {
            if(hotelCart[i].room.Hotel.name.toLowerCase().includes(query.toLowerCase())) {
                hotels.push(hotelCart[i])
            }
        }

        for(let i = 0; i < flightCart.length; i++) {
            if(flightCart[i].flight.arrivalCity.Country.name.toLowerCase().includes(query.toLowerCase())) {
                flights.push(flightCart[i])
            }
            else if(flightCart[i].flight.arrivalCity.name.toLowerCase().includes(query.toLowerCase())) {
                flights.push(flightCart[i])
            }
            else if(flightCart[i].flight.departureCity.Country.name.toLowerCase().includes(query.toLowerCase())) {
                flights.push(flightCart[i])
            }
            else if(flightCart[i].flight.departureCity.name.toLowerCase().includes(query.toLowerCase())) {
                flights.push(flightCart[i])
            }
        }

        setFilteredFlightCart(flights)
        setFilteredHotelCart(hotels)

      }, [query], 500
    );

    useEffect(() => {
        setLeftCard(<></>);
    }, [flightCart, hotelCart])

    return (
        <>
            <p className="fs-l m-0 font-serif font-medium fc-a">Your Past Orders</p>
            <div className="w-100 mt-1">
                <label className="font-p fc-gray fs-3xs text-left w-100 mt-2" htmlFor="creditNumber">Search for hotels or flights</label>
                <input 
                    type="text" className={`${styles.overlayInput} fs-2xs`} id="cardNumber"
                    placeholder="Search" name="cardNumber"
                    value={query} onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="mt-2 border-bottom border-a-transparent o-80 pointer" onClick={() => setShowFlights(!showFlights)}>
                <p className="mb-1 font-medium fs-xs fc-a">Flights</p>
            </div>

            <div className={`transition-2 ${showFlights ? "h-auto" : "h-0 overflow-hidden"}`}>
            {
                query == "" ? (
                    flightCart.map((flight) => {
                        return <FlightCartCard flightCart={flight} refreshFlight={fetchSeats} disableUpdate={true}/>
                    })
                ) : (
                    filteredFlightCart.map((flight) => {
                        return <FlightCartCard flightCart={flight} refreshFlight={fetchSeats} disableUpdate={true}/>
                    })
                )
            }
            </div>

            <div className="mt-2 border-bottom border-a-transparent o-80 pointer" onClick={() => setShowHotels(!showHotels)}>
                <p className="mb-1 font-medium fs-xs fc-a">Hotels</p>
            </div>

            <div className={`transition-2 ${showHotels ? "h-auto" : "h-0 overflow-hidden"}`}>
            {
                query == "" ? (
                    hotelCart.map((hotel) => {
                        return <HotelCartCard hotelCart={hotel} selectRoom={setSelectedRoom} refreshRoom={fetchRooms} disableUpdate={true} enableReview={true}/>
                    })
                ) : (
                    filteredHotelCart.map((hotel) => {
                        return <HotelCartCard hotelCart={hotel} selectRoom={setSelectedRoom} refreshRoom={fetchRooms} disableUpdate={true} enableReview={true}/>
                    })
                )
            }
            </div>
            
            {
                selectedRoom != null ? (
                    <ReviewModal unmount={() => setSelectedRoom(null)} hotelId={selectedRoom} refetch={fetchRooms} />
                ) : <></>
            }
        </>
    )
}


function dateDifference(date1 : any, date2 : any) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const startDate : any = new Date(date1);
    const endDate : any = new Date(date2);
    return Math.round((endDate - startDate) / millisecondsPerDay);
}