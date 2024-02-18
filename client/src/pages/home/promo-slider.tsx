import { useEffect, useState } from "react";
import PromoCard from "../../components/cards/promo-card";
import PromoCardLarge from "../../components/cards/promo-card-large";
import { APP_SETTINGS } from "../../settings/app-settings";


export default function PromoSlider() {

    const [promos, setPromos] = useState<Array<any>>([]);
    const [mainPromo, setMainPromo] = useState<Array<any>>([]);
    const [slides, setslides] = useState<Array<any>>([]);
    const [slideIndex, setSlideIndex] = useState<number>(0)

    const [leftClass, setLeftClass] = useState<string>('w-10');
    const [rightClass, setRightClass] = useState<string>('w-0');
    const [mainCardStyles, setMainCardStyles] = useState<any>({height: 'calc(100% - 24px)', marginTop: '24px'})

    const [slideStyle1, setSlideStyle1] = useState<any>({'marginLeft': '-500px', 'opacity' : '0%'});
    const [slideStyle2, setSlideStyle2] = useState<any>({'marginLeft': '-500px', 'opacity' : '0%'});

    const [opacity, setOpacity] = useState("0%");

    let slideStyle = [slideStyle1, slideStyle2]
    let slideSetter = [setSlideStyle1, setSlideStyle2]

    const nextSlide = async () => {

        setMainCardStyles({height: 'calc(100% + 24px)', marginTop: '0px'})
        await new Promise(r => setTimeout(r, 100));

        for(let i = 0; i < 2; i++) {
            slideSetter[i]({'marginLeft': '-500px', 'opacity' : '0%'})
            await new Promise(r => setTimeout(r, 200));
        }
        await new Promise(r => setTimeout(r, 200));

        let slide = [];
        let limit = slideIndex + 2;
        let increment = 0;
        for(let i = slideIndex; i < limit && i < promos.length; i ++) {
            slide.push(promos[i])
            increment++;
        }

        if(slideIndex + increment >= promos.length) setSlideIndex(0);
        else setSlideIndex(slideIndex + increment)

        setslides(slide);
        for(let i = 0; i < 2; i++) {
            slideSetter[i]({'marginLeft': '0px', 'opacity' : '100%'})
            await new Promise(r => setTimeout(r, 200));
        }
        setMainCardStyles({height: 'calc(100% - 24px)', marginTop: '24px'})
    }

    const hoverHandler = async (hovered : boolean) => {
        if(!hovered) {
            setRightClass('w-0');
            await new Promise(r => setTimeout(r, 100));
            setLeftClass('w-10');
        }
        else {
            setLeftClass('w-0');
            await new Promise(r => setTimeout(r, 100));
            setRightClass('w-10 ml-1');
        }
    }

    useEffect(() => {
        (async () => {
            const response = await fetch(APP_SETTINGS.backend + "/api/get/promo", {
                method: 'GET',
            });
            const data = await response.json();

            let maxIndex = 0;
            if(Array.isArray(data)) {
                for(let i = 0; i < data.length; i++) {
                    if(data[i].discount > data[maxIndex].discount) {
                        maxIndex = i;
                    }
                }
                setMainPromo(data[maxIndex])
                setPromos(data.filter((_, index) => index !== maxIndex))
            }
        })()
    })

    useEffect(() => {
        if(slides.length == 0) {
            (async () => {
                setOpacity("0%")
                nextSlide();
                await new Promise(r => setTimeout(r, 100));
                setOpacity("100%")
            })()
        }
    }, [promos])

    return (
        <>
        <p className="m-0 font-p fc-a2 font-medium">LIMITED TIME ONLY</p>
        <h1 className="font-main font-serif fc-a fs-3xl font-bold mt-0">Special Offers</h1>
        <div className="w-100 h-60 flex-center justify-center transition-2" style={{opacity: opacity}}>
            {
            slides.length == 0 ? <></> : (
                <>
                    <div className="w-45 h-s60 mr-5 flex-col">
                        <PromoCardLarge 
                            promo={mainPromo} 
                            width="100"
                            style={mainCardStyles}
                        />
                    </div>
                    
                    <div className="w-25 h-s60 flex-col flex">

                        <div 
                            className="h-24p w-100 flex-center justify-end transition pointer"
                            onMouseEnter={() => hoverHandler(true)}
                            onMouseLeave={() => hoverHandler(false)}
                            onClick={nextSlide}
                        >
                            <div className={`h-1p bg-col-a mr-1 transition ${leftClass}`}></div>
                            <p className="m-0 font-p font-serif fc-a text-narrow transition-2">Next Promo</p>
                            <div className={`h-1p bg-col-a transition ${rightClass}`}></div>
                        </div>

                        <div className="w-100 h-100 flex-col gap-xs">
                        {
                            slides.map((promo, index) => {
                                return (
                                    <div className="w-100 h-50">
                                        <PromoCard 
                                            promo={promo}                                
                                            width="100" key={index} className="flex-shrink-0 shadow"
                                            style={slideStyle[index]}
                                        />
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </>
            )}
        </div>
        </>
    )
}