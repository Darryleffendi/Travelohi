import IHotelRoom from "../../interfaces/hotel-room"
import styles from "../../styles/admin.module.css"

export default function RoomAdminCard({data, handleChange, changeImages, changeFacilities} : IRoomParams) {

    return (
        <div className={`w-100 rounded bg-col-light mt-5 flex-col flex-center justify-center`}>
            <p className="mt-5 font-medium font-main fc-a w-80">Room {data.index + 1}</p>

            <label className="font-p fc-gray fs-2xs text-left w-80" htmlFor="name">Name</label>
            <input name="name" value={data.name} onChange={(e) => handleChange(e, data.index)} className={`${styles.inputInverse} w-80 mb-1`} placeholder="Name" id="name"/>
            
            <label className="font-p fc-gray fs-2xs text-left w-80" htmlFor="price">Price</label>
            <input name="price" value={data.price} onChange={(e) => handleChange(e, data.index)} className={`${styles.inputInverse} w-80 mb-1`} placeholder="Price" id="price"/>
            
            <label className="font-p fc-gray fs-2xs text-left w-80" htmlFor="bedType">Bed Type</label>
            <input name="bedType" value={data.bedType} onChange={(e) => handleChange(e, data.index)} className={`${styles.inputInverse} w-80 mb-1`} placeholder="Bed Type" id="bedType"/>

            <div className="w-100 mobile-flex-col mb-5 mt-1">
                <div className="ml-2 flex-col w-50 gap-5">
                    <div className="flex-center">
                        <input type="checkbox" onChange={(e) => changeFacilities(e, data.index)} name="swimmingpool" id="swimmingpool" />
                        <label htmlFor="swimmingpool" className="ml-1 fs-2xs font-p fc-a text-narrow">Private Pool</label>
                    </div>

                    <div className="flex-center">
                        <input type="checkbox" onChange={(e) => changeFacilities(e, data.index)} name="elevator" id="elevator" />
                        <label htmlFor="elevator" className="ml-1 fs-2xs font-p fc-a text-narrow">Free Breakfast</label>
                    </div>

                    <div className="flex-center">
                        <input type="checkbox" onChange={(e) => changeFacilities(e, data.index)} name="h24" id="h24" />
                        <label htmlFor="h24" className="ml-1 fs-2xs font-p fc-a text-narrow">Free Wifi</label>
                    </div>
                </div>
                <div className="ml-2 flex-col w-50 gap-5">
                    <div className="flex-center">
                        <input type="checkbox" onChange={(e) => changeFacilities(e, data.index)} name="park" id="park" />
                        <label htmlFor="park" className="ml-1 fs-2xs font-p fc-a text-narrow">Balcony</label>
                    </div>

                    <div className="flex-center">
                        <input type="checkbox" onChange={(e) => changeFacilities(e, data.index)} name="wifi" id="wifi" />
                        <label htmlFor="wifi" className="ml-1 fs-2xs font-p fc-a text-narrow">Bathtub</label>
                    </div>

                    <div className="flex-center">
                        <input type="checkbox" onChange={(e) => changeFacilities(e, data.index)} name="ac" id="ac" />
                        <label htmlFor="ac" className="ml-1 fs-2xs font-p fc-a text-narrow">Air Conditioned</label>
                    </div>

                </div>
            </div>

            <p className="font-p fc-a fs-2xs text-left w-80 font-narrow m-0">Room Images (Multiple)</p>
            <div className="border-a-transparent w-80 rounded p-5p flex-center justify-between mb-2">
                <input type="file" multiple onChange={(e) => changeImages(e, data.index)} />
            </div>
            <div className="flex gap-5 w-80 wrap mb-5">
                {
                    data.images ? (
                        data.images.map((hotelImage => <img src={URL.createObjectURL(hotelImage)} className="w-30"/>))
                    ) : <></>
                }
            </div>

        </div>
    )
}

interface IRoomParams {
    data : IHotelRoom
    handleChange : (event : any, index : number) => void
    changeImages : (event : any, index : number) => void
    changeFacilities : (event : any, index : number) => void
}