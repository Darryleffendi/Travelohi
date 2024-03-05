
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import useNavigator from "../../contexts/navigator-context";
import useUser from "../../contexts/user-context";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/admin.module.css"


export default function OtpPopup({success, email} : any) {

    const [emailSent, setEmailSent] = useState(false);
    const [show, setShow] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [errorMsg, setErrorMessage] = useState("");
    const [pictureAttached, setPictureAttached] = useState(false);
    const [user, refreshUser] = useUser();
    const changePage = useNavigator();

    const [otp, setOtp] = useState(['','','','','',''])

    const changeOtp = (index : number, value : any) => {
        if(value >= 10 || value < 0) {
            return
        }
        let prevOtp = [...otp]

        if(value != '') {
            prevOtp[index] = (parseInt(value)).toString()
        }
        else {
            prevOtp[index] = ''
        }
        setOtp(prevOtp)
    }

    useEffect(() => {
        setShow(true);
    }, [])

    const onSubmit = async () => {

        let otpCode = ""

        for(let i = 0; i < otp.length; i ++) {
            otpCode += otp[i]
        }

        const response = await fetch(APP_SETTINGS.backend + "/auth/validate/otp", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                "email" : email,
                "otpCode" : otpCode
            })
        });
        const data = await response.json()

        if("error" in data) {
            setErrorMessage(data.error)
            return
        }

        setShow(false);
        await new Promise(r => setTimeout(r, 350));
        refreshUser()
        changePage("/")
    }

    useEffect(() => {

        if(emailSent == true) return;

        setEmailSent(true);

        (async () => {
            const response = await fetch(APP_SETTINGS.backend + "/auth/send/otp", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "email" : email
                })
            });
            const data = await response.json()
            console.log(data)
        })()
    }, [emailSent])

    return (
        <div 
            className={`z-100 w-screen h-screen absolute pos-0 flex-center justify-center transition-2 ${show ? 'bg-col-dark2-transparent' : ''}`}
        >
            <div className={`h-30 bg-col-main rounded flex-col flex-center justify-center transition-2 ${show ? 'o-100' : 'o-0'}`} style={{'width': 'calc(280px + 6vw)'}}>
                
                <p className="font-p fc-a fs-2xs text-left w-80 font-narrow">OTP Code will expire in 2 minutes</p>
                <div className="w-80 flex-center gap-10">
                    <input type="text" className={`${styles.input} text-center font-medium fs-gray`} placeholder="*" value={otp[0]} onChange={(e) => changeOtp(0, e.target.value)}/>
                    <input type="text" className={`${styles.input} text-center font-medium fs-gray`} placeholder="*" value={otp[1]} onChange={(e) => changeOtp(1, e.target.value)}/>
                    <input type="text" className={`${styles.input} text-center font-medium fs-gray`} placeholder="*" value={otp[2]} onChange={(e) => changeOtp(2, e.target.value)}/>
                    <input type="text" className={`${styles.input} text-center font-medium fs-gray`} placeholder="*" value={otp[3]} onChange={(e) => changeOtp(3, e.target.value)}/>
                    <input type="text" className={`${styles.input} text-center font-medium fs-gray`} placeholder="*" value={otp[4]} onChange={(e) => changeOtp(4, e.target.value)}/>
                    <input type="text" className={`${styles.input} text-center font-medium fs-gray`} placeholder="*" value={otp[5]} onChange={(e) => changeOtp(5, e.target.value)}/>
                </div>
                <p className="font-p fs-2xs fc-red m-0">{errorMsg}</p>
                <button className="bg-col-gray o-70 h-op2 w-80 mt-2" onClick={onSubmit}>Sign In</button>

            </div>
        </div>
    )
}