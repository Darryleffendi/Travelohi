import { ReactElement, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { APP_SETTINGS } from "../settings/app-settings";
import departure from "../assets/icon/departure.png"
import arrival from "../assets/icon/arrival.png"
import check from '../assets/icon/checkmark.png'
import date from "../assets/icon/date.png"
import plane from "../assets/icon/plane.png"
import seat from "../assets/icon/seat.png"
import wallet from "../assets/icon/wallet.png"
import baggageIcon from "../assets/icon/baggage.png"
import styles from "../styles/flight.module.css"
import useUser from "../contexts/user-context";
import useNavigator from "../contexts/navigator-context";

export default function FlightDetails() {

    const { id } = useParams();
    const [flight, setFlight] = useState<any>();
    const [headerTransform, setHeaderTransform] = useState("translateY(0px)")
    const [headerTextTransform, setHeaderTextTransform] = useState("translateY(0px)")
    const [chart, setChart] = useState<any>([]);

    const [selectedSeats, setSelectedSeats] = useState<Array<Seat>>([]);
    const [baggage, setBaggage] = useState<any>(0);
    const [user, refreshUser] = useUser();
    const navigate = useNavigator();

    const [showSuccess, setShowSuccess] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [isSticky2, setIsSticky2] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const observerTargetRef = useRef(null);
    const observerTargetRef2 = useRef(null);

    const [btnHovered, setBtnHovered] = useState(false);

    const alphabet = "ABCDEFGHIJ"

    let seats = ""
    for(let i = 0; i < selectedSeats.length; i++) {
        if(i > 0) {
            seats += ","
        }
        seats += " " + alphabet[selectedSeats[i].columnIndex] + (selectedSeats[i].rowIndex + 1) 
    }

    const handleScroll = async () => {
        let scrollTop = window.pageYOffset;
        if(scrollTop < 1800) {            
            setHeaderTransform(`translateY(${scrollTop * 0.5}px)`);
            setHeaderTextTransform(`translateY(${scrollTop * 0.35}px)`);
        }
    }
    
    const checkSelectedSeat = (seat : any) : boolean => {
        for(let i = 0; i < selectedSeats.length; i++) {
            if(selectedSeats[i].columnIndex === seat.columnIndex && selectedSeats[i].rowIndex === seat.rowIndex) {
                return true;
            }
        }
        return false;
    }

    const selectSeat = (seat : Seat) => {
        let arr = [...selectedSeats];

        for(let i = 0; i < arr.length; i++) {
            if(arr[i].rowIndex === seat.rowIndex && arr[i].columnIndex === seat.columnIndex) {
                arr.splice(i, 1);
                setSelectedSeats(arr)
                return;
            }
        }

        arr.push(seat);
        setSelectedSeats(arr)
    }

    const handleSubmit = async () => {
        if(user != null && "notAuthenticated" in user) {
            navigate("/login")
            return;
        }

        const response = await fetch(APP_SETTINGS.backend + "/api/add/seat/cart", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'seats' : JSON.stringify(selectedSeats), 
                'userId' : user?.ID, 
                'flightId' : flight.ID,
                'baggage' : baggage
            })
        });
        const data = await response.json();

        if("error" in data) {
            setErrorMessage(data.error)
            return;
        }

        setErrorMessage("")
        setShowSuccess(true);
        setSelectedSeats([]);
        setBaggage(0);
        await new Promise(r => setTimeout(r, 3000));
        setShowSuccess(false);
    }

    useEffect(() => {
        (async () => {
            const response = await fetch(APP_SETTINGS.backend + "/api/get/flight/from/id", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'id': id})
            });
            const data = await response.json();
            data.seatingChart = JSON.parse(data.seatingChart)

            for(let i = 0; i < data.seatingChart.length; i++) {
                for(let j = 0; j < data.seatingChart[i].length; j++) {
                    data.seatingChart[i][j] = {
                        rowIndex: i,
                        columnIndex: j,
                        ID: data.seatingChart[i][j]
                    }
                }
            }
            console.log(data)
            setFlight(data);
        })()

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [id])

    useEffect(() => {
        if(flight === undefined) return;

        let chartData : Array<Array<any>> = []
        flight.seatingChart.forEach((row : Array<any>, i : number) => {

            let rowElement : Array<any> = [];
    
            row.forEach((seat, j) => {
    
                if(row.length == 6 && j == 3) {
                    rowElement.push (<div className={`w-40p flex-center justify-center ${styles.seat}`}>{i + 1}</div>)
                }
    
                if(row.length == 10 && (j == 3 || j == 7)) {
                    rowElement.push (<div className={`w-40p flex-center justify-center fc-a o-30 font-medium ${styles.seat}`}>{i + 1}</div>)
                }

                let seatClass = ""
                let onClick = () => selectSeat({rowIndex: seat.rowIndex, columnIndex: seat.columnIndex})

                if (checkSelectedSeat(seat)) {
                    seatClass = "bg-col-a2"
                }
                else if(seat.ID == 1) {
                    seatClass = "bg-col-a h-op2 o-60"
                }
                else {
                    seatClass = "bg-col-a o-20"
                    onClick = () => {}
                }
                
                rowElement.push(
                    <div 
                        className={`w-40p h-40p flex-center justify-center mb-1 rounded ${seatClass} ${styles.seat}`}
                        onClick={() => onClick()}
                    >
                        <p className="m-0 fc-white font-medium fs-s">
                            {"" + alphabet[j] + (i + 1)}
                        </p>
                    </div>
                )
            }); 
            chartData.push(rowElement)
        });
        setChart(chartData)
    }, [selectedSeats, flight])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsSticky(!entry.isIntersecting);
            }
        );

        const observer2 = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsSticky2(!entry.isIntersecting);
            }
        );
      
        if (observerTargetRef.current) {
            observer.observe(observerTargetRef.current);
        }

        if (observerTargetRef2.current) {
            observer2.observe(observerTargetRef2.current);
        }

        return () => {
            if (observerTargetRef.current) {
                observer.unobserve(observerTargetRef.current);
            }
            if (observerTargetRef2.current) {
                observer2.unobserve(observerTargetRef2.current);
            }
        }
    }, [flight])

    if(flight == undefined || flight == null) {
        return <></>
    }

    let imgSrc = flight.arrivalCity.imageUrl.trim().replace('.', '')

    let price = flight.price * selectedSeats.length

    if(!isNaN(baggage)) {
        price += Number(baggage)
    }

    return (
        <div>
            <div className="w-100 h-screen bg-col-a3 relative overflow-hidden">
                <div className="w-100 h-100 flex-center justify-center absolute z-10">
                    <p className="m-0 font-h font-serif fs-4xl font-medium fc-white" style={{transform: headerTextTransform}}>{flight.arrivalCity.name}</p>

                    <div className="w-screen absolute bottom-0 mb-2 shadow-light flex-col flex-center">
                        <div className="w-screen">
                            <div className="w-100 h-6p" ref={observerTargetRef}></div>
                            <div className="w-100 h-48p"></div>
                            <div className="w-100 h-6p" ref={observerTargetRef2}></div>
                            <div className="w-100 h-24p"></div>
                        </div>
                        <div className={`w-90 h-84p bg-col-white flex-center justify-between transition-2 shadow-light ${isSticky ? "fixed top-0" : "absolute"} `}>
                            <div className="h-100 w-100 flex-col justify-center flex-center border-a-transparent border-right">
                                <p className="m-0 font-p fc-a o-70 fs-xs w-80">{flight.plane.airline.name}</p>
                                <div className="flex-center w-80 gap-xs">
                                    <img src={flight.plane.airline.imageUrl.trim().replace('.', '')} className="w-24p"/>
                                    <p className="m-0 font-p fc-a2 font-medium fs-s w-80">{flight.flightNumber}</p>
                                </div>
                            </div>
                            <div className="h-100 w-100 flex-col justify-center flex-center border-a-transparent border-right">
                                <p className="m-0 font-p fc-a o-70 fs-xs w-80">From</p>
                                <div className="flex-center w-80 gap-xs">
                                    <img src={departure} className="w-18p"/>
                                    <p className="m-0 font-p fc-a2 font-medium fs-s w-80">{flight.departureCity.name}</p>
                                </div>
                            </div>
                            <div className="h-100 w-100 flex-col justify-center flex-center border-a-transparent border-right">
                                <p className="m-0 font-p fc-a o-70 fs-xs w-80">To</p>
                                <div className="flex-center w-80 gap-xs">
                                    <img src={arrival} className="w-18p"/>
                                    <p className="m-0 font-p fc-a2 font-medium fs-s w-80">{flight.arrivalCity.name}</p>
                                </div>
                            </div>
                            <div className="h-100 w-100 flex-col justify-center flex-center border-a-transparent border-right no-mobile">
                                <p className="m-0 font-p fc-a o-70 fs-xs w-80">Departure</p>
                                <div className="flex-center w-80 gap-xs">
                                    <img src={date} className="w-18p"/>
                                    <p className="m-0 font-p fc-a2 font-medium fs-s w-80">{new Date(flight.departureTime).toLocaleDateString() + ", " + formatTime(new Date(flight.departureTime))}</p>
                                </div>
                            </div>
                            <div className="h-100 w-100 flex-col justify-center flex-center border-a-transparent border-right no-mobile">
                                <p className="m-0 font-p fc-a o-70 fs-xs w-80">Arrival</p>
                                <div className="flex-center w-80 gap-xs">
                                    <img src={date} className="w-18p"/>
                                    <p className="m-0 font-p fc-a2 font-medium fs-s w-80">{new Date(flight.arrivalTime).toLocaleDateString() + ", " + formatTime(new Date(flight.arrivalTime))}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <img className="w-100 h-100 cover object-top o-70 z--5" src={imgSrc} style={{transform: headerTransform}} />
            </div>
            <div className="w-screen bg-col-main h-s15"></div>
            <div className="w-screen bg-col-main flex justify-center">
                <div className="w-40">
                    <div 
                        className="w-s35 h-s70 flex-col flex-center justify-start bg-col-white shadow-light z-1 mw-s60"
                        style={{position: isSticky2 ? "fixed" : "relative", top: isSticky2 ? "calc(32px + 15vh)" : ""}}
                    >
                        {/* Dotted Line */}
                        <div className="w-90 absolute">
                            <div className="w-100 mt-2 flex-center justify-start">
                                <div className="w-20 flex-col flex-center flex-shrink-0"></div>

                                <div className="w-20p flex-shrink-0 flex justify-center">
                                    <div className="h-s60 border-left border-a" style={{borderStyle: "dashed", borderWidth: "0px 2px 0px 0px"}}></div>
                                </div>

                                <div className="w-70 ml-2 flex-col flex-start"></div>
                            </div>
                        </div>

                        {/* Departure Details */}
                        <div className="w-90 mt-2 bg-col-white z-1">
                            <div className="w-100 h-64p flex-center justify-start">
                                <div className="w-20 flex-col flex-center flex-shrink-0">
                                    <p  className="fs-s m-0 fc-a font-bold">{formatTime(new Date(flight.departureTime))}</p>
                                    <p  className="fs-2xs m-0 fc-a font-medium o-60">{formatDate(new Date(flight.departureTime))}</p>
                                </div>

                                <div className="w-20p h-20p bg-col-a rounded-50 flex-shrink-0"></div>

                                <div className="w-70 ml-2 flex-col flex-start">
                                    <p  className="fs-s m-0 fc-a font-bold">{flight.departureCity.airportName} ({flight.departureCity.airportCode})</p>
                                    <p  className="fs-2xs m-0 fc-a font-medium o-60">{flight.departureCity.name}, {flight.departureCity.Country.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="w-90 mt-2 z-1">
                            <div className="w-100 h-78p flex-center justify-start">
                                <div className="w-20 flex-col flex-center flex-shrink-0"></div>

                                <div className="w-20p h-20p flex-shrink-0"></div>

                                <div className="w-70 ml-2 flex-col flex-start bg-col-white">
                                    <div className="flex gap-10 w-100">
                                        <img src={seat} className="w-18p contain" />
                                        <p className="m-0 fs-xs font-medium o-80">Seats: {seats}</p>
                                    </div>
                                    <div className="flex gap-10 w-100">
                                        <img src={plane} className="w-18p contain o-30" />
                                        <p className="m-0 fs-xs font-medium o-80">{flight.plane.planeModel.manufacturer} {flight.plane.planeModel.name}</p>
                                    </div>
                                    <div className="flex gap-10 w-100">
                                        <img src={wallet} className="w-16p contain o-50" />
                                        <p className="m-0 fs-xs font-medium o-80">Price per seat: ${flight.price}</p>
                                    </div>

                                    <div className="mt-1">
                                        <input 
                                            type="number" className={`${styles.overlayInput} fs-2xs`} id="email" 
                                            style={{backgroundImage: `url(${baggageIcon}`}} placeholder="Input Baggage (in kg)"
                                            value={baggage > 0 ? baggage : ''} onChange={(e) => setBaggage(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Arrival Details */}
                        <div className="w-90 mt-2 bg-col-white z-1">
                            <div className="w-100 h-64p flex-center justify-start">
                                <div className="w-20 flex-col flex-center flex-shrink-0">
                                    <p  className="fs-s m-0 fc-a font-bold">{formatTime(new Date(flight.arrivalTime))}</p>
                                    <p  className="fs-2xs m-0 fc-a font-medium o-60">{formatDate(new Date(flight.arrivalTime))}</p>
                                </div>

                                <div className="w-20p h-20p bg-col-a rounded-50 flex-shrink-0"></div>

                                <div className="w-70 ml-2 flex-col flex-start">
                                    <p  className="fs-s m-0 fc-a font-bold">{flight.arrivalCity.airportName} ({flight.arrivalCity.airportCode})</p>
                                    <p  className="fs-2xs m-0 fc-a font-medium o-60">{flight.arrivalCity.name}, {flight.arrivalCity.Country.name}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-90 bg-col-white h-100 z-1"></div>

                        <div className="absolute bottom-0 w-90 flex-col">
                            <p className="mb-0 fc-red fs-xs z-5">{errorMessage}</p>
                            <div className="h-64p w-100 bg-col-white z-5 flex-center justify-between mb-1">
                                <div>
                                    <p className="fs-xl fc-a2 font-bold m-0">${price}</p>
                                    <p className="mt--1 m-0 fs-3xs o-30 h-op3">Baggage costs $1/kg</p>
                                </div>

                                <div 
                                    className="w-40"
                                    onMouseEnter={() => setBtnHovered(true)} onMouseLeave={() => setBtnHovered(false)}
                                >
                                    <div className={`absolute flex-center transition-3 pointer ${btnHovered ? "mt--5 o-100" : "mt--1 o-0"}`}>
                                        <p className="m-0 font-serif fs-xs o-50">Or click here to&nbsp;</p>
                                        <p className="m-0 font-serif fs-xs fc-a2"> buy now</p>
                                    </div>
                                    <button 
                                        className="w-100 h-70 bg-col-a2 flex-center justify-center font-bold fc-white rounded o-70 h-op2 pointer mw-50"
                                        onClick={handleSubmit}
                                    >
                                        Check Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.chart} mb-10 no-mobile`}>
                {
                    chart.map((row : any, i : number) => {
                        return (
                            <div className={styles.seatingRow} key={i}>
                            {
                                row.map((seat : any, j : number) => {
                                    return seat
                                })
                            }
                            </div>
                        )
                    })
                }
                </div>
                <div className={`${styles.chartMobile} mobile`}>
                    <div className={`${styles.chartMobileInner}`}>
                    {
                        chart.map((row : any, i : number) => {
                            return (
                                <div className={styles.seatingRow} key={i}>
                                {
                                    row.map((seat : any, j : number) => {
                                        return seat
                                    })
                                }
                                </div>
                            )
                        })
                    }
                    <div className="w-100" style={{height: `${flight.plane.planeModel.rowsAmount * 6}vh`}}></div>
                    </div>
                </div>
            </div>
            <div 
                className="fixed w-100 h-64p bg-col-white z-100 flex-center transition self-flex-end bottom-0" style={{'marginBottom' : showSuccess ? '0px' : '-64px'}}
            >
                <img src={check} className="ml-5 h-50"/>
                <h3 className="font-main fc-green ml-1">Successfully Added to Cart</h3>
            </div>
        </div>
    )
}

function formatTime(date : any) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const formattedTime = `${hours}:${minutes}`;

    return formattedTime;
}

function formatDate(date : any) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = date.getDate();
    const monthIndex = date.getMonth(); // getMonth() returns a zero-based index

    return `${day < 10 ? '0' + day : day} ${months[monthIndex]}`;
}

type Seat = {
    rowIndex : number
    columnIndex : number
}