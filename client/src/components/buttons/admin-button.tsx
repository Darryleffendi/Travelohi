import styles from "../../styles/admin.module.css"

export default function AdminButton({img, title, onClick} : any) {
    return (
        <button className={`${styles.adminBtn}`} onClick={onClick}>
            <img src={img} alt="logo" className={`h-24p ${styles.adminBtnIcon}`}/>
            <h2 className='font-main font-medium fs-xs ml-2 h-op no-mobile'>{title}</h2>
        </button>
    )
}