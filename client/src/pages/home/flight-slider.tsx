import { useEffect, useState } from "react";
import FlightCard from "../../components/cards/flight-card"
import { APP_SETTINGS } from "../../settings/app-settings";
import styles from "../../styles/home.module.css"
import leftArrow from "../../assets/icon/leftWhite.png"
import rightArrow from "../../assets/icon/rightWhite.png"

export default function FlightSlider() {

    const [tickets, setTickets] = useState<any>([])
    const [slides, setSlides] = useState<any>([])
    const [slideIndex, setSlideIndex] = useState<number>(0)

    const [slideStyle1, setSlideStyle1] = useState<any>({});
    const [slideStyle2, setSlideStyle2] = useState<any>({});
    const [slideStyle3, setSlideStyle3] = useState<any>({});

    let slideStyle = [slideStyle1, slideStyle2, slideStyle3]
    let slideSetter = [setSlideStyle1, setSlideStyle2, setSlideStyle3]

    const nextSlide = async () => {

        if(slides.length > 0) {
            for(let i = 0; i < 3; i++) {
                slideSetter[i]({'marginLeft': '-100px', 'opacity' : '0%'})
                await new Promise(r => setTimeout(r, 200));
            }
            await new Promise(r => setTimeout(r, 250));
        }

        let slide = [];
        let limit = slideIndex + 3;
        let increment = 0
        for(let i = slideIndex; i < limit && i < tickets.length; i ++) {
            slide.push(tickets[i])
            increment++;
        }

        if(slideIndex + increment >= tickets.length) setSlideIndex(0);
        else setSlideIndex(slideIndex + increment)

        setSlides(slide);
        for(let i = 0; i < 3; i++) {
            slideSetter[i]({'marginLeft': '50px', 'opacity' : '0%'})
        }
        await new Promise(r => setTimeout(r, 100));

        for(let i = 0; i < 3; i++) {
            slideSetter[i]({'marginLeft': '0px', 'opacity' : '100%'})
            await new Promise(r => setTimeout(r, 200));
        }
    }

    useEffect(() => {
        (async () => {
            const response = await fetch(APP_SETTINGS.backend + "/api/get/flight", {
                method: 'GET',
            });
            const ticketData = await response.json();
            console.log(ticketData)
            var ticketsData = [...ticketData];
            
            setTickets(ticketsData);
        })()
    },[])

    useEffect(() => {
        if(slides.length == 0) {
            nextSlide();
        }
    }, [tickets])

    return (
        <>
        <p className="m-0 font-p fc-a2 font-medium">MOST POPULAR</p>
        <h1 className="font-main font-serif fc-a fs-3xl font-bold m-0">Flight Tickets</h1>
    
        <div className="w-100 h-60 flex-center mt-10">
            <div className={`${styles.filterNavigator} bg-col-a3 absolute flex-center justify-center`}>
            <div className="flex-col justify-between h-60 mr-5">
                    <div className="flex-col gap-10">
                        <div className="h-64p bg-col-a w-64p rounded-50 flex-center justify-center o-60 transition-2s hover-bg-col-a2">
                            <div className="h-56p bg-col-a3 w-56p rounded-50 flex-center justify-center" onClick={nextSlide}>
                                <img src={rightArrow} className="w-30" />
                            </div>
                        </div>

                        <div className="h-64p bg-col-a w-64p rounded-50 flex-center justify-center o-60 transition-2s hover-bg-col-a2">
                            <div className="h-56p bg-col-a3 w-56p rounded-50 flex-center justify-center" onClick={nextSlide}>
                                <img src={leftArrow} className="w-30" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex-end">
                            <p className="font-h fs-3xl m-0">01</p>
                            <p className="font-h fs-xl m-0 o-10 mb-1">02</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-80 h-s50 flex gap-m scroll-simple ml-20">
                {
                    slides.map((ticket : any, index : number) => {
                        return (
                            <FlightCard 
                                ticket={ticket}
                                className="w-25 h-100"
                                style={slideStyle[index]}
                            />
                        )
                    })
                }
            </div>

        </div>
        </>
    )
}