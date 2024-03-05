import { useEffect, useState } from "react";
import IProfileSubpage from "../../interfaces/profile-subpage";
import cart from "../../assets/icon/cart2.png"
import useUser from "../../contexts/user-context";
import { APP_SETTINGS } from "../../settings/app-settings";
import FlightCartCard from "../../components/cards/flight-cart-card";
import HotelCartCard from "../../components/cards/hotel-cart-card";
import UpdateHotelCartModal from "../../components/modal/update-hotel-cart-modal";
import PaymentModal from "../../components/modal/payment-modal";

export default function CartSubpage({setLeftCard} : IProfileSubpage) {

    const [flightCart, setFlightCart] = useState<Array<any>>([]);
    const [hotelCart, setHotelCart] = useState<Array<any>>([]);
    const [user, refreshUser] = useUser();

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showPayment, setShowPayment] = useState(false);

    const fetchSeats = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/api/get/seat/cart", {
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
        const response2 = await fetch(APP_SETTINGS.backend + "/api/get/room/cart", {
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

    useEffect(() => {

        let hotelPrice = 0
        let flightPrice = 0
        let baggagePrice = 0

        for(let i = 0; i < hotelCart.length; i++) {
            hotelPrice += dateDifference(hotelCart[i].startDate, hotelCart[i].endDate) * hotelCart[i].room.price
        }
        for(let i = 0; i < flightCart.length; i++) {
            flightPrice += flightCart[i].flight.price
            baggagePrice += flightCart[i].baggage
        }

        setLeftCard(
            <>
            <div className="flex-center gap-xs o-60">
                <img src={cart} className="w-20p h-20p cover" />
                <p className="font-serif fs-s font-medium fc-a ">Cart Summary</p>
            </div>
            <div className="w-100 h-s50 bg-col-white shadow-light flex-center justify-center">
                <div className="w-80 flex-col">
                    <div className="w-100 border-bottom border-a-transparent">
                        <p className="font-serif fs-xs mt-0">Subtotal</p>
                    </div>

                    <div className="flex-center justify-between mt-2">
                        <p className="fs-xs m-0 o-50 font-medium">Flight Tickets</p>
                        <p className="fs-xs font-medium fc-a2 m-0">${flightPrice}</p>
                    </div>
                    
                    <div className="flex-center justify-between mt-1">
                        <p className="fs-xs m-0 o-50 font-medium">Hotel Rooms</p>
                        <p className="fs-xs font-medium fc-a2 m-0">${hotelPrice}</p>
                    </div>

                    <div className="flex-center justify-between mt-1">
                        <p className="fs-xs m-0 o-50 font-medium">Baggage</p>
                        <p className="fs-xs font-medium fc-a2 m-0">${baggagePrice}</p>
                    </div>

                    <div className="w-100 border-top border-a-transparent flex-center justify-between mt-2">
                        <p className="font-serif fs-xs">Grand Total</p>
                        <p className="fs-xs font-medium fc-a2">${flightPrice + hotelPrice + baggagePrice}</p>
                    </div>

                    <button 
                        className="bg-col-a2 fc-white o-80 h-op3 mt-2"  
                        onClick={() =>setShowPayment(true)}
                    >
                        Checkout
                    </button>
                </div>
            </div>
            </>
        );
    }, [flightCart, hotelCart])

    return (
        <>
            <p className="fs-l m-0 font-serif font-medium fc-a">Your Cart</p>

            <div className="mt-2 border-bottom border-a-transparent o-80">
                <p className="mb-1 font-medium fs-xs fc-a">Flights</p>
            </div>

            <div>
            {
                flightCart.map((flight) => {
                    return <FlightCartCard flightCart={flight} refreshFlight={fetchSeats}/>
                })
            }
            </div>

            <div className="mt-2 border-bottom border-a-transparent o-80">
                <p className="mb-1 font-medium fs-xs fc-a">Hotels</p>
            </div>

            <div>
            {
                hotelCart.map((hotel) => {
                    return <HotelCartCard hotelCart={hotel} selectRoom={setSelectedRoom} refreshRoom={fetchRooms}/>
                })
            }
            </div>
            
            {
                selectedRoom != null ? (
                    <UpdateHotelCartModal booking={selectedRoom} unmount={() => setSelectedRoom(null)} refreshRoom={fetchRooms}/>
                ) : 
                showPayment == true ? (
                    <PaymentModal unmount={() => setShowPayment(false)} flightCart={flightCart} hotelCart={hotelCart} refetch={() => {fetchRooms(); fetchSeats();}}/>
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