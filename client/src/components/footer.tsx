import bg from "../assets/images/footer-bg.jpg"

export default function Footer({darkMode = false}) {
    return (
        <>
        {
            darkMode ? <></> : <img src={bg} className="w-100" />
        }
            <div className="w-100 h-s50 ">

            </div>
        </>
    )
}