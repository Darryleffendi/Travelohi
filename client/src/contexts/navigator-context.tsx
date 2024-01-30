import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import IChildren from "../interfaces/children-interface";
import '../styles/styles.css'

const navigatorContext = createContext<any>(null);

export function NavigatorProvider({children} : IChildren) {

    const navigate = useNavigate();

    const [enableTransition, setEnableTransition] = useState(false);
    const [showTransition, setShowTransition] = useState(false);
    
    const changePage = (path : string) => {
        setEnableTransition(true);

        const transition = async () => {
            await new Promise(r => setTimeout(r, 5));
            setShowTransition(true);
            await new Promise(r => setTimeout(r, 400));
            navigate(path);
            setShowTransition(false);
            await new Promise(r => setTimeout(r, 400));
            setEnableTransition(false);
        }
        transition();
    }

    return (
        <navigatorContext.Provider value={changePage}>
            {children}
            
            {
            /* Fade overlay */
                enableTransition ? 
                    <div className="absolute top-0 left-0 z-100">
                        <div className='w-screen h-screen fixed bg-col-a transition z-100' style={showTransition ? {'opacity' : '100%'} : {'opacity' : '0%'}}>

                        </div>
                    </div>
                     : <></>
            }
        </navigatorContext.Provider>
    )
}

export default function useNavigator() {
    return useContext(navigatorContext);
}