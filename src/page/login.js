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
            <div className="main-header-container">
                <img src={image} style={{width: '80px', height: '80px', marginTop: "20px", marginLeft: "20px"}}
                     alt="Logo"/>
                <h1 style={{color: "white", fontSize: "80px", marginLeft: "20px", marginTop: "15px"}}>ARR</h1>
            </div>
            <div className="login-content-container">
                <h1 style={{color: "white",fontSize:"60px", fontWeight:"bolder", marginBottom:"40px", marginTop:"40px" }}>Login</h1>
                <div className="login-container">
                    <form onSubmit={onSubmit}>
                        <div>
                            <input value={email} onChange={emailChange} type="email" id="_email" required/>
                            <div>Email</div>
                        </div>
                        <div>
                            <input value={password} onChange={passwordChange} type="password" id="_password" required/>
                            <div>password</div>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <div>
                        <span>no account? ></span>
                        <Link to="/Register" style={{textDecoration:"none", color:"white"}}>Join</Link>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default LoginPage;
