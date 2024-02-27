import leftArrow from "../../assets/icon/leftWhite.png"
import rightArrow from "../../assets/icon/rightWhite.png"
import { APP_SETTINGS } from "../../settings/app-settings"

export default function ReviewCardSmall({className = "w-100 h-s40", review} : any) {
    return (
        <div className={`bg-col-main flex-col flex-center justify-center ${className}`}>
                <div className="w-90 h-s25 flex-center justify-center">
                    <div className="w-30 h-100 flex-col justify-between">
                        <div className="border-a border-full w-70 h-28p rounded-2 flex-center justify-center">
                            <p className="m-0 fs-2xs">{review.reviewType}</p>
                        </div>
                        <div>
                            <p className="fs-xl m-0">{review.rating}/5</p>
                        </div>
                    </div>
                    <div className="w-70 h-100 flex-col justify-between">
                        <div className="flex-center justify-between">
                            <div className="flex-center">
                                <img className="w-48p h-48p cover rounded-50" src={APP_SETTINGS.backend + "/" + review.user.imageUrl}/>
                                <div className="ml-2">
                                    <p className="fs-xs font-medium m-0">{review.user.firstName} {review.user.lastName}</p>
                                    <p className="fs-xs font-light m-0">TraveloHI User</p>
                                </div>
                            </div>
                        </div>
                        <p className="fs-2xs m-0">{review.review}</p>
                    </div>
                </div>
            </div>
    )
}