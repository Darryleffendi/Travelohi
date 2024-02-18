
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ReCaptchaPopup({onCaptcha} : any) {

    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, [])

    const onCaptchaVerif = async (val : any) => {
        if(val != null) {
            setShow(false);
            await new Promise(r => setTimeout(r, 350));
            onCaptcha()
        }
    }

    return (
        <div 
            className={`z-100 w-screen h-screen absolute pos-0 flex-center justify-center transition-2 ${show ? 'bg-col-dark2-transparent' : ''}`}
        >
            <div className={`h-20 bg-col-main rounded flex-center justify-center transition-2 ${show ? 'o-100' : 'o-0'}`} style={{'width': 'calc(280px + 6vw)'}}>
                
                <ReCAPTCHA
                    sitekey="6Lf7jlkpAAAAAFNEH9KDrtsyn-foRMf8gIe5LB_8"
                    onChange={(val : any) => onCaptchaVerif(val)}
                />

            </div>
        </div>
    )
}