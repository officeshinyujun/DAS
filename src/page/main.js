import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import NavigateLeft from "../component/navigateleftbar";
import { motion, AnimatePresence } from "framer-motion";
import "../design/main.css";
import image from "../design/DAT 로고 1.png";
import app from "../data/firebase";

function Main() {
    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const auth = getAuth(app);
    const [profileId, setProfileId] = useState(null);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [selectuser, setSelectuser] = useState(null);

    useEffect(() => {
        // 로그인 상태 확인 및 유저 설정
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (!currentUser) {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [auth, navigate]);

    const modalOpen = () => {
        setModal(true);
    };

    const modalClose = () => {
        setModal(false);
    };

    return (
        <div className="main-container">
            <div className="main-content">
                <div className="main-title">
                    <img src={image} style={{width: "40px", height: "40px"}}/>
                    <p>DAT</p>
                </div>
                <div className="main-content2">
                    <div className="main-content2-list">
                        <div className="main-content2-tonew" onClick={() => {
                            document.getElementsByClassName("main-content2-tonew")[0].style.width = "600px";
                        }}></div>
                        <div className="main-content2-opener"></div>
                    </div>
                    <div className="main-content2-list">
                        <div className="main-content2-community"></div>
                        <div className="main-content2-profile"></div>
                    </div>
                </div>
            </div>
            <div onClick={modalOpen} className="tomodalopen">I</div>
            <AnimatePresence>
                {modal && (
                    <motion.div
                        className="tomodal"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            className="navigate-container"
                            initial={{x: -300}}
                            animate={{x: 0}}
                            exit={{x: -300}}
                            transition={{type: "spring", stiffness: 300, damping: 30}}
                        >
                            <NavigateLeft modalclose={modalClose}/>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Main;
