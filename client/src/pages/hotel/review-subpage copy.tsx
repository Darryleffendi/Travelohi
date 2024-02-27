import { useEffect, useState } from "react";
import ReviewCard from "../../components/cards/review-card";
import ReviewModal from "../../components/modal/review-modal";
import { APP_SETTINGS } from "../../settings/app-settings";
import StarRating from "../../util/star-rating";


export default function ReviewSubpage({hotel} : any) {
    
    const [openReview, setOpenReview] = useState<boolean>(false);
    const [reviews, setReviews] = useState([]);
    const [reviewIndex, setReviewIndex] = useState(0)
    const [overallRating, setOverallRating] = useState(0);
    const [opacity, setOpacity] = useState(0);

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
            
            let count = 0;

            if(hotel.cleanlinessRating > 0) count ++;
            if(hotel.comfortRating > 0) count ++;
            if(hotel.locationRating > 0) count ++;
            if(hotel.serviceRating > 0) count ++;

            if(count != 0) {
                setOverallRating((hotel.cleanlinessRating + hotel.comfortRating + hotel.locationRating + hotel.serviceRating) / count);
            }
        }
    }, [hotel])


    if(hotel === undefined) return <></>

    return (
        <>
        <div className="w-100 h-s10 bg-col-main"></div>
        <div className="w-100 h-s40 bg-col-main flex justify-center">
            <div className="w-90">
                <p className="fs-2xl font-serif font-medium relative">Reviews</p>
                <div className="flex gap-10">
                    <div 
                        className="bg-col-white h-40p w-s15 rounded flex-center justify-around shadow-light pointer"
                        onMouseEnter={() => setOpacity(100)} onMouseLeave={() => setOpacity(0)}
                    >
                        <p className="fs-xs o-60">
                            Rating
                        </p>
                        <div className="h-100 flex-center">
                            <StarRating rating={overallRating}/>
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
                    
                    <div 
                        className="bg-col-a2 h-40p w-15 rounded flex-center justify-around shadow-light pointer o-60 h-op2"
                        onClick={() => setOpenReview(true)}
                    >
                        <p className="fs-xs fc-white font-medium">
                            Write a review
                        </p>

                    </div>
                </div>
            </div>
        </div>

        {
            reviews.length > 0 ? <ReviewCard review={reviews[0]} /> : (
                <></>
            )
        }
         
        
        {
            openReview ? 
            <ReviewModal unmount={() => setOpenReview(false)} reviews={reviews} hotelId={hotel.ID} refetch={fetchReview}/> : <></>
        }
        </>  
    )
}