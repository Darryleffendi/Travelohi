import { useEffect, useState } from "react"
import useUser from "../../contexts/user-context"
import IProfileSubpage from "../../interfaces/profile-subpage"
import styles from "../../styles/profile.module.css"
import creditIcon from "../../assets/icon/credit.png"
import wallet from "../../assets/icon/wallet.png"
import radioIcon from "../../assets/icon/radio.png"
import radioActiveIcon from "../../assets/icon/radio_active.png"
import send_icon from "../../assets/icon/send.png"
import receive_icon from "../../assets/icon/receive.png"
import topup_icon from "../../assets/icon/topup.png"
import history_icon from "../../assets/icon/history_blue.png"
import check from '../../assets/icon/checkmark.png'
import { APP_SETTINGS } from "../../settings/app-settings"

export default function ProfileSubpage({setLeftCard} : IProfileSubpage) {

    const [user, refreshUser] = useUser();
    const [updatedData, setUpdatedData] = useState(
        {...user}
    )

    const [errorMessage, setErrorMessage] = useState("")
    const [showSuccess, setShowSuccess] = useState(false);
    const [paymentActive, setPaymentActive] = useState(1)

    useEffect(() => {

        if(paymentActive == undefined || setPaymentActive == undefined) {
            return;
        }
        if(user === undefined || user?.walletBalance == undefined) {
            return;
        }

        (async () => {

        })()

        setLeftCard(<>
            <div className="flex-center gap-xs o-60">
                <img src={creditIcon} className="w-20p h-20p cover" />
                <p className="font-serif fs-s font-medium fc-a ">Payment Details</p>
            </div>
            <div className="w-100 h-s50 bg-col-white shadow-light flex-center flex-col">
                <div 
                    className={`w-100 flex-center justify-center transition-3 flex-shrink-0 pointer ${paymentActive == 0 ? "bg-col-white " : "bg-col-light"}`}
                    onClick={() => setPaymentActive(0)}
                >
                    <div className={`w-85 flex-center ${paymentActive == 0 ? "border-bottom border-a-transparent" : ""}`}>
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
                
                {/* HI WALLET */}
                <div className={`w-85 flex-col transition-2 o-80 ${paymentActive == 0 ? "h-100 mt-2" : " h-0 overflow-hidden"}`}>
                    <p className="fs-3xs o-70 font-medium m-0">Your Wallet Balance</p>
                    <p className="fs-xl font-medium m-0 mb-2 fc-a2">${(user?.walletBalance).toLocaleString()}</p>

                    <div className="w-100 h-64p shadow-light rounded flex-center justify-around flex-shrink-0" style={{backgroundColor: "#ffffff"}}>
                        <div className="w-15 flex-col flex-center justify-center pointer o-70 h-op3">
                            <img src={topup_icon} className="w-20p h-20p cover"/>
                            <p className="m-0 fs-3xs font-medium o-70">Topup</p>
                        </div>
                        <div className="w-15 flex-col flex-center justify-center pointer o-70 h-op3">
                            <img src={send_icon} className="w-20p h-20p cover"/>
                            <p className="m-0 fs-3xs font-medium o-70">Pay</p>
                        </div>
                        <div className="w-15 flex-col flex-center justify-center pointer o-70 h-op3">
                            <img src={receive_icon} className="w-20p h-20p cover"/>
                            <p className="m-0 fs-3xs font-medium o-70">Receive</p>
                        </div>
                        <div className="w-15 flex-col flex-center justify-center pointer o-70 h-op3">
                            <img src={history_icon} className="w-20p h-20p cover"/>
                            <p className="m-0 fs-3xs font-medium o-70">History</p>
                        </div>
                    </div>
                </div>

                <div 
                    className={`w-100 flex-center justify-center transition-3 flex-shrink-0 pointer z-1 ${paymentActive == 1 ? "bg-col-white " : "bg-col-light"}`}
                    onClick={() => setPaymentActive(1)}
                >
                    <div className={`w-85 flex-center ${paymentActive == 1 ? "border-bottom border-a-transparent" : ""}`}>
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
                
                {/* Credit Card */}
                <div className={`w-85 flex-col transition-2 o-80 overflow-hidden bg-col-white z-1 ${paymentActive == 1 ? "h-100" : " h-0"}`}>
                    <div className="w-100 mt-2">
                        <label className="font-p fc-gray fs-3xs text-left w-100 mt-2" htmlFor="cardHolder">Card Holder Name</label>
                        <input 
                            type="text" className={`${styles.overlayInput} fs-2xs`} id="cardHolder"
                            placeholder="Card Holder Name" name="cardHolder"
                            value={updatedData.cardHolder} onChange={handleChange}
                        />
                    </div>
                    <div className="w-100">
                        <label className="font-p fc-gray fs-3xs text-left w-100 mt-2" htmlFor="creditNumber">Credit Card Number</label>
                        <input 
                            type="text" className={`${styles.overlayInput} fs-2xs`} id="cardNumber"
                            placeholder="Credit Number" name="cardNumber"
                            value={updatedData.cardNumber} onChange={handleChange}
                        />
                    </div>
                    <div className="w-100 flex-center justify-between gap-xs">
                        <div className="w-100">
                            <label className="font-p fc-gray fs-3xs text-left w-100 mt-2" htmlFor="cardCvv">CVV Number</label>
                            <input 
                                type="text" className={`${styles.overlayInput} fs-2xs`} id="cardCvv"
                                placeholder="CVV Code" name="cardCvv"
                                value={updatedData.cardCvv} onChange={handleChange}
                            />
                        </div>
                        <div className="w-100">
                            <label className="font-p fc-gray fs-3xs text-left w-100 mt-2" htmlFor="creditNumber">Expiry Date</label>
                            <input 
                                type="text" className={`${styles.overlayInput} fs-2xs`} id="cardExpiry"
                                placeholder="MM / YY" name="cardExpiry"
                                value={updatedData.cardExpiry} onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
        )

        
    }, [paymentActive, setPaymentActive, updatedData])

    const handleChange = (e : any) => {
        setUpdatedData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    } 

    const handleCheck = (e : any) => {
        setUpdatedData(prevData => ({
            ...prevData,
            receiveEmail: e.target.checked
        }))
    }

    const handleSubmit = async (e : any) => {
        const formData = new FormData();
        
        Object.keys(updatedData).forEach(key => {
            if(key === 'dob') {
                formData.append("dob", new Date(updatedData["dob"]).toISOString().split('T')[0]);
            }
            else {
                formData.append(key, updatedData[key]);
            }
        });

        const response = await fetch(APP_SETTINGS.backend + "/api/update/user", {
            method: 'PATCH',
            body: formData
        });

        const data = await response.json()
        
        if("error" in data) {
            setErrorMessage(data.error);
            return;
        }
        else {
            refreshUser()
            setShowSuccess(true);
            setErrorMessage("")
            await new Promise(r => setTimeout(r, 3000));
            setShowSuccess(false);
        }
    }

    if((user != null && "notAuthenticated" in user) || user == null) {
        return <></>
    }

    return (
        <>
            <p className="font-serif fs-l font-medium m-0 fc-a">Personal Data</p>

            <div className="flex-col w-100 gap-10 mt-5">

                <div className="flex-center w-100 gap-xs">
                    <div className="flex-col w-100">
                        <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="firstName">First Name</label>
                        <input 
                            name="firstName" className={`${styles.input} fs-2xs`} 
                            placeholder="First Name" id="firstName"
                            value={updatedData.firstName} onChange={handleChange}
                        />
                    </div>
                    <div className="flex-col w-100">
                        <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="lastName">Last Name</label>
                        <input 
                            name="lastName" className={`${styles.input} fs-2xs`} 
                            placeholder="Last Name" id="lastName"
                            value={updatedData.lastName} onChange={handleChange}
                        />
                    </div>
                </div>
                
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="address">Address</label>
                <input 
                    name="address" className={`${styles.input} fs-2xs`} 
                    placeholder="Address" id="address"    
                    value={updatedData.address} onChange={handleChange}
                />
                
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="dob">Date of Birth</label>
                <input 
                    name="dob" 
                    className={`${styles.input} fs-2xs`} placeholder="Date of Birth" 
                    id="dob" type="date"
                    value={new Date(updatedData.dob).toISOString().split('T')[0]}
                    onChange={handleChange}
                />
            </div>

            
            <p className="font-serif fs-l font-medium m-0 mt-5 fc-a">Contact Details</p>
            <div className="flex-col w-100 gap-10 mt-5">                
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="Phone Number">Phone Number</label>
                <input 
                    name="phoneNumber" className={`${styles.input} fs-2xs`} 
                    placeholder="Phone Number" id="phoneNumber"
                    value={updatedData.phoneNumber} onChange={handleChange}
                />

                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="email">Email</label>
                <input 
                    name="email" className={`${styles.input} fs-2xs`} 
                    placeholder="Email" id="email"
                    value={updatedData.email} onChange={handleChange}
                />

                <div className="flex-center w-100 mt-2">
                    <input 
                        type="checkbox" id="agree" 
                        checked={updatedData.receiveEmail} onChange={handleCheck}
                    />
                    <label className="font-p fs-2xs fc-gray text-left w-80 ml-1" htmlFor="agree">I want to receive newsletters and emails</label>
                </div>

                <p className="mb-0 fc-red fs-xs">{errorMessage}</p>

                <button className="bg-col-a2 fc-white o-80 h-op3 mt-2" onClick={handleSubmit}>
                    Save Changes
                </button>
                {/* <p className="font-p fc-a fs-3xs text-left w-80 mb-5 o-50">* Updating user, contact, and payment details</p> */}
            </div>

            <div 
                className="fixed w-screen h-64p bg-col-white z-100 flex-center transition self-flex-end bottom-0 left-0" style={{'marginBottom' : showSuccess ? '0px' : '-64px'}}
            >
                <img src={check} className="ml-5 h-50"/>
                <h3 className="font-main fc-green ml-1">Successfully Updated User Details</h3>
            </div>
        </>
    )
}