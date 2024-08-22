import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import NavigateLeft from "../component/navigateleftbar";
import { motion, AnimatePresence } from "framer-motion";
import "../design/main.css";
import image from "../data/Group 3.png";
import app from "../data/firebase";

function Main() {
    const [modal, setModal] = useState(false);
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

    const inputId = (e) => {
        const id = e.target.value;
        setProfileId(id);
    };

    const modalimg = () => {
        // 구현 필요
    };

    const modalid = () => {
        // 구현 필요
    };

    return (
        <div className="main-container">
            <div className="main-header-container">
                <img src={image} style={{width: '80px', height: '80px', marginTop: "20px", marginLeft: "20px"}}
                     alt="Logo"/>
                <h1 style={{color: "white", fontSize: "80px", marginLeft: "20px", marginTop: "15px"}}>ARR</h1>
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
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                <motion.div className="main-box" whileHover={{width: "95%", height: "40vh"}}>
                    < div className="main-bar">
                        <span style={{fontSize: "70px", fontWeight: "bold", color: "white"}}>초보</span>
                        <span style={{fontSize: "70px", color: "white"}}>분들을 위한</span>
                        <div style={{fontSize: "70px", color: "white"}}>간편한 시스템</div>
                    </div>
                </motion.div>
            </div>
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                <motion.div className="main-box" whileHover={{width: "95%", height: "40vh"}}>
                    < div className="main-bar">
                        <span style={{fontSize: "70px", fontWeight: "bold", color: "white"}}>초보</span>
                        <span style={{fontSize: "70px", color: "white"}}>분들을 위한</span>
                        <div style={{fontSize: "70px", color: "white"}}>간편한 시스템</div>
                    </div>
                </motion.div>
            </div>
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                <motion.div className="main-box" whileHover={{width: "95%", height: "40vh"}}>
                    < div className="main-bar">
                        <span style={{fontSize: "70px", fontWeight: "bold", color: "white"}}>초보</span>
                        <span style={{fontSize: "70px", color: "white"}}>분들을 위한</span>
                        <div style={{fontSize: "70px", color: "white"}}>간편한 시스템</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Main;
