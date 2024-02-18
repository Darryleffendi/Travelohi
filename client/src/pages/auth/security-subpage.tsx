import styles from "../../styles/login.module.css";
import logo from "../../assets/logosimple.png"
import userIcon from "../../assets/icon/user.png";
import emailIcon from "../../assets/icon/email.png";
import passwordIcon from "../../assets/icon/password.png";
import googleIcon from "../../assets/icon/google.png";
import { useEffect, useState } from "react";
import IAuthPageParameters from "../../interfaces/auth-page-param";

export default function SecuritySubpage({setSubpage, addNewData, newData, submitForm, errorMessage} : IAuthPageParameters) {

    const [opacity, setOpacity] = useState('0%');

    useEffect(() => {
        const delaything = async () => {
            await new Promise(r => setTimeout(r, 5));
            setOpacity('100%');
        }

        delaything();
    }, [])

    const changePage = async (n : number) => {
        setOpacity('0%');

        await new Promise(r => setTimeout(r, 350));

        setSubpage(n);
    }

    const addData = (newdata : object) => {
        addNewData({...newData, ...newdata});
    }

    return (
        <div className="w-80 flex-center flex-col justify-between wrap h-80 transition" style={{opacity:`${opacity}`}}>

            <div className="flex-center flex-col justify-between wrap">
                <img alt="close" className="overlay-logo" src={logo} style={{height:"38px"}}/>
                <p className="font-h fc-black m-0 mt-1 fs-m">Secure your Account</p>
                <p className="font-p fc-gray m-0 mb-2 fs-2xs">Please enter your security details</p>                
            </div>

            <div className="w-100">
                <label className="font-p fc-gray fs-2xs text-left w-100 mt-2" htmlFor="password">Password</label>
                <input 
                    type="password" className={styles.overlayInput} id="password" 
                    style={{backgroundImage: `url(${passwordIcon})`}} placeholder="Type your password"
                    value={newData.password} onChange={(e) => addData({password: e.target.value})}                    
                />
            </div>

            <div className="w-100">
                <label className="font-p fc-gray fs-2xs text-left w-100 mt-2" htmlFor="confirm">Confirm Password</label>
                <input 
                    type="password" className={styles.overlayInput} id="confirm" 
                    style={{backgroundImage: `url(${passwordIcon})`}} placeholder="Type your password"
                    value={newData.confirmPassword} onChange={(e) => addData({confirmPassword: e.target.value})}
                />
            </div>
            
            <div className="w-100">
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="question">Security Question</label>
                <select 
                    className={styles.overlayInput} id="question" 
                    onChange={(e) => addData({'securityQuestion' : e.target.value})}
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
                    type="text" className={styles.overlayInput} id="answer" 
                    style={{backgroundImage: `url(${userIcon}`}} placeholder="Type your answer"
                    value={newData.securityAnswer} onChange={(e) => addData({securityAnswer: e.target.value})}
                />
            </div>

            <div className="flex-center w-100 mt-2">
                <input 
                    type="checkbox" id="agree" 
                    checked={newData.emailList} onChange={(e) => addData({emailList: e.target.checked})}
                />
                <label className="font-p fs-2xs fc-gray text-left w-80 ml-1" htmlFor="agree">I want to receive newsletters and emails</label>
            </div>
            
            <p className="font-p fs-2xs fc-red mb-2" id="error_login">{errorMessage}</p>
            
            <button className={`${styles.signBtn} fs-xs font-h bg-col-a pointer mb-2`} onClick={() => { if(submitForm) submitForm()}}>Register</button>

            <div>
                <p className="font-p fc-gray fs-2xs inline">Already have an account? </p>
                <a className="font-h fc-black fs-2xs underline pointer" onClick={() => changePage(0)}>Sign in</a>
            </div>
        </div>
    )
}