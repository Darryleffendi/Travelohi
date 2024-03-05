
import date from "../../assets/icon/date.png"
import cross from "../../assets/icon/cross.png"
import review from "../../assets/icon/review.png"
import { APP_SETTINGS } from "../../settings/app-settings"
import { useEffect, useState } from "react"

export default function HotelCartCard({hotelCart, selectRoom, refreshRoom, disableUpdate = false, enableReview = false} : any) {

    const [hovered, setHovered] = useState(false)

    const deleteBooking = async () => {
        const response2 = await fetch(APP_SETTINGS.backend + "/api/delete/room/cart", {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                'bookingId' : hotelCart.ID
            })
        });
        const data2 = await response2.json();
        refreshRoom();
    }

    return (
        <div 
            className={`w-100 mt-2 flex-center justify-between relative transition ${!hovered ? "bg-col-white" : "bg-col-light"}`} 
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        >

            <div className="absolute top-0 right-0 w-s10 h-48p mt--2 z-5 flex-center justify-end gap-xs">
                {
                    disableUpdate ? <></> : (
                        <>
                        <div 
                            className={`rounded-50 bg-col-a2 transition-3 flex-center justify-center pointer ${hovered ? "w-48p h-48p" : "w-0 h-0"}`}
                            onClick={() => selectRoom(hotelCart)}
                        >
                            <img src={date} className="w-40 h-40 filter-white"/>
                        </div>
                        <div 
                            className={`rounded-50 bg-col-red transition-3 flex-center justify-center pointer ${hovered ? "w-48p h-48p" : "w-0 h-0"}`}
                            onClick={() => deleteBooking()}
                        >
                            <img src={cross} className="w-50 h-50 filter-white"/>
                        </div>
                        </>
                    )
                }
                {
                    enableReview ? (
                        <div 
                            className={`rounded-50 bg-col-a2 transition-3 flex-center justify-center pointer ${hovered ? "w-48p h-48p" : "w-0 h-0"}`}
                            onClick={() => selectRoom(hotelCart.room.Hotel.ID)}
                        >
                            <img src={review} className="w-50 h-50 filter-white"/>
                        </div>
                    ) : <></>
                }
            </div>

            <div className="w-70 flex h-100 mt-2 mb-2 ml-2 gap-s">
                <img src={APP_SETTINGS.backend + "/" + hotelCart.room.imageUrls[0]} className={`h-98p cover o-80 transition w-s10`} />  

                <div className="flex-col gap-5">
                    <p className="fs-xs m-0 fc-a font-bold o-80">{hotelCart.room.Hotel.name}</p>
                    <p className="fs-3xs m-0 fc-a font-medium o-60">{hotelCart.room.name}</p>
                    <p className="fs-3xs m-0 fc-a font-medium o-60">Price per night: ${hotelCart.room.price}</p>

                </div>
            </div>

            <div className="w-20 mr-2 flex-col gap-5 flex-end">
                <div className="flex-center justify-center">
                    <div className="flex-col justify-center flex-center">
                        <p className="m-0 fs-xl font-bold font-serif fc-a2">{formatDate(new Date(hotelCart.startDate)).substring(0, 2)}</p>
                        <p className="m-0 mt--1 fs-xs font-serif o-70">{formatDate(new Date(hotelCart.startDate)).substring(3, 6)}</p>
                    </div>
                    <div className="w-32p border-bottom border-a o-70 mr-1 ml-1" style={{borderStyle: "dashed", borderWidth: "0px 0px 2px 0px"}}></div>
                    <div className="flex-col justify-center flex-center">
                        <p className="m-0 fs-xl font-bold font-serif fc-a2">{formatDate(new Date(hotelCart.endDate)).substring(0, 2)}</p>
                        <p className="m-0 mt--1 fs-xs font-serif o-70">{formatDate(new Date(hotelCart.endDate)).substring(3, 6)}</p>
                    </div>
                </div>
                <p className="fs-2xs o-50 font-medium">Total Price: ${dateDifference(hotelCart.startDate, hotelCart.endDate) * hotelCart.room.price}</p>
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

function dateDifference(date1 : any, date2 : any) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const startDate : any = new Date(date1);
    const endDate : any = new Date(date2);
    return Math.round((endDate - startDate) / millisecondsPerDay);
}