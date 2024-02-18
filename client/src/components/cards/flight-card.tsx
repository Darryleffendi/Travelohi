import { useState } from "react";


export default function FlightCard({className, ticket, style} : any) {

    const [hovered, setHovered] = useState<boolean>(false);

    let imgSrc = ticket.arrivalCity.imageUrl
    let airline = ticket.plane.airline.name
    let city = ticket.arrivalCity.name
    let departCity = ticket.departureCity.name
    let departDate = new Date(ticket.departureTime).toDateString();
    let departTime = new Date(ticket.departureTime).toTimeString().substring(0, 5);
    let price = ticket.price

    return (
        <div className={` bg-col-white z-10 shadow ${className} flex-col justify-between transition-2`} 
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
            style={style}
        >
            <div className="w-100 h-50 bg-col-a3 overflow-hidden flex-center justify-center relative">
                <img src={imgSrc} className={`h-100 cover o-80 transition flex-shrink-0 ${hovered ? "w-110" : "w-100"}`} />  
                <h1 className="absolute left-0 bottom-0 mb--2 fc-white font-serif fs-3xl">{city}</h1>
            </div>

            <div className="ml-2 flex-col justify-between h-50 w-100">
                <div>
                    <p className="font-h font-serif fc-a fs-s mb-0">{airline}</p>
                    <p className="font-p fc-a2 font-light fs-2xs mt-0">{departCity} - {city}</p>
                </div>

                <div>
                    <p className="mb-0 fs-3xs font-p fc-black">{departTime}</p>
                    <p className="mt-0 fs-3xs font-p fc-black">{departDate}</p>
                    <p className="mt--1 fs-m font-h fc-a2">${price}</p>
                </div>
            </div>

            <div className={`w-100 transition ${hovered ? 'h-24p bg-col-a2' : 'h-12p bg-col-a3'}`}>
                <p className={`m-0 font-p fs-2xs fc-white ml-2 transition-2 ${hovered ? "o-100" : "o-0"}`}>Book Now</p>
            </div>
        </div>
    )
}