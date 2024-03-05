
export default function ProfileButton({imgSrc, text, isActive = false, onClick = () => {}} : Params) {
    return (
        <div 
            className={`flex-center mobile-flex-col gap-xs h-op3 h-100 w-15 justify-center pointer ${isActive ? "bg-col-a-transparent-2" : "o-50 bg-col-a3"}`}
            onClick={onClick}
        >
            <img src={imgSrc} className="w-18p h-18p cover filter-white"/>
            <p className="fc-white fs-xs m-0">{text}</p>
        </div>
    )
}

type Params = {
    imgSrc : any;
    text : string;
    isActive? : boolean;
    onClick? : () => void;
}