
import { useEffect, useState } from "react"
import PromoCard from "../../components/cards/promo-card";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/admin.module.css"

export default function ManageUserPage({toggleLoading, setSuccess} : any) {

    const [data, setData] = useState<any>({
        'subject' : '',
        'body' : '',
    });
    
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImageSrc, setUploadedImageSrc] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [users, setUsers] = useState<Array<any>>([]);

    const handleFileChange = (event : any) => {
        setUploadedImage(event.target.files[0]);
        setUploadedImageSrc(URL.createObjectURL(event.target.files[0]))
    }

    const handleChange = (e : any) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const fetchUser = async () => {
        const response = await fetch(APP_SETTINGS.backend + "/admin/getusers", {
            method: 'GET',
        });
        const data = await response.json();
        setUsers(data)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const submitForm = async (event : any) => {

        toggleLoading(true);
        
        const response = await fetch(APP_SETTINGS.backend + "/admin/sendemail", {
            method: 'POST',
            body: JSON.stringify({
                subject: data.subject,
                body: data.body,
            }),
            headers: { 'Content-Type': 'application/json' },
        });
        const respData = await response.json();
        if("error" in respData) {
            setErrorMessage(respData.error)
        }
        else {
            setErrorMessage("")
            setSuccess()
        }

        toggleLoading(false);
    }

    const banUser = async (userId : any, banned : boolean) => {
        toggleLoading(true);
        const formData = new FormData();
        formData.append('ID', userId);
        formData.append('banned', banned.toString());
        const response = await fetch(APP_SETTINGS.backend + "/admin/banuser", {
            method: 'POST',
            body: formData
        });
        const respData = await response.json();
        if("error" in respData) {
            setErrorMessage(respData.error)
        }
        else {
            setErrorMessage("")
            setSuccess()
            fetchUser()
        }
        toggleLoading(false);
    }

    return (
        <div className="w-90 h-100 mobile-flex-col justify-center">
            <div className="flex-col w-40 gap-10 mt-5 ml-5">
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="subject">Email Subject</label>
                <input name="subject" value={data.subject} onChange={handleChange} className={`${styles.input}`} placeholder="Subject" id="subject"/>
                
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="body">Email Body</label>
                <textarea name="body" value={data.body} onChange={handleChange} className={`${styles.inputTall}`} placeholder="Body" id="body"/>
                
               
                <p className="font-p fs-2xs fc-red mb-1" id="error_login">{errorMessage}</p>
                <button className="bg-col-a2 fc-white o-70 h-op2 w-100 mt-2" onClick={submitForm}>Send Email</button>
                <p className="font-p fc-a fs-3xs text-left w-100">*Sending email to subscribed acccounts</p>
            </div>

            <div className={`w-100 rounded bg-col-light mt-5 ml-5 flex-col flex-center h-70 overflow-auto scroll-simple`}>
                <div className="flex-center justify-between w-90 mt-2">
                    <p className="w-20 font-medium fs-xs">Name</p>
                    <p className="w-40 font-medium fs-xs">Email</p>
                    <p className="w-30 font-medium fs-xs">Banned</p>
                </div>

                <div className="h-0 w-90 border-bottom border-a-transparent"></div>
                {
                    users.map((u) => {
                        return (
                            <div className="flex-center justify-between w-90 mt-2">
                                <p className="w-20 font-medium fs-xs overflow-hidden o-50">{u.firstName}</p>
                                <p className="w-40 font-medium fs-xs overflow-hidden o-50">{u.email}</p>
                                <div className="w-30"> 
                                {
                                    u.banned ? (
                                        <div 
                                            className="bg-col-red-2 w-80 h-32p flex-center justify-center rounded o-60 h-op3 pointer"
                                            onClick={() => banUser(u.ID, false)}
                                        >
                                            <p className="font-medium fs-xs m-0 fc-white">Banned</p>
                                        </div>
                                    ) : (
                                        <div 
                                            className="bg-col-a2 w-80 h-32p flex-center justify-center rounded o-60 h-op3 pointer"
                                            onClick={() => banUser(u.ID, true)}
                                        >
                                            <p className="font-medium fs-xs m-0 fc-white">Not Banned</p>
                                        </div>
                                    )
                                }
                                </div>

                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}