import { useEffect, useState } from "react";
import useUser from "../../contexts/user-context";
import IHotelRoom from "../../interfaces/hotel-room";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/modal.module.css"
import StarRating from "../../util/star-rating";
import ReviewCardSmall from "../cards/review-card-small";

export default function ReviewModal({unmount = () => {}, hotelId, reviews = null, refetch} : any) {

    const [modalShown, setModalShown] = useState(false);
    const [rating, setRating] = useState(0);
    const [user, refreshUser] = useUser();
    const [reviewState, setReviews] = useState(reviews);
    const [errorMessage, setErrorMessage] = useState("")

    const [review, setReview] = useState({
        category: "",
        review: "",
        isAnonymous: false,
    });

    const fetchReview = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/api/get/review/from/hotel", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'id': hotelId})
        });
        const data = await response.json();
        setReviews(data)
    }
 
    useEffect(() => {
        document.body.style.overflowY = "hidden"
        setModalShown(true);

        if(reviews == null) {
            fetchReview()
        }

        return () => {
            document.body.style.overflowY = "auto"
        }   
    }, [])

    const closeModal = async () => {
        setModalShown(false);
        await new Promise(r => setTimeout(r, 600));
        unmount();
    }

    const changeReview = (newData : any) => {
        console.log(newData)
        setReview(prevState => ({...prevState, ...newData}));
    }

    const submit = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/api/add/review/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...review, 
                'hotelId': hotelId, 
                'rating' : rating,
                'userId' : user?.ID,
            })
        });
        const data = await response.json();
        if("error" in data) {
            setErrorMessage(data.error)
            return;
        }
        setErrorMessage("");
        setReview({
            category: "",
            review: "",
            isAnonymous: false,
        })
        fetchReview();
        refetch();
    }

    console.log(reviews);

    return (
        <div className="w-screen h-screen fixed z-100 bg-col-dark2-transparent flex-center justify-center transition-2 top-0 left-0" style={{opacity: modalShown ? '100%' : '0%', backdropFilter: modalShown ? 'blur(10px)' : '' }} onClick={closeModal}>
            <div className={`bg-col-main shadow-light transition-3 flex-center justify-center mobile-flex-col overflow-auto ${styles.modal}`} style={ modalShown ? {marginTop:'0vw', opacity: '100%'} : {marginTop:'60vw', opacity: '0%'}}  onClick={(e) => e.stopPropagation()}>
                <div className={`w-50 h-100 mr-5 mw-80 transition overflow-auto scroll-simple`}>
                    {
                        reviewState != null ? (
                            reviewState.map((review : any, i : number) => {
                                return <ReviewCardSmall review={review} key={i}/>
                            })
                        ) : <></>
                    }
                </div>
                <div className="w-35 h-80 flex-col mw-80">
                    
                    <label className="font-p fc-gray fs-2xs text-left w-90" htmlFor="category">Category</label>
                    <select 
                        className={`${styles.inputInverse} w-90`} id="city" 
                        onChange={(e) => changeReview({"category" : e.target.value})}
                        defaultValue={"Default"}
                        name="category"
                    >
                        <option value={'Default'} disabled>Category</option>
                        <option value={'Cleanliness'} >Cleanliness</option>
                        <option value={'Comfort'} >Comfort</option>
                        <option value={'Location'} >Location</option>
                        <option value={'Service'} >Service</option>
                    </select>

                    <label className="font-p fc-gray fs-2xs text-left w-90 mt-2" htmlFor="category">Rating</label>
                    <div>
                        <StarRating rating={rating} setRating={setRating}/>
                    </div>

                    <label className="font-p fc-gray fs-2xs text-left w-90 mt-2" htmlFor="review">Review</label>
                    <textarea
                        name="review" value={review.review}
                        onChange={(e) => changeReview({"review" : e.target.value})} 
                        className={`${styles.inputInverseTall} w-90 mb-1`} placeholder="Write your review" id="review"
                    />
                        
                    <div className="flex-center mt-2">
                        <input 
                            type="checkbox" id="agree" 
                            checked={review.isAnonymous} onChange={(e) => changeReview({isAnonymous: e.target.checked})}
                        />
                        <label className="font-p fs-2xs fc-gray text-left w-80 ml-1" htmlFor="agree">Write review as anonymous</label>
                    </div>
                    
                    <p className="mb-0 fc-red fs-xs">{errorMessage}</p>
                    
                    <button className="bg-col-a2 o-70 h-op2 w-90 fc-white mt-2" onClick={submit}>Submit Review</button>
                </div>
            </div>
        </div>
    )
}