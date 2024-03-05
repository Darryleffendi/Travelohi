
import date from "../../assets/icon/date.png"
import plane from "../../assets/icon/plane.png"
import seat from "../../assets/icon/seat.png"
import baggageIcon from "../../assets/icon/baggage.png"
import wallet from "../../assets/icon/wallet.png"
import cross from "../../assets/icon/cross.png"
import { useEffect, useState } from "react"
import { APP_SETTINGS } from "../../settings/app-settings"

export default function FlightCartCard({flightCart, refreshFlight, disableUpdate = false} : any) {

    const alphabet = "ABCDEFGHIJ"

    const seatsArr = JSON.parse(flightCart.seats)

    let seats = ""
    for(let i = 0; i < seatsArr.length; i++) {
        if(i > 0) {
            seats += ","
        }
        seats += " " + alphabet[seatsArr[i].columnIndex] + (seatsArr[i].rowIndex + 1) 
    }
    
    const [hovered, setHovered] = useState(false)

    const deleteBooking = async () => {
        const response2 = await fetch(APP_SETTINGS.backend + "/api/delete/seat/cart", {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                'seatId' : flightCart.ID
            })
        });
        const data2 = await response2.json();
        refreshFlight();
    }

    return (
        <div 
            className={`w-100 mt-2 flex-center justify-between transition relative ${!hovered ? "bg-col-white" : "bg-col-light"}`}
            onMouseEnter={() => disableUpdate ? {} : setHovered(true)} onMouseLeave={() => disableUpdate ? {} : setHovered(false)}
        >
            <div className="absolute top-0 right-0 w-s10 h-48p mt--2 z-5 flex-center justify-end gap-xs">
                <div 
                    className={`rounded-50 bg-col-red transition-3 flex-center justify-center pointer ${hovered ? "w-48p h-48p" : "w-0 h-0"}`}
                    onClick={() => deleteBooking()}
                >
                    <img src={cross} className="w-50 h-50 filter-white"/>
                </div>
            </div>
            <div className="w-70 flex-col justify-center h-100 o-80 mt-2 mb-2">
                <div className={`w-90 z-1 transition ${!hovered ? "bg-col-white" : "bg-col-light"}`}>
                    <div className="w-100 h-64p flex-center justify-start">
                        <div className="w-100 h-64p flex-center justify-start">
                            <div className="w-20 flex-col flex-center flex-shrink-0">
                                <p  className="fs-xs m-0 fc-a font-bold">{formatTime(new Date(flightCart.flight.departureTime))}</p>
                                <p  className="fs-3xs m-0 fc-a font-medium o-60">{formatDate(new Date(flightCart.flight.departureTime))}</p>
                            </div>

                            <div className="w-12p h-12p bg-col-a rounded-50 flex-shrink-0"></div>

                            <div className="w-70 ml-2 flex-col flex-start">
                                <p  className="fs-xs m-0 fc-a font-bold">{flightCart.flight.departureCity.airportName} ({flightCart.flight.departureCity.airportCode})</p>
                                <p  className="fs-3xs m-0 fc-a font-medium o-60">{flightCart.flight.departureCity.name}, {flightCart.flight.departureCity.Country.name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`w-90 z-1 transition ${!hovered ? "bg-col-white" : "bg-col-light"}`}>
                    <div className="w-100 h-64p flex-center justify-start">
                        <div className="w-20 flex-col flex-center flex-shrink-0">
                            <p  className="fs-xs m-0 fc-a font-bold">{formatTime(new Date(flightCart.flight.arrivalTime))}</p>
                            <p  className="fs-3xs m-0 fc-a font-medium o-60">{formatDate(new Date(flightCart.flight.arrivalTime))}</p>
                        </div>

                        <div className="w-12p h-12p bg-col-a rounded-50 flex-shrink-0"></div>

                        <div className="w-70 ml-2 flex-col flex-start">
                            <p  className="fs-xs m-0 fc-a font-bold">{flightCart.flight.arrivalCity.airportName} ({flightCart.flight.arrivalCity.airportCode})</p>
                            <p  className="fs-3xs m-0 fc-a font-medium o-60">{flightCart.flight.arrivalCity.name}, {flightCart.flight.arrivalCity.Country.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-20 mr-2 o-70 flex-col gap-5">
                <div className="flex gap-10 w-100">
                    <img src={seat} className="w-18p contain" />
                    <p className="m-0 fs-2xs font-medium o-80">Seats: {seats}</p>
                </div>
                <div className="flex gap-10 w-100">
                    <img src={plane} className="w-18p contain o-30" />
                    <p className="m-0 fs-2xs font-medium o-80">{flightCart.flight.plane.planeModel.manufacturer} {flightCart.flight.plane.planeModel.name}</p>
                </div>
                <div className="flex gap-10 w-100">
                    <img src={wallet} className="w-16p contain o-50" />
                    <p className="m-0 fs-2xs font-medium o-80">Price per seat: ${flightCart.flight.price}</p>
                </div>
                <div className="flex gap-10 w-100">
                    <img src={baggageIcon} className="w-16p contain o-50" />
                    <p className="m-0 fs-2xs font-medium o-80">Baggage: {flightCart.baggage}kg</p>
                </div>
                <div className="flex gap-10 w-100">
                    <p className="m-0 fs-2xs fc-a2 font-medium o-90">Status: {flightCart.status}</p>
                </div>
            </div>
        </div>
    )
}

function formatTime(date : any) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const formattedTime = `${hours}:${minutes}`;

    return formattedTime;
}

function formatDate(date : any) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = date.getDate();
    const monthIndex = date.getMonth(); // getMonth() returns a zero-based index

    return `${day < 10 ? '0' + day : day} ${months[monthIndex]}`;
}