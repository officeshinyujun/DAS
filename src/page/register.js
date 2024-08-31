import { useForm } from "react-hook-form";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import app from "../data/firebase";
import { useNavigate } from "react-router-dom";
import image from "../data/Group 3.png";
import React, { useState } from "react";
import { addDoc, collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { chatdb, chatapp } from "../data/connectUserFirebase";
import base64 from "base-64";

function RegisterPage() {
    const [error, setError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const auth = getAuth(app);

    const onSubmit = async (data) => {
        try {
            // Check if username already exists
            const userConnectRef = collection(chatdb, 'userConnect');
            const q = query(userConnectRef, where("username", "==", data.name));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setError('Username already exists. Please choose a different one.');
                return;
            }

            // Create user in Firebase Authentication
            const createdUser = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            );

            // Update user profile
            await updateProfile(createdUser.user, {
                displayName: data.name
            });

            // Add user to Realtime Database
            const db = getDatabase();
            await set(ref(db, `users/${createdUser.user.uid}`), {
                name: createdUser.user.displayName,
                email: createdUser.user.email,
            });

            // Add user to Firestore
            await setDoc(doc(userConnectRef, data.name), {
                username: data.name,
                userConnect: ""
            });

            console.log("User created successfully:", createdUser);

            // Navigate to login page
            navigate("/login");
        } catch (err) {
            console.error("Error during registration:", err);
            setError(err.message);
        }
    };

    return (
        <div className="login-background">
            <div className="main-header-container">
                <img src={image} style={{width: '80px', height: '80px', marginTop: "20px", marginLeft: "20px"}}
                     alt="Logo"/>
                <h1 style={{color: "white", fontSize: "80px", marginLeft: "20px", marginTop: "15px"}}>ARR</h1>
            </div>
            <div className="login-content-container">
                <h1 style={{
                    color: "white",
                    fontSize: "60px",
                    fontWeight: "bolder",
                    marginBottom: "40px",
                    marginTop: "40px"
                }}>Join</h1>
                <div className="login-container">
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <input
                                type="text"
                                id="name"
                                {...register('name', {
                                    required: true,
                                    minLength: 2,
                                })}
                            />
                            {errors.name && errors.name.type === 'required' && <p>Name is required!</p>}
                            {errors.name && errors.name.type === 'minLength' && <p>Name must be at least 2 characters long!</p>}
                            <div>ID</div>
                        </div>
                        <div>
                            <input
                                type="email"
                                id="email"
                                {...register('email', {
                                    required: true,
                                    pattern: /^\S+@\S+$/i
                                })}
                            />
                            {errors.email && errors.email.type === 'required' && <p>Email is required!</p>}
                            {errors.email && errors.email.type === 'pattern' && <p>Invalid email format!</p>}
                            <div>Email</div>
                        </div>
                        <div>
                            <input
                                type="password"
                                id="password"
                                {...register('password', {
                                    required: true,
                                    minLength: 6,
                                    maxLength: 20,
                                })}
                            />
                            {errors.password && errors.password.type === 'required' && <p>Password is required!</p>}
                            {errors.password && errors.password.type === 'minLength' && <p>Password must be at least 6 characters long!</p>}
                            {errors.password && errors.password.type === 'maxLength' && <p>Password must be no more than 20 characters long!</p>}
                            <div>Password</div>
                        </div>
                        <button type="submit" value="Register">Join</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;