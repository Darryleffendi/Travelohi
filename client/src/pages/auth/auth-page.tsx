import React, { useCallback, useEffect, useState } from "react";
import styles from "../../styles/login.module.css";
import { validateAge, validateEmail, validateEmpty, validateGender, validateName, validatePassword } from "../../util/auth-validation";
import LoginSubpage from "./login-subpage";
import RegisterSubpage from "./register-subpage";
import SecuritySubpage from "./security-subpage";
import check from '../../assets/icon/checkmark.png'
import useUser from "../../contexts/user-context";
import { useNavigate } from "react-router-dom";
import ReCaptchaPopup from "./recapthca-popup";
import { APP_SETTINGS } from "../../settings/app-settings";
import useNavigator from "../../contexts/navigator-context";
import ProfilePicturePopup from "./profile-picture-popup";
import IUser from "../../interfaces/user";

export default function AuthPage({style} : any) {

    const defaultRegisterData : IUser = {
        email: '',
        firstName: '',
        lastName: '',
        dob: new Date(),
        gender: '',
        password: '',
        confirmPassword : '',
        securityQuestion : '',
        securityAnswer : '',
        emailList : false,
        imageUrl : null,
    }
    
    const defaultLoginData = {
        email: '',
        password: '',
    }

    const [subpage, setSubpage] = useState(10);

    const [registerData, setRegisterData] = useState(defaultRegisterData);
    const [loginData, setLoginData] = useState(defaultLoginData);

    const [regisError, setRegisError] = useState("");
    const [securityError, setSecurityError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const [showCaptcha, setShowCaptcha] = useState(false);
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [resolver, setResolver] = useState<any>(null);
    
    const [user, refreshUser] = useUser();

    const navigate = useNavigate();
    const changePage = useNavigator();

    const waitForCaptcha = useCallback(() => {
        setShowCaptcha(true);
        setCaptchaVerified(false);
        return new Promise((resolve : any) => {
          setResolver(() => resolve);
        });
      }, []);

    const waitForProfilePicture = useCallback(() => {
        setShowProfilePopup(true);
        setCaptchaVerified(false);
        return new Promise((resolve : any) => {
          setResolver(() => resolve);
        });
    }, [])

    const changeProfilePicture = (file : any) => {
        console.log("Changing profile picture to:", file);
        setRegisterData(prevState => ({...prevState, imageUrl: file}));
    }

    const addRegisterData = (newData : object) => {

        if('reset' in newData) {
            setRegisterData(defaultRegisterData);
            return;
        }

        setRegisterData(prevState => ({...prevState, ...newData}));
    }

    const addLoginData = (newData : object) => {

        if('reset' in newData) {
            setLoginData(defaultRegisterData);
            return;
        }

        setLoginData(prevState => ({...prevState, ...newData}));
    }

    const submitRegister = async () => {
        setRegisError("");
        setSecurityError("");

        if(!validateEmpty(registerData)) {
            setRegisError("Please fill in all of the fields");
            setSecurityError("");
            setSubpage(1);
            return;
        }
        if(!validateEmail(registerData.email)) {
            setRegisError("Invalid email");
            setSecurityError("");
            setSubpage(1);
            return;
        }
        if(!validateName(registerData.firstName) || !validateName(registerData.lastName)) {
            setRegisError("Invalid Name");
            setSecurityError("");
            setSubpage(1);
            return;
        }
        if(!validateAge(new Date().getFullYear() - new Date(registerData.dob).getFullYear())) {
            setRegisError("You must be over 13 years old to register");
            setSecurityError("");
            setSubpage(1);
            return;
        }
        if(!validateGender(registerData.gender)) {
            setRegisError("Invalid Gender");
            setSecurityError("");
            setSubpage(1);
            return;
        }
        if(!validatePassword(registerData.password)) {
            setRegisError("");
            setSecurityError("Password must be alphanumeric");
            setSubpage(2);
            return;
        }
        if(registerData.password !== registerData.confirmPassword) {
            setRegisError("");
            setSecurityError("Password does not match");
            setSubpage(2);
            return;
        }

        await waitForProfilePicture();

        setSubpage(12);
    }
    
    /* Register The Account Once Captcha Is Verified */
    useEffect(() => {
        (async () => {
            if (captchaVerified && registerData.imageUrl !== null) {
                console.log(registerData)
                const formData = new FormData();
        
                Object.keys(registerData).forEach(key => {
                    formData.append(key, registerData[key]);
                });
        
                const response = await fetch(APP_SETTINGS.backend + "/auth/register", {
                    method: 'POST',
                    body: formData
                });
        
                const data = await response.json()
                
                if("error" in data) {
                    setRegisError(data.error)
                    setSubpage(1)
                    return;
                }
                else {
                    console.log(data)
                }
                
                setSubpage(0);
                setShowSuccess(true);
                setRegisError("");
                setSecurityError("");
                addRegisterData({'reset' : true});
                await new Promise(r => setTimeout(r, 3000));
                setShowSuccess(false);
            }
        })()
    }, [captchaVerified, registerData])

    const submitLogin = async () => {

        await waitForCaptcha();
        setSubpage(10);

        const response = await fetch(APP_SETTINGS.backend + "/auth/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(loginData)
        });
        const data = await response.json()
        
        if("error" in data) {
            setSubpage(0);
            setLoginError(data.error);
            return;
        }
        else {
            console.log(data)
        }
        
        setSubpage(10);
        await new Promise(r => setTimeout(r, 350));
        refreshUser()
        changePage("/")
    }

    useEffect(() => {
        setRegisError("");
        setSecurityError("");

        if(user !== null) {
            if('notAuthenticated' in user) setSubpage(0);
        }
        else {
            navigate("/")
        }
    }, [user])

    useEffect(() => {   
        if(resolver && captchaVerified == true) {
            resolver();
            setShowCaptcha(false);
            setShowProfilePopup(false);
            setResolver(null);
        }
    }, [captchaVerified, resolver])

    return (
        <div className="bg-col-a w-screen h-screen flex-center justify-center overflow-hidden absolute">
            <div 
                className={`${styles.loginDiv} transition flex-center justify-center z-10 
                    ${ subpage == 0 ? styles.loginMode : styles.registerMode} ${subpage >= 10 ? styles.blankMode : ''}`}
            >
                
                {
                    (subpage === 0 || subpage === 10) ? (
                        <LoginSubpage setSubpage={setSubpage} submitForm={submitLogin} addNewData={addLoginData} newData={loginData} errorMessage={loginError}/>
                    ) : (
                        subpage === 1 ? (
                            <RegisterSubpage setSubpage={setSubpage} addNewData={addRegisterData} newData={registerData} errorMessage={regisError}/>
                        ) : (
                            (subpage === 2 || subpage === 12) ? (
                                <SecuritySubpage setSubpage={setSubpage} addNewData={addRegisterData} newData={registerData} submitForm={submitRegister} errorMessage={securityError}/>
                            ) : (
                                <></>
                            )
                        )
                    )
                }
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
                <h3 className="font-main fc-green ml-1">Successfully Registered Account</h3>
            </div>
            
            {
                showCaptcha == true ? (
                    <ReCaptchaPopup onCaptcha={() => setCaptchaVerified(true)}/>
                ) : showProfilePopup == true ? (
                    <ProfilePicturePopup  onCaptcha={() => setCaptchaVerified(true)} changeProfilePicture={changeProfilePicture}/>
                ) : <></>
            }
            
        </div>
    )
}