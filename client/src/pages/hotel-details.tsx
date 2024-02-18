import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { APP_SETTINGS } from "../settings/app-settings";
import IHotel from "../interfaces/hotel"
import { HotelFacilities } from "../components/cards/facilities-card";
import SplitSlider from "../components/split-slider";
import IHotelRoom from "../interfaces/hotel-room";

export default function HotelDetails() {

    const { id } = useParams();
    const [hotel, setHotel] = useState<IHotel>();
    const [rooms, setRooms] = useState<Array<IHotelRoom>>([]);
    const [headerTransform, setHeaderTransform] = useState("translateY(0px)")

    const [leftFacility, setLeftFacility] = useState([]);
    const [rightFacility, setRightFacility] = useState([]);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    const handleScroll = async () => {
        let scrollTop = window.pageYOffset;
        if(scrollTop < 1800) {            
            setHeaderTransform(`translateY(${scrollTop * 0.5}px)`);
        }
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
                    <p className="m-0 font-h font-serif fs-4xl font-medium fc-white">{hotel.name}</p>

                    <div className="w-90 h-84p absolute bg-col-white bottom-0 mb-2 shadow-light ">

                    </div>
                </div>
                <img className="w-100 h-100 cover object-top o-70 z--5" src={APP_SETTINGS.backend + "/" + hotel.imageUrl}  style={{transform: headerTransform}} />
            </div>

            <div className="w-screen z-10 flex justify-center">
                <div className="w-35 flex-col flex-start mr-10">
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
                {/* fixed top-0 mt-5 */}
                <div className="w-40 h-100 relative flex-center justify-center mt-15">
                    <div className="w-s40 h-s90 border-a-transparent flex-center justify-center z-100">
                        <div className="w-90 h-90 bg-col-light">

                        </div>
                    </div>
                </div>
            </div>
            
            <div className="w-screen h-s75 bg-col-a3 overflow-hidden flex-center justify-center">
                <SplitSlider images={hotel.imageUrls} />
            </div>

            <div className="w-screen h-screen bg-col-white flex-center justify-center mt-10">
                
                <p className="font-serif fs-4xl">Our Rooms</p>
            </div>
        </div>
    )
}