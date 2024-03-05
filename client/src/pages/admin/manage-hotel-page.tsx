
import { useEffect, useState } from "react"
import PromoCard from "../../components/cards/promo-card";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/admin.module.css"
import add from "../../assets/icon/plus.png"
import trash from "../../assets/icon/trash.png"
import IHotel from "../../interfaces/hotel";
import RoomAdminCard from "../../components/cards/room-admin-card";
import IHotelRoom from "../../interfaces/hotel-room";

export default function ManageHotelPage({toggleLoading, setSuccess} : any) {

    const defaultData = {
        name : '',
        address : '',
        description : '',
        city: '',
        facilities: [],
        frontImage: null,
        images: [],
    }

    const [data, setData] = useState<IHotel>(defaultData);

    const [roomData, setRoomData] = useState<Array<IHotelRoom>>([]);

    const [countries, setCountries] = useState<Array<any>>([]);
    const [cities, setCities] = useState<Array<any>>([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {

        (async () => {
            const response = await fetch(APP_SETTINGS.backend + "/api/get/country", {
                method: 'GET',
            });
            const data = await response.json();
            setCountries(data);
        })()
    }, [])

    /* ======= Image Functions ======== */

    const changeHotelImgs = (event : any) => {
        setData(prevData => ({
            ...prevData,
            images: [...event.target.files]
        }));
    };

    const changeRoomImages = (event : any, index : number) => {

        let newRoomsData = [...roomData];
        newRoomsData[index] = {...newRoomsData[index], images: [...event.target.files]}

        setRoomData(newRoomsData);
    };

    const ChangeHotelFrontImg = (event : any) => {
        setData(prevData => ({
            ...prevData,
            frontImage: event.target.files[0]
        }));
    }

    /* ========== Input Event Handler =========== */

    const handleChange = (e : any) => {
        const { name, value } = e.target;
        
        if(name === 'country') {
            (async () => {
                const response = await fetch(APP_SETTINGS.backend + "/api/get/city/from/countryname", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({'countryName': value})
                });
                const data = await response.json();
                setCities(data);
            })()
        }

        setData(prevData => ({
            ...prevData,
            [name]: value
        }));

    }

    const handleRoomChange = (e : any, index : number) => {
        const { name, value } = e.target;

        let newRoomsData = [...roomData];
        newRoomsData[index] = {...newRoomsData[index], [name]: value}

        setRoomData(newRoomsData);
    }

    /* ======= Facility Functions ======== */

    const handleFacilityChange = (e : any) => {
        const { name, checked } = e.target;
    
        setData(prevData => {
            const updatedFacilities = [...prevData.facilities];
    
            if (checked) {
                if (!updatedFacilities.includes(name)) {
                    updatedFacilities.push(name);
                }
            } else {
                const index = updatedFacilities.indexOf(name);
                if (index > -1) {
                    updatedFacilities.splice(index, 1);
                }
            }
    
            return {
                ...prevData,
                facilities: updatedFacilities
            };
        });

        console.log(data)
    };

    const handleRoomFacilityChange = (e : any, index : number) => {
        const { name, checked } = e.target;
        

        const updatedFacilities = [...roomData[index].facilities];

        if (checked) {
            if (!updatedFacilities.includes(name)) {
                updatedFacilities.push(name);
            }
        } else {
            const index = updatedFacilities.indexOf(name);
            if (index > -1) {
                updatedFacilities.splice(index, 1);
            }
        }

        let newRoomsData = [...roomData];
        newRoomsData[index] = {...newRoomsData[index], "facilities": updatedFacilities}
        setRoomData(newRoomsData)

        console.log(roomData)
    };

    /* ======= Form Submission ======== */

    const submitForm = async (event : any) => {
        toggleLoading(true);
        const formData = new FormData();

        /* Append Images */
        if (data.frontImage) {
            formData.append('frontImage', data.frontImage);
        }
        if (data.images) {
            data.images.forEach((image, index) => {
                formData.append(`images`, image);
            });
        }

        /* Pop Images from Data */
        delete data.images;
        delete data.frontImage;

        /* Append Data */
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        /* Send Create Hotel Request */
        const response = await fetch(APP_SETTINGS.backend + "/admin/addhotel", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if("error" in result) {
            setErrorMessage(result.error)
            toggleLoading(false);
            return;
        }
        else {
            setErrorMessage("")
        }

        /* ======= Create Room Request ======= */

        roomData.forEach(async (room, index) => {

            const roomFormData = new FormData();

            if(room.images) {
                room.images.forEach((image, idx) => {
                    roomFormData.append(`images`, image);
                    delete roomData[index].images;
                });
            }

            Object.keys(room).forEach(key => {
                roomFormData.append(key, room[key]);
            });

            roomFormData.set("hotelId", result.id);
            roomFormData.set("path", result.path);

            const response = await fetch(APP_SETTINGS.backend + "/admin/addroom", {
                method: 'POST',
                body: roomFormData
            });
        });

        toggleLoading(false);
        setData(defaultData)
        setRoomData([])
        setSuccess("Successfully Added Hotel!");
    }

    /* ======= Room Create/Delete ======== */

    const addRoom = () => {
        setRoomData(prevData => ([
            ...prevData, {
                index: prevData.length,
                name: "",
                price: 0,
                bedType: "",
                facilities: [],
                images: [],
                guests : 0,
            }]
        ));
    }

    const removeRoom = () => {
        setRoomData(prevData => prevData.filter((room, index) => index !== prevData.length - 1));
    }

    return (
        <div className="w-90 mobile-flex-col">
            <div className="flex-col w-100 gap-10 mt-5 ml-5">
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="name">Name</label>
                <input name="name" value={data.name} onChange={handleChange} className={`${styles.input}`} placeholder="Name" id="name"/>
                
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="description">Description</label>
                <input name="description" value={data.description} onChange={handleChange} className={`${styles.input}`} placeholder="Description" id="description"/>
                
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="promocode">Address</label>
                <input name="address" value={data.address} onChange={handleChange} className={`${styles.input}`} placeholder="Address" id="address"/>

                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="country">Country</label>
                <select 
                    className={styles.input} id="country" 
                    onChange={handleChange}
                    defaultValue={"Default"}
                    name="country"
                >
                    <option disabled={true} value={'Default'}>
                        Country
                    </option>
                    {
                        countries.map((country, index) => {
                            return <option key={index} value={country.name}>{country.name}</option>
                        })
                    }
                </select>

                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="city">City</label>
                <select 
                    className={styles.input} id="city" 
                    onChange={handleChange}
                    defaultValue={"Default"}
                    name="city"
                >
                    <option disabled={true} value={'Default'}>
                        City
                    </option>
                    {
                        cities.map((city, index) => {
                            return <option key={index} value={city.name}>{city.name}</option>
                        })
                    }
                </select>
                
                <p className="mt-5 font-medium font-main fc-a">Hotel Rooms</p>

                {
                    roomData.length > 0 ? (
                        roomData.map((room : any, index : number) => {
                            return (
                                <RoomAdminCard data={roomData[index]} handleChange={handleRoomChange} changeImages={changeRoomImages} changeFacilities={handleRoomFacilityChange} />
                            )
                        })
                    ) : <></>
                }

                <button className="bg-col-light o-80 w-100 flex-center justify-center hover-blue" onClick={addRoom}>
                    <img src={add} className="h-24p filter-black o-60"/>
                </button>
                <button className="bg-col-red o-80 w-100 flex-center justify-center hover-blue" onClick={removeRoom}>
                    <img src={trash} className="h-24p filter-black o-60"/>
                </button>


                <div className="w-100 h-s40"></div>
            </div>

            <div className="w-100 flex-col gap-10">
                <div className={`w-100 rounded bg-col-light mt-5 ml-5 flex-col flex justify-center`}>
                    <p className="ml-2 mt-5 font-medium font-main fc-a">Hotel Facilities</p>
                    
                    <div className="w-100 mobile-flex-col mb-5">
                        <div className="ml-2 flex-col w-50 gap-5">
                            <div className="flex-center">
                                <input type="checkbox" onChange={handleFacilityChange} name="swimmingpool" id="swimmingpool" />
                                <label htmlFor="swimmingpool" className="ml-1 fs-2xs font-p fc-a text-narrow">Swimming Pool</label>
                            </div>

                            <div className="flex-center">
                                <input type="checkbox" onChange={handleFacilityChange} name="ac" id="ac" />
                                <label htmlFor="ac" className="ml-1 fs-2xs font-p fc-a text-narrow">Air Conditioned</label>
                            </div>

                            <div className="flex-center">
                                <input type="checkbox" onChange={handleFacilityChange} name="elevator" id="elevator" />
                                <label htmlFor="elevator" className="ml-1 fs-2xs font-p fc-a text-narrow">Elevator</label>
                            </div>

                            <div className="flex-center">
                                <input type="checkbox" onChange={handleFacilityChange} name="h24" id="h24" />
                                <label htmlFor="h24" className="ml-1 fs-2xs font-p fc-a text-narrow">24 Hour Service</label>
                            </div>
                        </div>
                        <div className="ml-2 flex-col w-50 gap-5">
                            <div className="flex-center">
                                <input type="checkbox" onChange={handleFacilityChange} name="park" id="park" />
                                <label htmlFor="park" className="ml-1 fs-2xs font-p fc-a text-narrow">Parking</label>
                            </div>

                            <div className="flex-center">
                                <input type="checkbox" onChange={handleFacilityChange} name="wifi" id="wifi" />
                                <label htmlFor="wifi" className="ml-1 fs-2xs font-p fc-a text-narrow">Wifi</label>
                            </div>

                            <div className="flex-center">
                                <input type="checkbox" onChange={handleFacilityChange} name="restaurant" id="restaurant" />
                                <label htmlFor="restaurant" className="ml-1 fs-2xs font-p fc-a text-narrow">Restaurant</label>
                            </div>
                        </div>
                    </div>
                </div> 

                <div className={`w-100 rounded bg-col-light mt-5 ml-5 flex-col flex-center justify-center`}>
                    <p className="font-p fc-a fs-2xs text-left w-80 font-narrow m-0 mt-2">Hotel Images (Multiple)</p>
                    <div className="border-a-transparent w-80 rounded p-5p flex-center justify-between mb-2">
                        <input type="file" multiple onChange={changeHotelImgs} />
                    </div>
                    <div className="flex gap-5 w-80 wrap mb-2">
                        {
                            data.images ?
                                data.images.map((hotelImage => <img src={URL.createObjectURL(hotelImage)} className="w-30"/>))
                            : <></>
                        }
                    </div>

                </div>

                <div className={`w-100 rounded bg-col-light mt-5 ml-5 flex-col flex-center justify-center`}>
                    <p className="font-p fc-a fs-2xs text-left w-80 font-narrow m-0 mt-5">Front Image</p>
                    <div className="border-a-transparent w-80 rounded p-5p flex-center justify-between mb-2">
                        <input type="file" className={styles.fileInput} accept="image/*" onChange={ChangeHotelFrontImg}/>
                    </div>
                    {
                        data.frontImage == null ? <></> : (
                            <img src={URL.createObjectURL(data.frontImage)} className="w-80"/>
                        )  
                    }
                    <p className="font-p fs-2xs fc-red mb-1" id="error_login">{errorMessage}</p>
                    <button className="bg-col-a2 fc-white o-70 h-op2 w-80 mt-2" onClick={submitForm}>Save Changes</button>
                    <p className="font-p fc-a fs-3xs text-left w-80 mb-5">*Adding new data to database</p>
                </div>
                
                
                <div className="w-100 h-s40"></div>
            </div>

        </div>
    )
}