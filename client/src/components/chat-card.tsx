import { useEffect, useState } from 'react'
import styles from '../styles/ai.module.css'

export default function ChatCard({message, user = false} : any) {

    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, [])

    return (
        <div className={`${styles.chatBox} ${user ? styles.userChat : styles.botChat} font-main transition`} style={fadeIn ? {opacity:'100%', marginTop: '0px'} : {opacity : '0%', marginTop: '12px'}}>
            {message}
        </div>
    )
}