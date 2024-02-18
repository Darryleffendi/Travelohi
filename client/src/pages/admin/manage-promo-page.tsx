
import { useEffect, useState } from "react"
import PromoCard from "../../components/cards/promo-card";
import IPromo from "../../interfaces/promo";
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/admin.module.css"

export default function ManagePromoPage({toggleLoading, setSuccess} : any) {

    /* ==== Display Promo ==== */

    const [promos, setPromos] = useState<Array<any>>([]);

    useEffect(() => {

        (async () => {
            const response = await fetch(APP_SETTINGS.backend + "/api/get/promo", {
                method: 'GET',
            });
            const data = await response.json();
            setPromos(data);
        })()
    }, [])

    /* ==== Update Promo ==== */ 

    const [data, setData] = useState<IPromo>({
        'title' : '',
        'discount' : 0,
        'promoCode' : '',
        'validFrom' : '',
        'validUntil' : '',
    });
    
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImageSrc, setUploadedImageSrc] = useState<any>(null);

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

    const submitForm = async (event : any) => {

        const formData = new FormData();
        if (uploadedImage) {
            formData.append('uploadedImage', uploadedImage);
        }

        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        
        const response = await fetch(APP_SETTINGS.backend + "/admin/addpromo", {
            method: 'POST',
            body: formData
        });

    }

    return (
        <>
        <div className="w-80 h-25 ml-5 mt-5 overflow-auto flex gap-10 scroll-simple">
            {
                promos.map((promo : any, index : number) => {
                    return (
                        <PromoCard promo={promo} width="40" key={index} className="flex-shrink-0"/>
                    )
                })
            }
        </div>
        <div className="w-80 h-100 mobile-flex-col">
            <div className="flex-col w-100 gap-10 mt-5 ml-5">
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="title">Title</label>
                <input name="title" value={data.title} onChange={handleChange} className={`${styles.input}`} placeholder="Title" id="title"/>
                
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="discount">Discount</label>
                <input name="discount" value={data.discount} onChange={handleChange} className={`${styles.input}`} placeholder="Discount" id="discount"/>
                
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="promocode">Promo Code</label>
                <input name="promoCode" value={data.promoCode} onChange={handleChange} className={`${styles.input}`} placeholder="Promo Code" id="promocode"/>
                
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="validfrom">Valid from</label>
                <input name="validFrom" value={data.validFrom} onChange={handleChange} className={`${styles.input}`} placeholder="Valid From" id="validfrom" type="date"/>
                
                <label className="font-p fc-gray fs-2xs text-left w-100" htmlFor="validuntil">Valid until</label>
                <input name="validUntil" value={data.validUntil} onChange={handleChange} className={`${styles.input}`} placeholder="Valid Until" id="validuntil" type="date"/>
            </div>

            <div className={`w-100 rounded bg-col-light mt-5 ml-5 flex-col flex-center justify-center ${uploadedImageSrc != null ? ' h-60 ' : ' h-30 '}`}>
                <div className="border-a-transparent w-80 rounded p-5p flex-center justify-between mb-2">
                    <input type="file" className={styles.fileInput} accept="image/*" onChange={handleFileChange}/>
                </div>
                {
                    uploadedImageSrc != null ? 
                        <div className="h-40 w-100 ml-5">
                            <PromoCard imgSrc={uploadedImageSrc} promo={data} width="80" />
                        </div>
                     : <></>
                }
                <button className="bg-col-gray o-70 h-op2 w-80 mt-2" onClick={submitForm}>Save Changes</button>
                <p className="font-p fc-a fs-3xs text-left w-80">*Updates data in the database</p>
            </div>
        </div>
        </>
    )
}