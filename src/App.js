import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Routes, Route} from "react-router-dom";
import Main from "./page/main";
import LoginPage from "./page/login";
import RegisterPage from "./page/register";
import Opener from "./page/opener";
import Tonew from "./page/tonew";
import Community from "./page/community";
import Profile from "./page/profile";
function App() {
    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/Register" element={<RegisterPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/opener" element={<Opener/>}/>
                    <Route path="/tonew" element={<Tonew/>}/>
                    <Route path="/community" element={<Community/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;
