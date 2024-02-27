import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { APP_SETTINGS } from "../../settings/app-settings";
import IHotel from "../../interfaces/hotel"
import { HotelFacilities } from "../../components/cards/facilities-card";
import SplitSlider from "../../components/split-slider";
import IHotelRoom from "../../interfaces/hotel-room";
import RoomCard from "../../components/cards/room-card";
import leftArrow from "../../assets/icon/leftWhite.png"
import rightArrow from "../../assets/icon/rightWhite.png"   
import RoomModal from "../../components/modal/room-modal";
import ReviewSubpage from "./review-subpage";

export default function HotelDetails() {

    const { id } = useParams();
    const [hotel, setHotel] = useState<IHotel>();
    const [rooms, setRooms] = useState<Array<IHotelRoom>>([]);
    const [headerTransform, setHeaderTransform] = useState("translateY(0px)")
    const [headerTextTransform, setHeaderTextTransform] = useState("translateY(0px)")

    const [leftFacility, setLeftFacility] = useState([]);
    const [rightFacility, setRightFacility] = useState([]);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    const [roomMargin, setRoomMargin] = useState(0);
    const [visibleRooms, setVisibleRooms] = useState(3);

    const [selectedRoom, setSelectedRoom] = useState<any>(null);

    const handleScroll = async () => {
        let scrollTop = window.pageYOffset;
        if(scrollTop < 1800) {            
            setHeaderTransform(`translateY(${scrollTop * 0.5}px)`);
            setHeaderTextTransform(`translateY(${scrollTop * 0.35}px)`);
        }
    }

    const nextRoom = async() => {
        if(rooms.length >= visibleRooms) {
            setRoomMargin(roomMargin - 20)
            setVisibleRooms(visibleRooms + 1)
        }
    }

    const prevRoom = async() => {
        if(visibleRooms <= 3) {
            return;
        }
        setRoomMargin(roomMargin + 20)
        setVisibleRooms(visibleRooms - 1)
    }


    useEffect(() => {
        (async () => {
            const response = await fetch(APP_SETTINGS.backend + "/api/get/hotel/from/id", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'id': id})
            });
            const data = await response.json();
            data.imageUrls = JSON.parse(data.imageUrls)
            setHotel(data);

            let facilities = data.facilities.split(",");
            let mid = Math.ceil(facilities.length / 2.0);

            setLeftFacility(facilities.slice(0, mid));
            setRightFacility(facilities.slice(mid, facilities.length));
            
            const response2 = await fetch(APP_SETTINGS.backend + "/api/get/room/from/hotel", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'id': data.ID}),
            });
            const roomData : Array<IHotelRoom> = await response2.json();
            
            setRooms(roomData)

            let min = roomData[0].price;
            let max = roomData[0].price;
            for(let i = 1; i < roomData.length; i++) {
                if(roomData[i].price < min) {
                    min = roomData[i].price;
                }
                else if(roomData[i].price > max) {
                    max = roomData[i].price;
                }
            }
            setMinPrice(min);
            setMaxPrice(max);
        })()

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [id])

    if(hotel == undefined || hotel == null) {
        return <></>
    }

    return (
        <div>
            <div className="w-100 h-screen bg-col-a3 relative overflow-hidden">
                <div className="w-100 h-100 flex-center justify-center absolute z-10">
                    <p className="m-0 font-h font-serif fs-4xl font-medium fc-white"  style={{transform: headerTextTransform}}>{hotel.name}</p>

                    <div className="w-90 h-84p absolute bg-col-white bottom-0 mb-2 shadow-light ">

                    </div>
                </div>
                <img className="w-100 h-100 cover object-top o-70 z--5" src={APP_SETTINGS.backend + "/" + hotel.imageUrl}  style={{transform: headerTransform}} />
            </div>

            <div className="w-screen z-10 flex justify-center bg-col-main">
                <div className="w-35 flex-col flex-start mr-10 mw-80">
                    <div className="w-100 mt-10">
                        <p className="font-serif fs-xl">About Accomodation</p>
                        <p className="fc-a fs-s">{hotel.description}</p>
                    </div>

                    <div className="w-100 mt-5">
                        <p className="font-serif fs-xl">Location</p>
                        <p className="fc-a fs-s">{hotel.address}</p>
                    </div>

                    <div className="w-100 mt-5">
                        <p className="font-serif fs-xl">Rooms</p>
                        <p className="fc-a fs-s">{rooms.length} Types of rooms available, prices range from ${minPrice} - ${maxPrice}</p>
                    </div>

                    <div className="w-100 mt-5 mb-15">
                        <p className="font-serif fs-xl">Facilities</p>
                        <div className="mobile-flex-col justify-between w-85">
                            <div>
                            {
                                leftFacility.map((facility : any) => {
                                    return <HotelFacilities facility={facility} />
                                })
                            }
                            </div>
                            <div>
                            {
                                rightFacility.map((facility : any) => {
                                    return <HotelFacilities facility={facility} />
                                })
                            }
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-40 h-100 relative flex-center justify-center mt-15 no-mobile">
                    <div className="w-s40 h-s90 border-a-transparent flex-center justify-center z-100">
                        <div className="w-90 h-90 bg-col-light">

                        </div>
                    </div>
                </div>
            </div>
            
            <div className="w-screen h-s75 bg-col-a3 overflow-hidden flex-center justify-center">
                <SplitSlider images={hotel.imageUrls} />
            </div>

            <div className="w-screen h-s120 bg-col-white flex-col justify-center flex-center">
                
                <p className="font-serif fs-4xl">Our Rooms</p>
                
                <div className="ml-10 mb-1 flex self-flex-start">
                    {
                        rooms.length < 3 ? <></> : (<>
                            <div className="h-48p bg-col-white w-48p rounded-50 flex-center justify-center o-60 transition-2s hover-bg-col-a2 mr-1">
                                <div className="h-38p bg-col-white w-38p rounded-50 flex-center justify-center" onClick={prevRoom}>
                                    <img src={leftArrow} className="w-40 filter-black" />
                                </div>
                            </div>
                            <div className="h-48p bg-col-white w-48p rounded-50 flex-center justify-center o-60 transition-2s hover-bg-col-a2">
                                <div className="h-38p bg-col-white w-38p rounded-50 flex-center justify-center" onClick={nextRoom}>
                                    <img src={rightArrow} className="w-40 filter-black" />
                                </div>
                            </div>
                        </>)
                    }
                </div>

                <div className="flex-center w-80">
                    <div className="flex transition-2" style={{marginLeft: roomMargin + 'vw'}}>
                    {
                        rooms.map((room, index) => {
                            return <RoomCard room={room} className="w-s30 flex-shrink-0 mr-2 h-s70 mw-100" onClick={() => setSelectedRoom(room)}/>
                        })
                    }
                    </div>
                </div>
            </div>
            
            <div className="w-100 h-s15 bg-col-white"></div>
                
            <ReviewSubpage hotel={hotel}/>        
            
            {
                selectedRoom !== null ? 
                <RoomModal room={selectedRoom} unmount={() => setSelectedRoom(null)} /> : <></>
            }
        </div>
    )
}