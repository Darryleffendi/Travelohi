import { useEffect, useState } from "react";
import IHotelRoom from "../../interfaces/hotel-room";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/modal.module.css"
import { HotelFacilities } from "../cards/facilities-card";

export default function RoomModal({room, unmount = () => {}} : any) {

    const images = JSON.parse(room.imageUrls)
    
    const [modalShown, setModalShown] = useState(false);
    const [activeImage, setActiveImage] = useState(images[0]);
    const [imageOpacity, setImageOpacity] = useState(100);

    const [leftFacility, setLeftFacility] = useState([]);
    const [rightFacility, setRightFacility] = useState([]);

    const changeImage = async (image : any) => {
        setImageOpacity(0);
        await new Promise(r => setTimeout(r, 400));
        setActiveImage(image);
        setImageOpacity(100);
    }
 
    useEffect(() => {
        setModalShown(true);
        document.body.style.overflowY = "hidden"

        let facilities = room.facilities.split(",");
        let mid = Math.ceil(facilities.length / 2.0);

        setLeftFacility(facilities.slice(0, mid));
        setRightFacility(facilities.slice(mid, facilities.length));

        return () => {
            document.body.style.overflowY = "auto"
        }   
    }, [])

    const closeModal = async () => {
        
        setModalShown(false);
        await new Promise(r => setTimeout(r, 600));
        unmount();
    }

    return (
        <div className="w-screen h-screen fixed z-100 bg-col-dark2-transparent flex-center justify-center transition-2 top-0" style={{opacity: modalShown ? '100%' : '0%', backdropFilter: modalShown ? 'blur(10px)' : '' }} onClick={closeModal}>
            <div className={`bg-col-main shadow-light transition-3 flex-center justify-center mobile-flex-col overflow-auto ${styles.modal}`} style={ modalShown ? {marginTop:'0vw', opacity: '100%'} : {marginTop:'60vw', opacity: '0%'}}  onClick={(e) => e.stopPropagation()}>
                <div className={`w-40 h-80 mr-5 mw-80 transition o-${imageOpacity}`}>
                    <img className="w-100 h-50 cover mb-1 shadow-light" src={APP_SETTINGS.backend + "/" + activeImage}/>
                    {
                        images.map((image : any, index : number) => {
                            return image == activeImage ? <></> :
                                <img className="w-30 h-15 cover mr-1 shadow-light" src={APP_SETTINGS.backend + "/" + image} key={index} onClick={() => changeImage(image)}/>
                        })
                    }
                </div>
                <div className="w-40 h-80 flex-col mw-80">
                    <p className="fs-xl m-0 font-serif font-medium">{room.name}</p>
                    <p className="fs-xs m-0 font-p fc-a2">{room.bedType.toUpperCase()}</p>
                    <p className="fs-xs mb-2 font-serif">Room for {room.guests} guests - starting from ${room.price}</p>

                    <div className="flex w-90 justify-between mt-5">
                        <div>
                        {
                            leftFacility.map((facility : any, index : number) => {
                                return <HotelFacilities facility={facility} small={true} />
                            })
                        }
                        </div>
                        <div>
                        {
                            rightFacility.map((facility : any, index : number) => {
                                return <HotelFacilities facility={facility} small={true} />
                            })
                        }
                        </div>
                    </div>
                    
                    <div className="mt-5 flex-center justify-between w-90">
                        <div className="flex-col w-45">
                            <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="arrivalTime">Check In</label>
                            <input type={"date"} name="arrivalTime" value={''} onChange={() => {}} className={`${styles.inputInverse} w-100 mb-1`} placeholder="arrivalTime" id="arrivalTime"/>
                        </div>

                        <div className="flex-col w-45">
                            <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="arrivalTime">Check Out</label>
                            <input type={"date"} name="arrivalTime" value={''} onChange={() => {}} className={`${styles.inputInverse} w-100 mb-1`} placeholder="arrivalTime" id="arrivalTime"/>
                        </div>
                    </div>

                    <label className="font-p fc-gray fs-2xs text-left w-90" htmlFor="arrivalTime">Guests</label>
                    <input type={"number"} name="arrivalTime" value={''} onChange={() => {}} className={`${styles.inputInverse} w-90 mb-1`} placeholder="Number of Guests" id="arrivalTime"/>
                        
                    <div className="flex-center w-95 justify-between mt-2">
                        <p className="fs-2xl m-0 fc-a2 font-serif">${room.price}</p>
                        <button className="bg-col-a2 o-70 h-op2 w-50 fc-white" onClick={() => {}}>Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
}