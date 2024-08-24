import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import base64 from "base-64";
import app from "../data/firebase";
import "../design/nav.css";
import { useState, useEffect } from "react";

function NavigateLeft({ modalclose }) {
    const [logining, setLogining] = useState(false);
    const [profileId, setProfileId] = useState("");
    const [profile, setProfile] = useState(null);
    const auth = getAuth(app);
    const navigate = useNavigate();

    function LogoutPage() {
        auth.signOut().then(() => {
            navigate('/login');
        }).catch((error) => {
            console.error("Logout Error:", error);
        });
    }

    let token = localStorage.getItem('authToken');
    let payload = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
    let decode = base64.decode(payload);
    let useDecode = JSON.parse(decode);

    const inputId = (event) => {
        setProfileId(event.target.value);
    };

    const fetchData = async () => {
        if (profileId) {
            try {
                const res = await fetch(`http://127.0.0.1:8000/users/${profileId}`);
                const json = await res.json();
                setProfile(json);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [profileId]);

    return (
        <div className="nav-bar">
            <div className="nav-bar-bar">
                <motion.div
                    className="nav-bar-profile"
                    whileHover={{ background: "linear-gradient(0.25turn, #131619, #63617f)" }}
                >
                    <Link to="/profile" style={{textDecoration:"none", color:"white"}}>{useDecode.name}</Link>
                </motion.div>
                <motion.div
                    className="nav-bar-lists"
                    whileHover={{ background: "linear-gradient(0.25turn, #131619, #63617f)" }}
                >
                    <Link to={"tonew"}>For beginner</Link>
                </motion.div>
                <motion.div
                    className="nav-bar-lists"
                    whileHover={{ background: "linear-gradient(0.25turn, #131619, #63617f)" }}
                >
                    <Link to={"/opener"}>Opener</Link>
                </motion.div>
                <motion.div
                    className="nav-bar-lists"
                    whileHover={{ background: "linear-gradient(0.25turn, #131619, #63617f)" }}
                >
                    <Link to={"/community"}>Community</Link>
                </motion.div>
            </div>
            <div>
                <motion.div
                    className="nav-footer"
                    whileHover={{ color: "#ffffff" }}
                >
                    <div onClick={LogoutPage}>Logout</div>
                </motion.div>
                <motion.div
                    className="nav-footer"
                    whileHover={{ color: "#ffffff" }}
                >
                    <Link to={"/register"}>Register</Link>
                </motion.div>
                <div onClick={modalclose} style={{ color: "#a1a1a1", cursor: 'pointer' }}>X</div>
            </div>
        </div>
    );
}

export default NavigateLeft;
