import { useEffect, useState } from "react";
import { APP_SETTINGS } from "../settings/app-settings"

export default function SplitSlider({images} : any) {

    const [backCarouselImage, setBackCarouselImage] = useState();
    const [frontCarouselImage, setFrontCarouselImage] = useState(images[0]);

    const [frontCarouselStyle, setFrontCarouselStyle] = useState({});
    const [backCarouselStyle, setBackCarouselStyle] = useState({});

    let size = images.length
    let imgIndex = -1;

    const nextPage = async () => {

        imgIndex += 1;
        if(imgIndex >= size) imgIndex = 0;

        setBackCarouselImage(images[imgIndex]);

        setFrontCarouselStyle({width: "0%"})
        
        await new Promise(r => setTimeout(r, 600));

        setFrontCarouselStyle({display: "none"})
        await new Promise(r => setTimeout(r, 20));
        setFrontCarouselImage(images[imgIndex]);
        setFrontCarouselStyle({width: "100%"})
        await new Promise(r => setTimeout(r, 20));
        setFrontCarouselStyle({display: "block"})

        setTimeout(() => {
            nextPage();
        }, 4000);
    }

    useEffect(() => {
        if(imgIndex < 0) {
            nextPage();
        }
    }, [])

    return (
        <div className="w-100 h-100 overflow-hidden flex-center justify-start relative">
            <div className="w-100 h-100 bg-col-a3 absolute transition-2" style={backCarouselStyle} >
                <img className="w-100 h-100 cover o-60 absolute z--5" src={APP_SETTINGS.backend + "/" + backCarouselImage}/>
            </div>
            <div className="w-100 h-100 bg-col-a3 absolute transition-2" style={frontCarouselStyle} >
                <img className="w-100 h-100 cover o-60 absolute z-5" src={APP_SETTINGS.backend + "/" + frontCarouselImage}/>
            </div>
        </div>
    )
}