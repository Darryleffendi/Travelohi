import { useEffect, useState } from "react";
import useUser from "../../contexts/user-context";
import IHotelRoom from "../../interfaces/hotel-room";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/modal.module.css"
import StarRating from "../../util/star-rating";
import ReviewCardSmall from "../cards/review-card-small";

export default function ReviewViewModal({unmount = () => {}, hotelId, reviews = null} : any) {

    const [modalShown, setModalShown] = useState(false);
    const [reviewState, setReviews] = useState(reviews);
    
    const [category, setCategory] = useState("");
    const [rating, setRating] = useState(0);
    
    const [filteredReviews, setFilteredReviews] = useState<any>([]);
    
    useEffect(() => {
        setModalShown(true);
        document.body.style.overflowY = "hidden"

        if(reviews == null) {
            (async () => {
                const response = await fetch(APP_SETTINGS.backend + "/api/get/review/from/hotel", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({'id': hotelId})
                });
                const data = await response.json();
                setReviews(data)
            })()
        }

        return () => {
            document.body.style.overflowY = "auto"
        }   
    }, [])

    useEffect(() => {
        if((category === "" || category === "Default") && rating == 0) {
            setFilteredReviews([])
        }
        else {
            let arr = []

            if(category !== "" && category !== "Default") {
                for(let i = 0; i < reviewState.length; i ++) {
                    if(reviewState[i].reviewType === category) {
                        arr.push(reviewState[i])
                    }
                }
            }
            else {
                arr = [...reviewState]
            }

            let arr2 = []

            if(rating != 0) {
                for(let i = 0; i < arr.length; i ++) {
                    if(arr[i].rating === rating) {
                        arr2.push(arr[i])
                    }
                }
            }
            else {
                arr2 = [...arr]
            }

            setFilteredReviews(arr2)
        }
    }, [category, rating])

    const closeModal = async () => {
        setModalShown(false);
        await new Promise(r => setTimeout(r, 600));
        unmount();
    }

    return (
        <div className="w-screen h-screen fixed z-100 bg-col-dark2-transparent flex-center justify-center transition-2 top-0" style={{opacity: modalShown ? '100%' : '0%', backdropFilter: modalShown ? 'blur(10px)' : '' }} onClick={closeModal}>
            <div className={`bg-col-main shadow-light transition-3 flex-center justify-center mobile-flex-col overflow-auto ${styles.modal}`} style={ modalShown ? {marginTop:'0vw', opacity: '100%'} : {marginTop:'60vw', opacity: '0%'}}  onClick={(e) => e.stopPropagation()}>
                <div className="w-30 h-80 flex-col gap-10">
                    
                    <p className="fs-l font-serif o-70">Filters</p>

                    <div>
                        <label className="font-p fc-gray fs-2xs text-left w-80 mt-2" htmlFor="category">Rating</label>
                        <div>
                            <StarRating rating={rating} setRating={setRating}/>
                        </div>
                    </div>

                    <div className="flex-col w-80">
                        <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="category">Category</label>
                        <select 
                            className={`${styles.inputInverse} w-100`} id="city" 
                            onChange={(e) => setCategory(e.target.value)}
                            defaultValue={"Default"}
                            name="category"
                        >
                            <option value={'Default'}>Category</option>
                            <option value={'Cleanliness'} >Cleanliness</option>
                            <option value={'Comfort'} >Comfort</option>
                            <option value={'Location'} >Location</option>
                            <option value={'Service'} >Service</option>
                        </select>
                    </div>
                </div>
                <div className={`w-60 h-80 mw-80 transition overflow-auto scroll-simple`}>
                    {
                        ((category === "" || category === "Default") && rating == 0) ? (
                            reviewState.map((review : any, i : number) => {
                                return <ReviewCardSmall review={review} key={i}/>
                            })
                        ) : (
                            filteredReviews.map((review : any, i : number) => {
                                return <ReviewCardSmall review={review} key={i}/>
                            })
                        ) 
                    }
                </div>
            </div>
        </div>
    )
}