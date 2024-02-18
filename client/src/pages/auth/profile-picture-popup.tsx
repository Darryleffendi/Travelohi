
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "../../styles/admin.module.css"


export default function ProfilePicturePopup({onCaptcha, changeProfilePicture} : any) {

    const [show, setShow] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [errorMsg, setErrorMessage] = useState("");
    const [pictureAttached, setPictureAttached] = useState(false);

    useEffect(() => {
        setShow(true);
    }, [])

    const onCaptchaVerif = async (val : any) => {
        if(val != null) {
            setCaptchaVerified(true);
        }
    }

    const onSubmit = async () => {
        if(captchaVerified == false) {
            setErrorMessage("Please verify that you are human")
            return;
        }
        if(pictureAttached == false) {
            setErrorMessage("Please attach your profile picture")
            return;
        }
        setShow(false);
        await new Promise(r => setTimeout(r, 350));
        onCaptcha()
    }

    const setPicture = (event : any) => {
        if(event.target.files == null) {
            setErrorMessage("Please attach your profile picture")
            return;
        }
        if(event.target.files[0] == null) {
            setErrorMessage("Please attach your profile picture")
            return
        }
        changeProfilePicture(event.target.files[0])
        setPictureAttached(true)
    }

    return (
        <div 
            className={`z-100 w-screen h-screen absolute pos-0 flex-center justify-center transition-2 ${show ? 'bg-col-dark2-transparent' : ''}`}
        >
            <div className={`h-40 bg-col-main rounded flex-col flex-center justify-center transition-2 ${show ? 'o-100' : 'o-0'}`} style={{'width': 'calc(280px + 6vw)'}}>
                
                <p className="font-p fc-a fs-2xs text-left w-80 font-narrow m-0">Profile Picture</p>
                <div className="border-a-transparent w-80 rounded p-5p flex-center justify-between mb-2">
                    <input type="file" className={styles.fileInput} accept="image/*" onChange={setPicture}/>
                </div>

                <ReCAPTCHA
                    sitekey="6Lf7jlkpAAAAAFNEH9KDrtsyn-foRMf8gIe5LB_8"
                    onChange={(val : any) => onCaptchaVerif(val)}
                />
                <p className="font-p fs-2xs fc-red m-0">{errorMsg}</p>
                <button className="bg-col-gray o-70 h-op2 w-80 mt-2" onClick={onSubmit}>Register</button>

            </div>
        </div>
    )
}