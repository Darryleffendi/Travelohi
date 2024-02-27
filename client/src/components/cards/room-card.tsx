import { useEffect, useState } from "react"
import useNavigator from "../../contexts/navigator-context"
import { APP_SETTINGS } from "../../settings/app-settings"


export default function RoomCard({room, className = "", style = {}, onClick = () => {}} : any) {    
    let name = room.name
    let images = JSON.parse(room.imageUrls)
    let imgSrc = APP_SETTINGS.backend + "/" + images[0]

    const [hovered, setHovered] = useState<boolean>(false);

    return (
        <div className={` bg-col-white z-10 shadow transition-2 flex-col justify-between pointer ${className} `} 
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            style={style}
        >
            <div className="w-100 h-100 overflow-hidden flex-center justify-center relative bg-col-a3">
                <img src={imgSrc} className={`cover transition flex-shrink-0 absolute ${hovered ? "h-110 o-40 filter-blur" : "h-100 o-70"}`} />  
                
                <div className="w-90 h-90 border-white flex-col flex-center justify-center z-5 relative">
                    <p className={`font-h font-serif transition m-0 ${hovered ? "fs-2xl" : "fs-xl"}`}>{room.name}</p>
                    <p className="m-0 font-p fs-xs fc-white o-70">From ${room.price} for 2 people</p>
                    
                    <div className={`absolute bg-col-a3 rounded-2 flex-center justify-center bottom-0 mb-5 transition-3 ${hovered ? "o-90 w-40 h-40p" : "o-0 w-20 h-24p"}`}>
                        <p className={`font-serif fc-white transition-3 ${hovered ? "fs-xs" : "fs-3xs"}`}>Book Now</p>
                    </div>
                </div>

            </div>
        </div>
    )
}