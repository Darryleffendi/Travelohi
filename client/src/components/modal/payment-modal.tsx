import { useEffect, useState } from "react";
import useUser from "../../contexts/user-context";
import IHotelRoom from "../../interfaces/hotel-room";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/modal.module.css"
import StarRating from "../../util/star-rating";
import ReviewCardSmall from "../cards/review-card-small";
import creditIcon from "../../assets/icon/credit.png"
import wallet from "../../assets/icon/wallet.png"
import radioIcon from "../../assets/icon/radio.png"
import radioActiveIcon from "../../assets/icon/radio_active.png"
import discountIcon from "../../assets/icon/discount_gray.png"
import useDebounce from "../../hooks/use-debounce";
import check from '../../assets/icon/checkmark.png'

export default function PaymentModal({unmount = () => {}, hotelCart = [], flightCart = [], refetch} : any) {

    const [modalShown, setModalShown] = useState(false);
    
    const [category, setCategory] = useState("");
    const [rating, setRating] = useState(0);

    const [hotelPrice, setHotelPrice] = useState(0);
    const [baggagePrice, setBaggagePrice] = useState(0);
    const [flightPrice, setFlightPrice] = useState(0);
    const [paymentActive, setPaymentActive] = useState(1)

    const [censoredCredit, setcensoredCredit] = useState("");
    const [user, refreshUser] = useUser();
    const [errorMessage, setErrorMessage] = useState("")
    const [showSuccess, setShowSuccess] = useState(false);
    
    const [promo, setPromo] = useState<any>(null)
    const [promoCode, setPromoCode] = useState("")

    const closeModal = async () => {
        setModalShown(false);
        await new Promise(r => setTimeout(r, 600));
        unmount();
    }

    const fetchPromo = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/api/get/promo/from/code", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'promoCode': promoCode + ""})
        });
        
        const data = await response.json();

        if("error" in data) {
            setErrorMessage(data.error)
            setPromo(null);
            return;
        }

        setErrorMessage("")
        setPromo(data)
    }

    useEffect(() => {
        console.log(flightCart)
        console.log(hotelCart)
        setModalShown(true);
        document.body.style.overflowY = "hidden"

        return () => {
            document.body.style.overflowY = "auto"
        }   
    }, [])

    useEffect(() => {

        if(user?.cardNumber == undefined) {
            setcensoredCredit("Not Set")
            return;
        }

        let cardStr = user?.cardNumber?.toString()
        let censoredStr = ""

        let digit = cardStr.length - 4
        for(let i = 0; i < cardStr.length; i ++) {
            if(i < digit) {
                censoredStr += "*"  
            } 
            else {
                censoredStr += cardStr[i]
            }

            if((i + 1) % 4 == 0) censoredStr += " "
        }
        setcensoredCredit(censoredStr)

    }, [user])

    useDebounce(() => {
        if(promoCode != "") {
            fetchPromo();
        }
        else {
            setPromo(null)
            setErrorMessage("")
        }
      }, [promoCode], 500
    );

    useEffect(() => {

        let hp = 0
        let fp = 0
        let bp = 0

        for(let i = 0; i < hotelCart.length; i++) {
            hp += dateDifference(hotelCart[i].startDate, hotelCart[i].endDate) * hotelCart[i].room.price
        }
        for(let i = 0; i < flightCart.length; i++) {
            fp += flightCart[i].flight.price
            bp += flightCart[i].baggage
        }

        setFlightPrice(fp)
        setHotelPrice(hp)
        setBaggagePrice(bp)

    },[flightCart, hotelCart])

    const handleSubmit = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/api/checkout/cart", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'hotelCart' : JSON.stringify(hotelCart),
                'flightCart' : JSON.stringify(flightCart),
                'userId' : user?.ID + "",
                'promoCode': promoCode,
                'paymentMethod' : paymentActive + "",
                'totalPrice': totalPrice,
            })
        });
        
        const data = await response.json();

        if("error" in data) {
            setErrorMessage(data.error)
            return;
        }
        
        setShowSuccess(true);
        refetch();
        refreshUser();
        await new Promise(r => setTimeout(r, 2000));
        setShowSuccess(false);
    }

    if(user == undefined || user?.walletBalance == undefined) {
        return <></>
    }

    let promoAmount = 0
    let totalPrice = flightPrice + hotelPrice + baggagePrice

    if(promo != null) {
        promoAmount = promo.discount * totalPrice / 100 
    }

    return (
        <div className="w-screen h-screen fixed z-100 bg-col-dark2-transparent flex-center justify-center transition-2 top-0 left-0" style={{opacity: modalShown ? '100%' : '0%', backdropFilter: modalShown ? 'blur(10px)' : '', zIndex: "100"}} onClick={closeModal}>
            <div className={`bg-col-main shadow-light transition-3 flex-center justify-center mobile-flex-col overflow-auto ${styles.modal}`} style={ modalShown ? {marginTop:'0vw', opacity: '100%'} : {marginTop:'60vw', opacity: '0%'}}  onClick={(e) => e.stopPropagation()}>
                <div className="w-30 h-80 flex-col gap-10">
                    
                    <div className="flex-center gap-xs o-60">
                        {/* <img src={cart} className="w-20p h-20p cover" /> */}
                        <p className="font-serif fs-s font-medium fc-a ">Cart Summary</p>
                    </div>
                    <div className="w-100 h-s50 flex-start mt-5 justify-start">
                        <div className="w-80 flex-col">
                            <div className="w-100 border-bottom border-a-transparent">
                                <p className="font-serif fs-xs mt-0">Subtotal</p>
                            </div>

                            <div className="flex-center justify-between mt-2">
                                <p className="fs-xs m-0 o-50 font-medium">Flight Tickets</p>
                                <p className="fs-xs font-medium fc-a2 m-0">${flightPrice}</p>
                            </div>
                            
                            <div className="flex-center justify-between mt-1">
                                <p className="fs-xs m-0 o-50 font-medium">Hotel Rooms</p>
                                <p className="fs-xs font-medium fc-a2 m-0">${hotelPrice}</p>
                            </div>

                            <div className="flex-center justify-between mt-1">
                                <p className="fs-xs m-0 o-50 font-medium">Baggage</p>
                                <p className="fs-xs font-medium fc-a2 m-0">${baggagePrice}</p>
                            </div>

                            <div className="w-100 border-top border-a-transparent flex-col justify-between m-0 mt-2">
                                <div className="w-100 flex-center justify-between mt-1">
                                    <p className="fs-xs m-0 o-50 font-medium">Total</p>
                                    <p className="fs-xs font-medium fc-a2 m-0">${totalPrice}</p>
                                </div>
                                <div className="w-100 flex-center justify-between mt-1">
                                    <p className="fs-xs m-0 o-50 font-medium">Promos</p>
                                    <p className="fs-xs font-medium fc-a2 m-0">${promoAmount}</p>
                                </div>
                            </div>

                            <div className="w-100 border-top border-a-transparent flex-center justify-between mt-2">
                                <p className="font-serif fs-xs">Grand Total</p>
                                <p className="fs-xs font-medium fc-a2">${totalPrice - promoAmount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`w-60 h-80 mw-80 transition`}>
                    <div className="ml-5 w-90 bg-col-white shadow-light flex-start justify-center">
                        <div className="w-80 flex-col mt-5">
                            <div className="w-100 border-bottom border-a-transparent">
                                <p className="font-serif fs-xs mt-0">Payment</p>
                            </div>

                            <div className="w-100 flex-center flex-col">
                                <div 
                                    className={`w-100 flex-center justify-center transition-3 flex-shrink-0 pointer`}
                                    onClick={() => setPaymentActive(0)}
                                >
                                    <div className={`w-100 flex-center ${paymentActive == 0 ? "border-bottom border-a-transparent" : ""}`}>
                                        {
                                            paymentActive == 0 ? (
                                                <img src={radioActiveIcon} className="w-18p h-18p cover " />
                                            ) : (
                                                <img src={radioIcon} className="w-18p h-18p cover o-50" />
                                            )
                                        }
                                        <div className="ml-1 mt-1 mb-1 w-100">
                                            <div className="flex-center w-100 justify-between">
                                                <p className="m-0 fs-xs font-medium">TraveloHI Wallet</p>
                                                <img src={wallet} className="w-16p h-16p"/>
                                            </div>
                                            <p className="m-0 fs-3xs fc-a o-70">Safe payment online using your E-Wallet.</p>
                                        </div>
                                    </div>
                                </div>
                            

                                <div 
                                    className={`w-100 flex-center justify-center transition-3 flex-shrink-0 pointer z-1`}
                                    onClick={() => setPaymentActive(1)}
                                >
                                    <div className={`w-100 flex-center ${paymentActive == 1 ? "border-bottom border-a-transparent" : ""}`}>
                                        {
                                            paymentActive == 1 ? (
                                                <img src={radioActiveIcon} className="w-18p h-18p cover " />
                                            ) : (
                                                <img src={radioIcon} className="w-18p h-18p cover o-50" />
                                            )
                                        }
                                        <div className="ml-1 mt-1 mb-1 w-100">
                                            <div className="flex-center w-100 justify-between">
                                                <p className="m-0 fs-xs font-medium">Credit Card</p>
                                                <img src={creditIcon} className="w-16p h-16p"/>
                                            </div>
                                            <p className="m-0 fs-3xs fc-a o-70">Safe money transfer using your bank account.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-100 flex-center justify-between">
                            {
                                paymentActive == 0 ? (
                                    <div>
                                        <p className="fs-2xs font-medium o-50 m-0 mt-2">Wallet Balance</p>
                                        <p className="fs-s m-0 font-medium fc-a2">${user?.walletBalance.toLocaleString()}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="fs-2xs font-medium o-50 m-0 mt-2">Credit Card Number</p>
                                        <p className="fs-s m-0 font-medium fc-a2">{censoredCredit}</p>
                                    </div>
                                )
                            }
                                <div className="w-40 mt-2">
                                    <label className="fs-2xs font-medium o-50 m-0 mt-2 text-left w-100" htmlFor="promoCode">Promo Code</label>
                                    <input 
                                        name="promoCode" className={`${styles.overlayInput} fs-2xs`} 
                                        placeholder="Promo Code" id="promoCode"
                                        style={{backgroundImage: `url(${discountIcon})`}} 
                                        value={promoCode} onChange={(e) => {setPromoCode(e.target.value)}}
                                    />
                                </div>

                            </div>

                            
                            <p className="mb-0 fc-red fs-xs">{errorMessage}</p>
                            <button className="bg-col-a2 fc-white o-80 h-op3 mt-2 mb-5" onClick={handleSubmit}>
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div 
                className="fixed w-100 h-64p bg-col-white z-100 flex-center transition self-flex-end bottom-0" style={{'marginBottom' : showSuccess ? '0px' : '-64px'}}
            >
                <img src={check} className="ml-5 h-50"/>
                <h3 className="font-main fc-green ml-1">Successfully Added to Cart</h3>
            </div>
        </div>
    )
}

function dateDifference(date1 : any, date2 : any) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const startDate : any = new Date(date1);
    const endDate : any = new Date(date2);
    return Math.round((endDate - startDate) / millisecondsPerDay);
}