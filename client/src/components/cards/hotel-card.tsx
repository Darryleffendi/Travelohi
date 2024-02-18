import { useEffect, useState } from "react"
import useNavigator from "../../contexts/navigator-context"
import { APP_SETTINGS } from "../../settings/app-settings"


export default function HotelCard({hotel, className = "", style = {}} : any) {
    
    let name = hotel.name
    let location = hotel.City.name + ", " + hotel.City.Country.name
    let rooms = hotel.rooms
    let imgSrc = APP_SETTINGS.backend + "/" + hotel.imageUrl

    let minPrice = 0;
    if(rooms) {
        minPrice = rooms[0].price
        rooms.forEach((element : any) => {
            if (element.price < minPrice) {
                minPrice = element.price
            }
        });
    }

    const [hovered, setHovered] = useState<boolean>(false);
    const changePage = useNavigator();

    return (
        <div className={` bg-col-white z-10 shadow ${className} transition-2 flex-col justify-between`} 
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
            onClick={() => changePage(`/hotel/${hotel.ID}`)}
            style={style}
        >
            <div className="w-100 h-50 bg-col-a3 overflow-hidden flex-center justify-center">
                <img src={imgSrc} className={`h-100 cover o-80 transition flex-shrink-0 ${hovered ? "w-110" : "w-100"}`} />  
            </div>

            <div className="ml-2 flex-col justify-between h-50 w-100">
                <div className="w-80">
                    <p className="font-h font-serif fc-a fs-s mb-0">{name}</p>
                    <p className="font-p fc-a2 font-light fs-2xs mt-0">{location}</p>
                </div>

                <div>
                    <p className="mb-0 fs-2xs font-p fc-black">Starting From</p>
                    <p className="mt--1 fs-m font-h fc-a2">${minPrice}</p>
                </div>
            </div>

            <div className={`w-100 transition ${hovered ? 'h-24p bg-col-a2' : 'h-12p bg-col-a3'}`}>
                <p className={`m-0 font-p fs-2xs fc-white ml-2 transition-2 ${hovered ? "o-100" : "o-0"}`}>Book Now</p>
            </div>
        </div>
    )
}