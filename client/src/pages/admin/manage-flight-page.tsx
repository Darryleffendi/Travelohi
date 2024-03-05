import { useEffect, useState } from "react";
import Flight from "../../interfaces/flight";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/admin.module.css"

export default function ManageFlightPage({toggleLoading, setSuccess} : any) {

    const [planes, setPlanes] = useState<any>([])
    const [cities, setCities] = useState([])
    const [showPlaneDropdown, setShowPlaneDropdown] = useState(false);

    const defaultData = {
        arrivalCityId: 0,
        arrivalTime: new Date(),
        departureCityId: 0,
        departureTime: new Date(),
        price: 0,
        planeCode: '',
    }
    const [data, setData] = useState<Flight>(defaultData)

    useEffect(() => {

        (async () => {
            const response = await fetch(APP_SETTINGS.backend + "/api/get/plane", {
                method: 'GET',
            });
            const data = await response.json();
            setPlanes(data);

            const response2 = await fetch(APP_SETTINGS.backend + "/api/get/city", {
                method: 'GET',
            });
            const data2 = await response2.json();
            setCities(data2);
        })()
    }, [])

    const handleChange = (e : any) => {
        const { name, value } = e.target;

        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const changePlane = (id : number, code : string) => {
        setData(prevData => ({
         ...prevData,
            planeId: id,
            planeCode: code
        }))
    }
    
    const submitForm = async () => {
        toggleLoading(true);
        const response = await fetch(APP_SETTINGS.backend + "/admin/addflight", {
            method: 'POST',
            body: JSON.stringify(data),
            headers : {'Content-Type' : 'application/json'}
        });
        await response.json();
        toggleLoading(false);
        setSuccess("Successfully Created Flight");
        setData(defaultData)
    }

    return (
        <div className="w-90 mobile-flex-col">
            <div className="flex-col w-100 gap-10 mt-5 ml-5">
                <div className={`w-100 rounded bg-col-light flex-col flex-center justify-center`}>
                <p className="font-medium font-main fc-a w-80">Departure</p>
                    <label className="font-p fc-gray fs-2xs text-left w-80" htmlFor="departureTime">Time</label>
                    <input type={"datetime-local"} name="departureTime" value={data.departureTime.toString()} onChange={handleChange} className={`${styles.inputInverse} w-80 mb-1`} placeholder="DepartureTime" id="departureTime"/>

                    <label className="font-p fc-gray fs-2xs text-left w-80" htmlFor="city">City</label>
                    <select 
                        className={`${styles.inputInverse} w-80 mb-5`} id="city" 
                        onChange={handleChange}
                        defaultValue={"Default"}
                        name="departureCityId"
                    >
                        <option disabled={true} value={'Default'}>
                            City
                        </option>
                        {
                            cities.map((city : any, index) => {
                                return (city.airportCode) === "" ? <></> : <option key={index} value={city.ID}>{city.name} - {city.airportCode}</option>
                            })
                        }
                    </select>
                </div>

                <div className={`w-100 rounded bg-col-light flex-col flex-center justify-center mt-5`}>
                    <p className="font-medium font-main fc-a w-80">Arrival</p>
                        <label className="font-p fc-gray fs-2xs text-left w-80" htmlFor="arrivalTime">Time</label>
                        <input type={"datetime-local"} name="arrivalTime" value={data.arrivalTime.toString()} onChange={handleChange} className={`${styles.inputInverse} w-80 mb-1`} placeholder="arrivalTime" id="arrivalTime"/>

                        <label className="font-p fc-gray fs-2xs text-left w-80" htmlFor="city">City</label>
                        <select 
                            className={`${styles.inputInverse} w-80 mb-5`} id="city" 
                            onChange={handleChange}
                            defaultValue={"Default"}
                            name="arrivalCityId"
                        >
                            <option disabled={true} value={'Default'}>
                                City
                            </option>
                            {
                                cities.map((city : any, index) => {
                                    return (city.airportCode) === "" ? <></> : <option key={index} value={city.ID}>{city.name} - {city.airportCode}</option>
                                })
                            }
                        </select>
                    </div>
                </div>

            <div className="flex-col w-100 gap-10 mt-5 ml-5">
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="plane">Plane</label>
                <div className={`${styles.input} flex-center`} onClick={() => setShowPlaneDropdown(!showPlaneDropdown)}>
                    {
                        data.planeCode === '' ? 'Plane' : data.planeCode
                    }
                </div>
                {
                    !showPlaneDropdown ? <></> : (
                        <div className="w-100 h-s40 overflow-auto flex-col shadow bg-col-white rounded scroll-simple">
                            {
                                planes.map((plane : any, index : number) => {
                                    return (
                                        <div className="flex-col w-100 hover-bg-col-dark transition" onClick={() => changePlane(plane.ID, plane.planeCode)}>
                                            <div className="flex-center" onClick={() => setShowPlaneDropdown(!showPlaneDropdown)}>
                                                <img className="h-18p ml-1" src={plane.airline.imageUrl}/>
                                                <p className="ml-1 font-p fc-a fs-xs">{plane.planeModel.manufacturer} {plane.planeModel.name} - {plane.planeCode}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ) 
                }

                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="price">Price</label>
                <input name="price" value={data.price} onChange={handleChange} className={`${styles.input}`} placeholder="Price" id="price"/>
                
                <button className="bg-col-a2 fc-white o-70 h-op2 w-100 mt-2" onClick={submitForm}>Save Changes</button>
                <p className="font-p fc-a fs-3xs text-left w-100 mb-5">*Adding new data to database</p>
            </div>
        </div>
    )
}