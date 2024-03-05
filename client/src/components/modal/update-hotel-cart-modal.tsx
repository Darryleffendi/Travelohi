import { useEffect, useState } from "react";
import useUser from "../../contexts/user-context";
import IHotelRoom from "../../interfaces/hotel-room";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/modal.module.css"
import StarRating from "../../util/star-rating";
import ReviewCardSmall from "../cards/review-card-small";

export default function UpdateHotelCartModal({unmount = () => {}, booking, refreshRoom} : any) {

    const [modalShown, setModalShown] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    
    const [startDate, setStartDate] = useState(new Date(booking.startDate).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date(booking.endDate).toISOString().split('T')[0]);

    const closeModal = async () => {
        setModalShown(false);
        await new Promise(r => setTimeout(r, 600));
        unmount();
    }

    const handleSubmit = async () => {
        const response2 = await fetch(APP_SETTINGS.backend + "/api/update/room/cart", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                'bookingId' : booking.ID,
                'startDate' : new Date(startDate).toISOString().split('T')[0],
                'endDate' : new Date(endDate).toISOString().split('T')[0]
            })
        });
        const data2 = await response2.json();
        if("error" in data2) {
            setErrorMessage(data2.error);
        }
        else {
            setErrorMessage("");
            refreshRoom()
            closeModal();
        }
    }

    useEffect(() => {
        setModalShown(true);
        document.body.style.overflowY = "hidden"

        console.log(booking)

        return () => {
            document.body.style.overflowY = "auto"
        }   
    }, [])

    return (
        <div className="w-screen h-screen fixed z-100 bg-col-dark2-transparent flex-center justify-center transition-2 top-0 left-0" style={{opacity: modalShown ? '100%' : '0%', backdropFilter: modalShown ? 'blur(10px)' : '', zIndex: "100"}} onClick={closeModal}>
            <div className={`bg-col-main shadow-light transition-3 flex-center justify-center mobile-flex-col overflow-auto ${styles.modalS}`} style={ modalShown ? {marginTop:'0vw', opacity: '100%'} : {marginTop:'60vw', opacity: '0%'}}  onClick={(e) => e.stopPropagation()}>
                <div className="w-30 h-80 flex-col gap-10">
                    
                    <p className="fs-l font-serif o-70 mt-0">{booking.room.Hotel.name}</p>

                    <img src={APP_SETTINGS.backend + "/" + booking.room.imageUrls[0]} className={`h-98p cover o-80 transition w-s10`} />  

                    <div className="flex-col gap-5">
                        <p className="fs-xs m-0 fc-a font-medium o-90">{booking.room.name}</p>
                        <p className="fs-2xs m-0 fc-a font-medium o-60">Price per night: ${booking.room.price}</p>
                    </div>
                </div>
                <div className={`w-60 h-80 mw-80 transition flex-col overflow-hidden justify-between`}>
                    <div>
                        <div className="flex-col w-80 ml-5">
                            <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="startDate">Check In</label>
                            <input type={"date"} name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`${styles.inputInverse} w-100 mb-1`} placeholder="startDate" id="startDate"/>
                        </div>

                        <div className="flex-col w-80 ml-5">
                            <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="endDate">Check Out</label>
                            <input type={"date"} name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`${styles.inputInverse} w-100 mb-1`} placeholder="endDate" id="endDate"/>
                        </div>
                    </div>

                    <div>
                        <p className="mb-1 fc-red fs-xs w-80 ml-5">{errorMessage}</p>
                        <div className="flex-center w-100 justify-between ml-5">
                            <button className="bg-col-a2 o-70 h-op2 w-80 fc-white" onClick={handleSubmit}>Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}