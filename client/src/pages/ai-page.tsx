import { ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/ai.module.css";
import bot from "../assets/images/bot.webp"
import { APP_SETTINGS } from "../settings/app-settings";

export default function AiPage() {

    const [pageMode, setPageMode] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [chats, setChats] = useState<Array<ReactElement>>([]);

    const addChat = (message : string, user : boolean) => {
        if(user) {
            setChats([...chats, (
                <div className={`${styles.chatBox} ${styles.userChat} font-main`}>
                    {message}
                </div>
            )])
        }
        else {
            setChats([...chats, (
                <div className={`${styles.chatBox} ${styles.botChat} font-main fc-a`}>
                    {message}
                </div>
            )])
        }
    }

    const location = useLocation();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
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
        addChat("Hello, I am your AI Assistant! Send me an image and I will tell you the location.", false);

        return(() => {
            setPageMode(0)
        })
    }, [location])

    let styleClass = (pageMode == 0) ? styles.blankMode : styles.uploadMode;

    return (
        <div className="bg-col-a w-screen h-screen flex-end justify-center">
            <img src={bot} className={`${styles.mascotImg} o-80`}/>
            <div className={`${styles.loginDiv} ${styleClass} transition-2 mb-5`}>
                <div className="h-80 w-100 overflow-auto flex-col justify-start">
                    {
                        chats.map((chat, index) => {
                            return chat
                        })
                    }
                </div>
                <div className="border-a-transparent w-100 rounded p-5p flex-center justify-between">
                    <input type="file" className={styles.fileInput} accept="image/*" onChange={handleFileChange}/>
                    <button className="bg-col-gray o-70 h-op2" onClick={handleUpload}>Send</button>
                </div>
            </div>
        </div>
    )
}