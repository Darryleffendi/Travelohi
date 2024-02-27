import leftArrow from "../../assets/icon/leftWhite.png"
import rightArrow from "../../assets/icon/rightWhite.png"
import { APP_SETTINGS } from "../../settings/app-settings"

export default function ReviewCard({className = "w-100 h-s60", review, next, prev} : any) {
    return (
        <div className={`bg-col-main flex-col flex-center justify-center ${className}`}>
                <div className="w-90 h-80 flex-center justify-center">
                    <div className="w-30 h-100 flex-col justify-between">
                        <div className="border-a border-full w-25 h-32p rounded-2 flex-center justify-center">
                            <p className="m-0 fs-xs">{review.reviewType}</p>
                        </div>
                        <div>
                            <p className="fs-2xl">{review.rating}/5</p>
                        </div>
                    </div>
                    <div className="w-70 h-100 flex-col justify-between">
                        <div className="flex-center justify-between">
                            <div className="flex-center">
                                <img className="w-84p h-84p cover rounded-50" src={APP_SETTINGS.backend + "/" + review.user.imageUrl}/>
                                <div className="ml-2">
                                    <p className="fs-s font-medium m-0">{review.user.firstName} {review.user.lastName}</p>
                                    <p className="fs-s font-light m-0">TraveloHI User</p>
                                </div>
                            </div>
                            <div className="flex-center">
                                <div className="h-48p bg-col-a-transparent w-48p rounded-50 flex-center justify-center o-60 transition-2s hover-bg-col-a2 mr-1">
                                    <div className="h-40p bg-col-main w-40p rounded-50 flex-center justify-center" onClick={prev}>
                                        <img src={leftArrow} className="w-40 filter-black" />
                                    </div>
                                </div>
                                <div className="h-48p bg-col-a-transparent w-48p rounded-50 flex-center justify-center o-60 transition-2s hover-bg-col-a2">
                                    <div className="h-40p bg-col-main w-40p rounded-50 flex-center justify-center" onClick={next}>
                                        <img src={rightArrow} className="w-40 filter-black" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="fs-l">{review.review}</p>
                    </div>
                </div>
            </div>
    )
}