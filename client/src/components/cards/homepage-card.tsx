import { useEffect, useState } from "react"

export default function HomepageCard({imgSrc, title, subtitle} : any) {

    const [imgClass, setImgClass] = useState('w-s130 h-s130 o-50')

    useEffect(() => {
        setImgClass('w-100 h-screen o-100')
    }, [])

    return (
        <>
            <img src={imgSrc} className={`cover transition-slower ${imgClass}`}/>
            <div className="absolute w-100 h-s90 flex-col flex-center justify-center z-20 ">
                <p className="m-0 font-p fc-a2 font-medium">{subtitle}</p>
                <h1 className="font-main font-serif fc-white fs-4xl font-bold m-0">{title}</h1>
            </div>
        </>
    )
}