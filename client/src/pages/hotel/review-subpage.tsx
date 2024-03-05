import { useEffect, useState } from "react";
import ReviewCard from "../../components/cards/review-card";
import ReviewModal from "../../components/modal/review-modal";
import ReviewViewModal from "../../components/modal/review-view-modal";
import { APP_SETTINGS } from "../../settings/app-settings";
import StarRating from "../../util/star-rating";


export default function ReviewSubpage({hotel} : any) {
    
    const [openReview, setOpenReview] = useState<boolean>(false);
    const [reviews, setReviews] = useState([]);
    const [reviewIndex, setReviewIndex] = useState(0)
    const [opacity, setOpacity] = useState(0);

    const changeReviewSlide = (increment : number) => {
        if(reviewIndex + increment >= reviews.length) {
            setReviewIndex(0)
        }
        else if(reviewIndex + increment < 0) {
            setReviewIndex(reviews.length - 1)
        }
        else {
            setReviewIndex(reviewIndex + increment)
        }
    }

    const fetchReview = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/api/get/review/from/hotel", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'id': hotel.ID})
        });
        const data = await response.json();
        setReviews(data);
    }

    useEffect(() => {
        if(hotel !== undefined) {
            fetchReview();
        }
    }, [hotel])


    if(hotel === undefined) return <></>

    return (
        <>
        <div className="w-100 h-s15 bg-col-main"></div>
        <div className="w-100 h-s25 bg-col-main flex justify-center">
            <div className="w-90">
                <p className="fs-2xl font-serif font-medium relative m-0 w-25"
                    onMouseEnter={() => setOpacity(100)} onMouseLeave={() => setOpacity(0)}>Reviews</p>
                <div className="flex gap-10 justify-between flex-center">
                    <div 
                        className="h-40p w-s15 rounded flex-center gap-s pointer"
                        onMouseEnter={() => setOpacity(100)} onMouseLeave={() => setOpacity(0)}
                    >
                        <p className="fs-xs o-60">
                            Rating
                        </p>
                        <div className="h-100 flex-center">
                            <StarRating rating={hotel.rating}/>
                        </div>
                    </div>

                    <div className={`w-s15 bg-col-white shadow-light rounded absolute flex-col flex-center mt-40p pointer-events-none transition o-${opacity}`}>
                        <div className="h-40p w-100 rounded flex-center justify-around pointer">
                            <p className="fs-xs o-60">
                                Cleanliness
                            </p>
                            <div className="h-100 flex-center">
                                <StarRating rating={hotel.cleanlinessRating}/>
                            </div>

                        </div>
                        <div className="h-40p w-100 rounded flex-center justify-around pointer">
                        <p className="fs-xs o-60">
                                Comfort
                            </p>
                            <div className="h-100 flex-center">
                                <StarRating rating={hotel.comfortRating}/>
                            </div>

                        </div>
                        <div className="h-40p w-100 rounded flex-center justify-around pointer">
                            <p className="fs-xs o-60">
                                Location
                            </p>
                            <div className="h-100 flex-center">
                                <StarRating rating={hotel.locationRating}/>
                            </div>

                        </div>
                        <div className="h-40p w-100 rounded flex-center justify-around pointer ">
                            <p className="fs-xs o-60">
                                Service
                            </p>
                            <div className="h-100 flex-center">
                                <StarRating rating={hotel.serviceRating}/>
                            </div>

                        </div>
                    </div>

                    <p className="font-serif o-60 fc-a h-op3 pointer" onClick={() => setOpenReview(true)}>View all reviews</p>
                </div>
            </div>
        </div>

        {
            reviews.length > 0 ? <ReviewCard review={reviews[reviewIndex]} next={() => changeReviewSlide(1)} prev={() => changeReviewSlide(-1)}/> : (
                <div className="w-screen h-s30 flex-center justify-center bg-col-main">
                    <p className="font-serif fs-xl o-40 font-medium">No Reviews Available</p>
                </div>
            )
        }
         
        
        {
            openReview ? 
            <ReviewViewModal unmount={() => setOpenReview(false)} reviews={reviews} hotelId={hotel.ID} refetch={fetchReview}/> : <></>
        }
        </>  
    )
}