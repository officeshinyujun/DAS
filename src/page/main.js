import { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import { getAuth } from "firebase/auth";
import NavigateLeft from "../component/navigateleftbar";
import { motion, AnimatePresence } from "framer-motion";
import "../design/main.css";
import image from "../design/DAT 로고 1.png";
import app from "../data/firebase";
import Header from "../component/header";

function Main() {
    const [modal, setModal] = useState(false);
    const auth = getAuth(app);
    const navigate = useNavigate();
    const [expandedBox, setExpandedBox] = useState(null);

    useEffect(() => {
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

    const handleBoxClick = (boxName) => {
        // Check if the box being clicked is already expanded
        if (expandedBox === boxName) {
            // If yes, collapse it and reset the container height
            setExpandedBox(null);
            document.getElementsByClassName("main-container")[0].style.height = "100vh";
        } else {
            // If no, expand the clicked box and set the container height to 140vh
            setExpandedBox(boxName);
            document.getElementsByClassName("main-container")[0].style.height = "140vh";
        }
    };


    return (
        <div className="main-container">
            <Header/>
            <div className="main-content">
                <div className="main-content2">
                    <div className="main-content2-list">
                        <div
                            className={`main-content2-tonew ${expandedBox === 'tonew' ? 'expanded' : ''}`}
                            onClick={() => handleBoxClick('tonew')}
                        >
                            <h3>To New</h3>
                            <div className="box-content">
                                <p>To New 확장된 내용이 여기에 들어갑니다.</p>
                                <p>스크롤이 생길만큼 내용을 추가하세요.</p>
                                {/* 필요한 만큼 내용 추가 */}
                            </div>
                        </div>
                        <div
                            className={`main-content2-opener ${expandedBox === 'opener' ? 'expanded' : ''}`}
                            onClick={() => handleBoxClick('opener')}
                        >
                            <h3>Opener</h3>
                            <div className="box-content">
                                <p>Opener 확장된 내용이 여기에 들어갑니다.</p>
                                <p>스크롤이 생길만큼 내용을 추가하세요.</p>
                                {/* 필요한 만큼 내용 추가 */}
                            </div>
                        </div>
                    </div>
                    <div className="main-content2-list">
                        <div
                            className={`main-content2-community ${expandedBox === 'community' ? 'expanded' : ''}`}
                            onClick={() => handleBoxClick('community')}
                        >
                            <h3>Community</h3>
                            <div className="box-content">
                                <p>Community 확장된 내용이 여기에 들어갑니다.</p>
                                <p>스크롤이 생길만큼 내용을 추가하세요.</p>
                                {/* 필요한 만큼 내용 추가 */}
                            </div>
                        </div>
                        <div
                            className={`main-content2-profile ${expandedBox === 'profile' ? 'expanded' : ''}`}
                            onClick={() => handleBoxClick('profile')}
                        >
                            <h3>Profile</h3>
                            <div className="box-content">
                                <p>Profile 확장된 내용이 여기에 들어갑니다.</p>
                                <p>스크롤이 생길만큼 내용을 추가하세요.</p>
                                {/* 필요한 만큼 내용 추가 */}
                            </div>
                        </div>
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