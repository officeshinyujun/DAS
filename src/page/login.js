import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../data/firebase";
import {Link, useNavigate} from "react-router-dom";
import image from "../data/Group 3.png";
import "../design/login.css"

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth(app);
    const navigate = useNavigate();


    const emailChange = (e) => {
        setEmail(e.target.value);
    }

    const passwordChange = (e) => {
        setPassword(e.target.value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const token = await credential.user.getIdToken();
            localStorage.setItem('authToken', token);
            navigate(`/`);
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="login-background">
                <div className="login-container">
                <h1 style={{color: "white", fontSize: "50px", marginBottom: "20px"}}>DAT</h1>
                    <form onSubmit={onSubmit}>
                        <div>
                            <input value={email} onChange={emailChange} type="email" id="_email" required placeholder='이메일'/>
                        </div>
                        <div>
                            <input value={password} onChange={passwordChange} type="password" id="_password" required placeholder='비밀번호'/>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <div>
                        <span>no account? > </span>
                        <Link to="/Register" style={{textDecoration:"none", color:"white"}}>Join</Link>
                    </div>
                </div>
            </div>
    );
}

export default LoginPage;
