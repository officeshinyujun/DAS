import { useForm } from "react-hook-form";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import app from "../data/firebase";
import {useNavigate} from "react-router-dom";
import image from "../data/Group 3.png";
import React from "react";

function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const auth = getAuth(app);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data) => {
        try {
            const createdUser = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            );
            console.log(createdUser);
            console.log(createdUser.token);
            navigate("/login")


            // Set display name
            await updateProfile(createdUser.user, {
                displayName: data.name
            });

            const db = getDatabase();


            await set(ref(db, `users/${createdUser.user.uid}`), {
                name: createdUser.user.displayName,
                email: createdUser.user.email,
            });
        } catch (err) {
            console.error(err);
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
                            {errors.email && <p>이메일이 잘못되었습니다!</p>}
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
                            {errors.password && errors.password.type === 'required' && <p>비밀번호가 필요합니다!</p>}
                            {errors.password && errors.password.type === 'minLength' && <p>비밀번호는 최소 6자 이상이어야 합니다!</p>}
                            {errors.password && errors.password.type === 'maxLength' && <p>비밀번호는 최대 20자 이하여야 합니다!</p>}
                            <div>password</div>
                        </div>
                        <button type="submit" value="Register">Join</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
