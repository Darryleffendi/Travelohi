import star from "../assets/icon/star.png"
import starDisabled from "../assets/icon/star_disabled.png"

export default function StarRating({rating, className="w-24p h-24p", setRating = (rating) => {}} : Params) {

    if(rating < 0) rating = 0
    if(rating > 5) rating = 5

    return (
        <>
            {
                Array.from({ length: rating }, (v, i) => (
                    <img key={i} className={className} src={star} onClick={() => setRating(i + 1)} />
                ))
            }
            {
                Array.from({ length: 5 - rating }, (v, i) => (
                    <img key={i} className={className} src={starDisabled} onClick={() => setRating(i + rating + 1)} />
                ))
            }
        </>
    )
}

type Params = {
    rating: number
    className? : string
    setRating? : (rating : number) => void
}