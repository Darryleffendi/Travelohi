import styles from "../../styles/login.module.css";
import logo from "../../assets/logosimple.png"
import userIcon from "../../assets/icon/user.png";
import emailIcon from "../../assets/icon/email.png";
import dateIcon from "../../assets/icon/date.png";
import googleIcon from "../../assets/icon/google.png";
import { useEffect, useState } from "react";
import IAuthPageParameters from "../../interfaces/auth-page-param";

export default function RegisterSubpage({setSubpage, addNewData, newData, errorMessage} : IAuthPageParameters) {

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

    return (
        <div className="w-80 flex-center flex-col justify-between wrap h-80 transition" style={{opacity:`${opacity}`}}>

            <div className="flex-center flex-col justify-between wrap">
                <img alt="close" className="overlay-logo" src={logo} style={{height:"38px"}}/>
                <p className="font-h fc-black m-0 mt-1 fs-m">Welome to TraveloHI</p>
                <p className="font-p fc-gray m-0 mb-1 fs-2xs">Please enter your details to register</p>                
            </div>

            <div className="w-100">
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="email">Email</label>
                <input 
                    type="text" className={styles.overlayInput} id="email" 
                    style={{backgroundImage: `url(${emailIcon}`}} placeholder="Type your email"
                    value={newData.email} onChange={(e) => addNewData({email: e.target.value})}
                />
            </div>
            
            <div className="flex-center nowrap w-100 justify-between">
                <div className="w-48">
                    <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="first">First Name</label>
                    <input 
                        type="text" className={styles.overlayInput} id="first" 
                        style={{backgroundImage: `url(${userIcon}`}} placeholder="Type your first name"
                        value={newData.firstName} onChange={(e) => addNewData({firstName: e.target.value})}
                    />
                </div>
           
                <div className="w-48">
                    <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="last">Last Name</label>
                    <input 
                        type="text" className={styles.overlayInput} id="last" 
                        style={{backgroundImage: `url(${userIcon}`}} placeholder="Type your last name"
                        value={newData.lastName} onChange={(e) => addNewData({lastName: e.target.value})}
                    />
                </div>
            </div>

            <div className="w-100">
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="birth">Date of Birth</label>
                <input 
                    type="date" className={styles.overlayInput} id="birth" 
                    style={{backgroundImage: `url(${dateIcon}`}} placeholder="Type your DOB"
                    value={newData.dob.toString()} onChange={(e) => addNewData({dob: e.target.value})}                    
                />
            </div>
            
            <div className="w-100">
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="gender">Gender</label>
                <input 
                    type="text" className={styles.overlayInput} id="gender" 
                    style={{backgroundImage: `url(${emailIcon}`}} placeholder="Type your gender"
                    value={newData.gender} onChange={(e) => addNewData({gender: e.target.value})}    
                />
            </div>
            
            <p className="font-p fs-2xs fc-red mb-2" id="error_login">{errorMessage}</p>
            
            <button className={`${styles.signBtn} fs-xs font-h bg-col-a mt-2 pointer`} onClick={()=>changePage(2)}>Next</button>

            <div>
                <p className="font-p fc-gray fs-2xs inline">Already have an account? </p>
                <a className="font-h fc-black fs-2xs underline pointer" onClick={() => changePage(0)}>Sign in</a>
            </div>
        </div>
    )
}