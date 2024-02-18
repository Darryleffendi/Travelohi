import { useState } from 'react';
import discountIcon from '../../assets/icon/discount.png';
import { APP_SETTINGS } from '../../settings/app-settings';

export default function PromoCardLarge({promo, className = "", style = {}} : any) {
    
    const [hovered, setHovered] = useState(false);

    let title = promo.title
    let discount = promo.discount
    let promoCode = promo.promoCode
    let validFrom = promo.validFrom
    let validUntil = promo.validUntil
    let imgSrc = APP_SETTINGS.backend + "/" + promo.ImageUrl

    return (
        <div className={`w-100 bg-col-a3 flex shadow-light overflow-hidden z-10 transition flex-shrink-0 ${className}`} 
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
            style={style}
        >
            <div className="w-5 h-100 bg-col-a2 flex-center transition-2s z-10" style={{marginLeft: hovered ? '0px' : '-5%'}}></div>
            <div className="w-40 h-100 overflow-hidden flex-center justify-center">
                <img className={`w-100 cover transition ${hovered ? 'h-110' : 'h-100'}`} src={imgSrc} />
            </div>
            <div className="w-60 h-100 bg-col-white flex-col flex-center justify-center">
                <div className='w-80'>
                    <p className='font-p fc-a fs-2xs text-narrow m-0'>
                        {formatDate(validFrom)} - {formatDate(validUntil)}
                    </p>
                    <p className='font-serif fc-a3 font-bold fs-xl m-0'>{title}</p>
                </div>

                <p className='w-80 font-p fs-xs font-light fc-a mt-2'>
                    Save up to {discount}% on purchases with the promo code {promoCode}
                </p>
                <p className='w-80 font-p fs-3xs font-light fc-a2 mt-0'>
                    *Terms and conditions applied
                </p>
                
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