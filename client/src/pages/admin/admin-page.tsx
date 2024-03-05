import logo from "../../assets/logowhitesimple.png"
import shop from "../../assets/icon/product.png"
import plus from "../../assets/icon/plus.png"
import user from "../../assets/icon/user.png"
import hotel from "../../assets/icon/bed.png"
import check from '../../assets/icon/checkmark.png'
import airline from "../../assets/icon/plane.png"
import AdminButton from "../../components/buttons/admin-button"
import styles from "../../styles/admin.module.css"
import ManagePromoPage from "./manage-promo-page"
import AddPromoPage from "./add-promo-page"
import { useState } from "react"
import ManageHotelPage from "./manage-hotel-page"
import ManageFlightPage from "./manage-flight-page"
import ManageUserPage from "./manage-user-page"

export default function AdminPage() {

    const [subpage, setSubpage] = useState(0);
    const [show, setShow] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const toggleLoading = async (value : boolean) => {
        if(value) {
            setLoading(true);
            await new Promise(r => setTimeout(r, 10));
            setShowLoading(true);
        }
        else {
            setShowLoading(false);
            await new Promise(r => setTimeout(r, 400));
            setLoading(false);
        }
    }

    const setSuccess = async (successMsg : string) => {
        setSuccessMsg(successMsg);
        await new Promise(r => setTimeout(r, 3500));
        setSuccessMsg('');
    }

    let pageArray = [
        <ManagePromoPage toggleLoading={toggleLoading} setSuccess={setSuccess} />, 
        <AddPromoPage toggleLoading={toggleLoading} setSuccess={setSuccess} />,
        <ManageUserPage toggleLoading={toggleLoading} setSuccess={setSuccess}/>,
        <ManageHotelPage toggleLoading={toggleLoading} setSuccess={setSuccess} />,
        <ManageFlightPage toggleLoading={toggleLoading} setSuccess={setSuccess} />
    ]

    const changePage = async (page : number) => {
        
        setShow(false);
        await new Promise(r => setTimeout(r, 350));
        setSubpage(page);
        setShow(true);
    }
    
    return (
        <div className="w-screen h-screen flex-col overflow-hidden relative">
            <div className="w-screen h-64p bg-col-a flex-center justify-between z-5 shadow">
                <div className='flex-center nowrap w-30'>
                    <h2 className='font-main font-serif font-medium fs-m ml-5'>TraveloHI</h2>
                    <img src={logo} alt="logo" className='h-24p mb-2'/>
                </div>
                <div></div>
            </div>

            <div className="w-screen h-screen flex justify-between">
                <div className="w-20 h-screen bg-col-gray flex justify-center">
                    <div className="w-80 h-50 flex-col justify-between mt-2">
                        <AdminButton title="Manage Promo" img={shop} onClick={() => changePage(0)}/>
                        <AdminButton title="Add Promo" img={plus} onClick={() => changePage(1)}/>
                        <AdminButton title="Manage User" img={user} onClick={() => changePage(2)}/>
                        <AdminButton title="Manage Hotels" img={hotel} onClick={() => changePage(3)}/>
                        <AdminButton title="Manage Airlines" img={airline} onClick={() => changePage(4)}/>
                    </div>
                </div>

                <div className="transition w-80 overflow-auto scroll-simple bg-col-main" style={show ? {opacity : '100%'} : {opacity : '0%'}}>
                    {
                        pageArray[subpage]
                    }
                    
                </div>
            </div>

            <div 
                className="absolute w-screen h-64p bg-col-white z-100 flex-center transition self-flex-end" style={{'bottom' : (successMsg === '') ? '-64px' : '0px'}}
            >
                <img src={check} className="ml-5 h-50"/>
                <h3 className="font-main fc-green ml-1">{successMsg}</h3>
            </div>
                
            {
                isLoading ? (
                    <div className="w-screen h-screen absolute bg-col-a-transparent flex-center justify-center transition-2s" style={showLoading ? {opacity: '100%'} : {opacity: '0%'}}>
                        <div className={styles.loader}></div>
                    </div>
                ) : <></>
            }
        </div>
    )
}