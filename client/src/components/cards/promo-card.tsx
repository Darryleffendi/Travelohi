import { useState } from 'react';
import discountIcon from '../../assets/icon/discount.png';
import { APP_SETTINGS } from '../../settings/app-settings';

export default function PromoCard({imgSrc = null, promo, width = 30, className = "", style, onClick = () => {}} : any) {

    let sizeClass = " w-" + width + " h-100"

    let title = promo.title
    let discount = promo.discount
    let promoCode = promo.promoCode
    let validFrom = promo.validFrom
    let validUntil = promo.validUntil
    let imgSource = APP_SETTINGS.backend + "/" + promo.ImageUrl;

    const [hovered, setHovered] = useState(false);

    return (
        <div className={`overflow-hidden flex ${sizeClass} transition-2 relative ${className}`}
            onClick={onClick} 
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
            style={style}
        >
            <div className="w-5 h-100 bg-col-a2 flex-center transition-2s z-10" style={{marginLeft: hovered ? '0px' : '-5%'}}></div>
            <div className='h-100 absolute w-100 flex-center justify-center'>
                <img className={`h-100 cover absolute z-5 transition ${hovered ? 'w-110' : 'w-100'}`} src={imgSrc ? imgSrc : imgSource} />
            </div>
            <div className="w-100 h-100 bg-col-a-transparent z-10 flex-center justify-center transition-2s">
                <div className="w-45 h-100 flex-col justify-between">
                    <div className="mt-2">
                        <div className="w-24p h-24p rounded-50 bg-col-a2 flex-center justify-center mb-1">
                            <img src={discountIcon} className="w-80 h-80"/>
                        </div>
                        <p className="fs-xs m-0 font-p fc-white text-line-narrow text-narrow font-medium">{title}</p>
                    </div>
                    <div>
                        <p className="fs-2xl m-0 font-p fc-white font-medium">{discount}%</p>
                        <p className="fs-2xs mt--1 font-p fc-white text-line-narrow text-narrow font">{promoCode}</p>
                    </div>
                </div>
                <div className="w-45 h-100 flex justify-end">
                    <div className='w-80 h-24p glassmorphism rounded-2 mt-2 flex-center justify-center'>
                        <p className='font-p fc-white fs-2xs text-narrow'>
                            {formatDate(validFrom)} - {formatDate(validUntil)}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

function formatDate(input : any) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const parts = input.split('-');
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const formattedDate = `${day} ${months[month - 1]}`;
    
    return formattedDate;
}