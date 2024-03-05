import { ReactElement, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/ai.module.css";
import bot from "../assets/images/bot.webp"
import { APP_SETTINGS } from "../settings/app-settings";
import ChatCard from "../components/chat-card";
import useNavigator from "../contexts/navigator-context";

export default function AiPage() {

    const [pageMode, setPageMode] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [chats, setChats] = useState<Array<ReactElement>>([]);
    const navigate = useNavigator();

    const chatContainer = useRef(null);

    var chatAdded = false;

    const addChat = async (message : any, user : boolean) => {
        setChats(prevChats => [
            ...prevChats,
            <ChatCard message={message} user={user}/>
        ]);
        await new Promise(resolve => setTimeout(resolve, 100));
        chatContainer.current?.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }

    const location = useLocation();

    const handleFileChange = (event : any) => {
        setSelectedFile(event.target.files[0]);
        addChat(<img src={URL.createObjectURL(event.target.files[0])} style={{width: '100%'}} />, true)
    }

    const handleUpload = async () => {
        addChat("Where is this place located?", true)

        if (!selectedFile) {
            addChat("Please add your image", false)
            return;
        }
    
        const formData = new FormData();
        formData.append('file', selectedFile);
    
        try {
            const response = await fetch(APP_SETTINGS.flask_backend + '/media/upload', {
                method: 'POST',
                body: formData,
            });
    
            const result = await response.json();
            if (response.ok) {
                console.log('File uploaded:', result);
                addChat(`That photo is taken at ${result.message}`, false);
                addChat(<>
                    Discover&nbsp;
                    <div 
                        className="fc-a inline-block pointer underline o-60 h-op2"
                        onClick={() => navigate("/explore/country:" + result.message + "/hotel")}
                    >
                        Hotels
                    </div>
                    &nbsp;and&nbsp;
                    <div 
                        className="fc-a inline-block pointer underline o-60 h-op2"
                        onClick={() => navigate("/explore/country:" + result.message + "/flight")}
                    >
                        Flights
                    </div>
                    &nbsp;on {result.message}
                </>, false);
            } else {
                console.error('Upload failed:', result.message);
                alert(`Upload failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if(location.pathname === "/ai") {
            setPageMode(1)
        } else {
            setPageMode(0)
        }

        if(!chatAdded && chats.length < 2) {
            chatAdded = true;
            addChat("Hello, my name is Bintang and I am your AI Assistant!", false);
            addChat("Send me an image and I will tell you the location.", false);
        }

        return(() => {
            setPageMode(0)
        })
    }, [location])

    let styleClass = (pageMode == 0) ? styles.blankMode : styles.uploadMode;

    return (
        <div className="bg-col-a w-screen h-screen flex-end justify-center">
            <img src={bot} className={`${styles.mascotImg} o-80 no-mobile`}/>
            <div className="flex wrap">
                <img src={bot} className={`${styles.mascotImg} o-80 mobile  `}/>
                <div className={`${styles.loginDiv} ${styleClass} transition-2 mb-5`}>
                    <div className={`h-80 w-100 overflow-auto flex-col justify-start scroll-simple ${styles.chatContainer}`} ref={chatContainer}>
                        {
                            chats.map((chat, index) => chat)
                        }
                        {
                            (selectedFile != null) ? <img src={selectedFile}/> : <></>
                        }
                    </div>
                    <div className="border-a-transparent w-100 rounded p-5p flex-center justify-between">
                        <input type="file" className={styles.fileInput} accept="image/*" onChange={handleFileChange}/>
                        <button className="bg-col-gray o-70 h-op2" onClick={handleUpload}>Send</button>
                    </div>
                </div>

                

            </div>
        </div>
    )
}