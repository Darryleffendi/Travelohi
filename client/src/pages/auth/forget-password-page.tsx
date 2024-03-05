import React, { useCallback, useEffect, useState } from "react";
import styles from "../../styles/login.module.css";
import check from '../../assets/icon/checkmark.png'
import useUser from "../../contexts/user-context";
import { useNavigate } from "react-router-dom";
import { APP_SETTINGS } from "../../settings/app-settings";
import useNavigator from "../../contexts/navigator-context";
import IUser from "../../interfaces/user";
import logo from "../../assets/logosimple.png"
import emailIcon from "../../assets/icon/email.png";
import userIcon from "../../assets/icon/user.png";
import passwordIcon from "../../assets/icon/password.png";

export default function ForgetPasswordPage({style} : any) {

    const [newData, setNewData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        securityAnswer: "",
        securityQuestion: "",
    })

    const addNewData = (val : any) => {
        setNewData({...newData, ...val})
    }

    const [subpage, setSubpage] = useState(10);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [opacity, setOpacity] = useState('0%');

    useEffect(() => {
        const delaything = async () => {
            await new Promise(r => setTimeout(r, 5));
            setOpacity('100%');
        }
        setSubpage(0)
        delaything();
    }, [])

    const handleSubmit = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/auth/forget/password", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(newData)
        });
        const data = await response.json()

        if("error" in data) {
            setErrorMessage(data.error)
        } else {
            setShowSuccess(true);
            setErrorMessage("");
            navigate("/login")
            await new Promise(r => setTimeout(r, 3000));
            setShowSuccess(false);
        }
    }
    
    const navigate = useNavigator();

    return (
        <div className="bg-col-a w-screen h-screen flex-center justify-center overflow-hidden absolute">
            <div 
                className={`${styles.loginDiv} transition flex-center justify-center z-10 
                    ${ subpage == 0 ? styles.loginMode : styles.registerMode} ${subpage >= 10 ? styles.blankMode : ''}`}
            >
                <div className="w-80 flex-center flex-col justify-between gap-2xs h-80 mt--5 transition" style={{opacity:`${opacity}`}}>
                    <div className="flex-center flex-col justify-between wrap">
                        <img alt="close" className="overlay-logo" src={logo} style={{height:"38px"}}/>
                        <p className="font-h fc-black m-0 mt-1 fs-m">Forget Password</p>
                        <p className="font-p fc-gray m-0 mb-1 fs-2xs">Please enter your new password</p>
                    </div>

                    <div className="w-100">
                        <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="email">Email</label>
                        <input 
                            type="text" className={`${styles.overlayInput2} fs-2xs`} id="email" 
                            style={{backgroundImage: `url(${emailIcon}`}} placeholder="Type your email"
                            value={newData.email} onChange={(e) => addNewData({email: e.target.value})}
                        />
                    </div>

                    
                    <div className="w-100">
                        <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="password">Password</label>
                        <input 
                            type="password" className={`${styles.overlayInput2} fs-2xs`} id="password" 
                            style={{backgroundImage: `url(${passwordIcon})`}} placeholder="Type your password"
                            value={newData.password} onChange={(e) => addNewData({password: e.target.value})}                    
                        />
                    </div>

                    <div className="w-100">
                        <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="confirm">Confirm Password</label>
                        <input 
                            type="password" className={`${styles.overlayInput2} fs-2xs`} id="confirm" 
                            style={{backgroundImage: `url(${passwordIcon})`}} placeholder="Type your password"
                            value={newData.confirmPassword} onChange={(e) => addNewData({confirmPassword: e.target.value})}                    
                        />
                    </div>

                    <div className="w-100">
                        <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="question">Security Question</label>
                        <select 
                            className={`${styles.overlayInput2} fs-2xs`} id="question" 
                            onChange={(e) => addNewData({'securityQuestion' : e.target.value})}
                            defaultValue={"Default"}
                        >
                            <option disabled={true} value={'Default'}>
                                Choose your security question
                            </option>
                            <option value={"What is your favorite childhood pet's name?"}>
                                What is your favorite childhood pet's name?
                            </option>
                            <option value={"In which city where you born?"}>
                                In which city where you born?
                            </option>
                            <option value={"What is the name of your favorite book or movie?"}>
                                What is the name of your favorite book or movie?
                            </option>
                            <option value={"What is the name of the elementary school you attended?"}>
                                What is the name of the elementary school you attended?
                            </option>
                            <option value={"What is the model of your first car?"}>
                                What is the model of your first car?
                            </option>
                        </select>
                    </div>

                    <div className="w-100">
                        <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="answer">Security Answer</label>
                        <input 
                            type="text" className={`${styles.overlayInput2} fs-2xs`} id="answer" 
                            style={{backgroundImage: `url(${userIcon}`}} placeholder="Type your answer"
                            value={newData.securityAnswer} onChange={(e) => addNewData({securityAnswer: e.target.value})}
                        />
                    </div>
                    <a className="font-p fc-gray fs-2xs w-100 m-0 text-right no-deco pointer" onClick={() => navigate("/login")}>Remember Password?</a>

                    <p className="font-p fs-2xs fc-red mb-1" id="error_login">{errorMessage}</p>
                    <button className={`${styles.signBtn} fs-xs font-h bg-col-a pointer mb-2`} onClick={handleSubmit}>Change Password</button>
                
                </div>
            </div>
            
            <div 
                className="absolute flex-column wrap justify-center flex-center transition-2s"
                style={subpage >= 10 ? {opacity:'100%'} : {opacity:'0%'}}
            >
                <div className={styles.loader}></div>
            </div>

            <div 
                className="absolute w-100 h-64p bg-col-white z-100 flex-center transition self-flex-end" style={{'marginBottom' : showSuccess ? '0px' : '-64px'}}
            >
                <img src={check} className="ml-5 h-50"/>
                <h3 className="font-main fc-green ml-1">Successfully Changed Password</h3>
            </div>
            
        </div>
    )
}