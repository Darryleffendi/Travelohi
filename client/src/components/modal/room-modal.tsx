import { useEffect, useState } from "react";
import useNavigator from "../../contexts/navigator-context";
import useUser from "../../contexts/user-context";
import IHotelRoom from "../../interfaces/hotel-room";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/modal.module.css"
import { HotelFacilities } from "../cards/facilities-card";
import check from '../../assets/icon/checkmark.png'

export default function RoomModal({room, unmount = () => {}} : any) {

    const images = JSON.parse(room.imageUrls)
    
    const [modalShown, setModalShown] = useState(false);
    const [activeImage, setActiveImage] = useState(images[0]);
    const [imageOpacity, setImageOpacity] = useState(100);

    const [leftFacility, setLeftFacility] = useState([]);
    const [rightFacility, setRightFacility] = useState([]);

    const [user, refreshUser] = useUser();
    const navigate = useNavigator();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const [showSuccess, setShowSuccess] = useState(false);
    const [availableRooms, setAvailableRooms] = useState(-1);

    const [btnHovered, setBtnHovered] = useState(false);

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

    useEffect(() => {

        (async () => {
            if(startDate == "" || endDate == "") {
                return;
            }
    
            const response = await fetch(APP_SETTINGS.backend + "/api/get/room/availability", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: room.ID,
                    startDate: startDate,
                    endDate: endDate
                })
            });
            const data = await response.json();
            setAvailableRooms(data)

        })()

    }, [startDate, endDate])

    const closeModal = async () => {
        setModalShown(false);
        await new Promise(r => setTimeout(r, 600));
        unmount();
    }

    const handleSubmit = async () => {
        if(availableRooms <= 0) {
            return;
        }

        if(user != null && "notAuthenticated" in user) {
            navigate("/login")
            return;
        }

        const response = await fetch(APP_SETTINGS.backend + "/api/add/room/cart", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomId: room.ID,
                startDate: startDate,
                endDate: endDate,
                userId: user?.ID
            })
        });
        const data = await response.json();
        if("error" in data) {
            setErrorMessage(data.error)
            return;
        }
        setShowSuccess(true);
        setErrorMessage("")
        setStartDate("")
        setEndDate("")
        await new Promise(r => setTimeout(r, 2000));
        setShowSuccess(false);
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
                    
                    <div className="mt-2 flex-center justify-between w-90">
                        <div className="flex-col w-45">
                            <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="startDate">Check In</label>
                            <input type={"date"} name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`${styles.inputInverse} w-100 mb-1`} placeholder="startDate" id="startDate"/>
                        </div>

                        <div className="flex-col w-45">
                            <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="endDate">Check Out</label>
                            <input type={"date"} name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`${styles.inputInverse} w-100 mb-1`} placeholder="endDate" id="endDate"/>
                        </div>
                    </div>

                    <label className="font-p fc-gray fs-2xs text-left w-90" htmlFor="arrivalTime">Guests</label>
                    <input type={"number"} name="arrivalTime" className={`${styles.inputInverse} w-90 mb-1`} placeholder="Number of Guests" id="arrivalTime"/>
                    
                    <p className="m-0 fc-a2">{ availableRooms >= 0 ? `${availableRooms} rooms available` : ''}</p>
                    <p className="mb-0 fc-red fs-xs">{errorMessage}</p>
                    <div className="flex-center w-95 justify-between mt-2">
                        <p className="fs-2xl m-0 fc-a2 font-serif">${startDate == "" || endDate == "" ? room.price : room.price * dateDifference(startDate, endDate)}</p>
                        <div 
                            className="w-50 relative"
                            onMouseEnter={() => setBtnHovered(true)} onMouseLeave={() => setBtnHovered(false)}
                        >
                            <button className="bg-col-a2 o-70 h-op2 w-100 fc-white" onClick={handleSubmit}>Add to cart</button>
                            
                            <div className={`absolute flex-center transition-3 pointer ${btnHovered ? "mt-1 o-100" : "mt--2 o-0"}`}>
                                <p className="m-0 font-serif fs-xs o-50">Or click here to&nbsp;</p>
                                <p className="m-0 font-serif fs-xs fc-a2"> buy now</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div 
                className="fixed w-100 h-64p bg-col-white z-100 flex-center transition self-flex-end bottom-0" style={{'marginBottom' : showSuccess ? '0px' : '-64px'}}
            >
                <img src={check} className="ml-5 h-50"/>
                <h3 className="font-main fc-green ml-1">Successfully Added to Cart</h3>
            </div>
        </div>
    )
}


function dateDifference(date1 : any, date2 : any) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const startDate : any = new Date(date1);
    const endDate : any = new Date(date2);
    return Math.round((endDate - startDate) / millisecondsPerDay);
}