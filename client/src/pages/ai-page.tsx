import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/ai.module.css";

export default function AiPage() {

    const [pageMode, setPageMode] = useState(0);

    const location = useLocation();

    console.log(location.pathname)

    useEffect(() => {
        if(location.pathname === "/ai") {
            setPageMode(1)
        } else {
            setPageMode(0)
        }

        return(() => {
            setPageMode(0)
        })
    }, [location])

    let styleClass = (pageMode == 0) ? styles.blankMode : styles.uploadMode;

    return (
        <div className="bg-col-a w-screen h-screen flex-col flex-center justify-center">
            <div className="w-screen h-84p flex-shrink-0 mb-2"></div>
            <div className={`${styles.loginDiv} ${styleClass} transition-2`}>
                <div>
                    
                </div>
                <input type="file" className={styles.fileInput} accept="image/*"/>
            </div>
        </div>
    )
}