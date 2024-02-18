import pool from "../../assets/icon/facilities/pool.png"
import ac from "../../assets/icon/facilities/ac.svg"
import elevator from "../../assets/icon/facilities/elevator.png"
import h24 from "../../assets/icon/facilities/h24.png"
import park from "../../assets/icon/facilities/park.png"
import wifi from "../../assets/icon/facilities/wifi.svg"
import restaurant from "../../assets/icon/facilities/restaurant.png"
import styles from "../../styles/facility.module.css"

const HotelFacilitiesCard : any = {
    "swimmingpool" : {
        img: pool,
        title: "Swimming Pool"
    },
    "ac" : {
        img: ac,
        title: "Air Conditioned"
    },
    "elevator" : {
        img: elevator,
        title: "Elevator"
    },
    "h24": {
        img : h24,
        title: "24 Hours Service"
    },
    "park" : {
        img: park,
        title: "Parking"
    },
    "wifi" : {
        img: wifi,
        title: "Wifi Connection"
    },
    "restaurant" : {
        img: restaurant,
        title: "Restaurant"
    },
}

export const HotelFacilities = ({facility, small = false} : facilityParams) => {
    
    let room = HotelFacilitiesCard[facility];

    if(room == null || room == undefined) return <>{facility}</>

    return (
        <div className={`flex-center mb-2 ${small ? 'h-12p' : 'h-24p'}`}>
            <img src={room.img} className="h-100"/>
            <p className={`ml-1 ${small ? 'fs-2xs' : ''}`}>{room.title}</p>
        </div>
    )
}

export const HotelFacilitiesInteractable = ({facility, small = false, onClick, active = false} : interactableFacilityParams) => {
    
    let room = HotelFacilitiesCard[facility];

    if(room == null || room == undefined) return <>{facility}</>

    return (
        <div className={`flex-center rounded transition pointer ${small ? 'h-12p' : 'h-24p'} ${styles.facilityHover} ${active ? styles.active : ''}`} 
            onClick={() => onClick(facility)}
        >
            <img src={room.img} className="h-100 transition"/>
            <p className={`ml-1 ${small ? 'fs-2xs' : ''}`}>{room.title}</p>
        </div>
    )
}

export const RoomFacilities = () => {

}

type facilityParams = {
    facility: string,
    small?: boolean
} 

type interactableFacilityParams = {
    facility: string,
    small?: boolean,
    onClick: (facility : string) => any,
    active?: boolean
} 