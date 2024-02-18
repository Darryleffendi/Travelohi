import styles from "../../styles/login.module.css";
import logo from "../../assets/logosimple.png"
import userIcon from "../../assets/icon/user.png";
import emailIcon from "../../assets/icon/email.png";
import passwordIcon from "../../assets/icon/password.png";
import googleIcon from "../../assets/icon/google.png";
import { useEffect, useState } from "react";
import IAuthPageParameters from "../../interfaces/auth-page-param";

export default function LoginSubpage({setSubpage, submitForm, newData, errorMessage, addNewData} : IAuthPageParameters) {

    const [opacity, setOpacity] = useState('0%');

    useEffect(() => {
        const delaything = async () => {
            await new Promise(r => setTimeout(r, 5));
            setOpacity('100%');
        }

        delaything();
    }, [])

    const changePage = async () => {
        setOpacity('0%');

        await new Promise(r => setTimeout(r, 350));

        setSubpage(1);
    }

    return (
        <div className="w-80 flex-center flex-col justify-between wrap h-80 transition" style={{opacity:`${opacity}`}}>
            <div className="flex-center flex-col justify-between wrap">
                <img alt="close" className="overlay-logo" src={logo} style={{height:"38px"}}/>
                <p className="font-h fc-black m-0 mt-1 fs-m">Welome Back</p>
                <p className="font-p fc-gray m-0 mb-5 fs-2xs">Please enter your details to sign in</p>
            </div>

            <div className="w-100">
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="email">Email</label>
                <input 
                    type="text" className={styles.overlayInput} id="email" 
                    style={{backgroundImage: `url(${emailIcon}`}} placeholder="Type your email"
                    value={newData.email} onChange={(e) => addNewData({email: e.target.value})}
                />
            </div>

            
            <div className="w-100">
                <label className="font-p fc-gray fs-2xs text-left w-100 mt-2" htmlFor="password">Password</label>
                <input 
                    type="password" className={styles.overlayInput} id="password" 
                    style={{backgroundImage: `url(${passwordIcon})`}} placeholder="Type your password"
                    value={newData.password} onChange={(e) => addNewData({password: e.target.value})}                    
                />
            </div>

            <a className="font-p fc-gray fs-2xs w-100 mt-1 text-right no-deco" href="https://www.nhs.uk/conditions/dementia/treatment/">Forget password?</a>

            <button className={`${styles.signBtn} fs-xs font-h bg-col-a mt-5 pointer`} onClick={()=>{if(submitForm) submitForm()}}>Sign In</button>

            <div className="mt-1 mb-1 w-80 flex-center justify-between">
                <div className="overlay-line"></div>
                <p className="font-p fc-gray fs-2xs m-0 o-70">OR</p>
                <div className="overlay-line"></div>
            </div>
            <button className={`${styles.signBtn} fs-xs font-p bg-col-main fc-a border-a mb-2 pointer`} onClick={()=>{if(submitForm) submitForm()}}>
                <img src={googleIcon} style={{width:'14px', marginRight: '12px'}}/>  
                Sign In with OTP
            </button>

            <p className="font-p fs-2xs fc-red mb-1" id="error_login">{errorMessage}</p>

            <div>
                <p className="font-p fc-gray fs-2xs inline">Don't have an account? </p>
                <a className="font-h fc-black fs-2xs underline pointer" onClick={() => changePage()}>Create an account</a>
            </div>
        </div>
    )
}