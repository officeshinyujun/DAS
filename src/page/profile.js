import Header from "../component/header";
import { useEffect, useState } from "react";
import base64 from "base-64";
import "../design/profile.css";

function Profile() {
    const [userProfileData, setUserProfileData] = useState(null);
    const [userFlag, setUserFlag] = useState('');
    const [bannerImage, setBannerimage] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [userReacordData, setUserReacordData] = useState(null);
    const [useDecode, setUseDecode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [lineView, setLineView] = useState(false);

    const list = [1, 2, 3, 4, 5];
    const imageList = [
        "https://tetr.io/res/badges/allclear.png",
        "https://tetr.io/res/badges/100player.png",
        "https://tetr.io/res/badges/leaderboard1.png",
        "https://tetr.io/res/badges/secretgrade.png",
        "https://tetr.io/res/badges/twc23_t8.png"
    ];

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("Token not found in localStorage.");
            return;
        }

        try {
            const payload = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
            const decode = base64.decode(payload);
            const decodedData = JSON.parse(decode);
            setUseDecode(decodedData);
        } catch (err) {
            console.error("Error decoding or parsing token:", err);
        }
    }, []);

    useEffect(() => {
        if (useDecode) {
            loadData();
        }
    }, [useDecode]);

    const loadData = async () => {
        setIsLoading(true);

        if (!useDecode || !useDecode.name) {
            setIsLoading(false);
            return;
        }

        try {
            const userResponse = await fetch(`http://127.0.0.1:8000/users/${useDecode.name}`);
            if (!userResponse.ok) {
                throw new Error("Failed to fetch user data.");
            }
            const userData = await userResponse.json();
            setUserProfileData(userData);

            const recordResponse = await fetch(`http://127.0.0.1:8000/users/${useDecode.name}/summaries`);
            if (!recordResponse.ok) {
                throw new Error("Failed to fetch record data.");
            }
            const recordData = await recordResponse.json();
            setUserReacordData(recordData);

            if (userData && userData.data && userData.data.country) {
                const flagResponse = await fetch(`https://restcountries.com/v3.1/alpha/${userData.data.country}`);
                if (!flagResponse.ok) {
                    throw new Error("Failed to fetch flag data.");
                }
                const flagData = await flagResponse.json();
                const flag = flagData[0]?.flags?.svg;
                setUserFlag(flag);
            }

            setBannerimage("https://cdn.pixabay.com/photo/2020/01/12/08/12/keyboard-4759502_1280.jpg");
            setProfileImage("https://cdn.gameple.co.kr/news/photo/202307/206412_215305_3247.png");

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
            setDataLoaded(true);
        }
    };

    const LinesDropDown =() =>{
        return(
            <div className="profile-content2-40lines-more2">
                <ul style={{listStyleType: 'none'}}>
                    <li>11</li>
                    <li>12</li>
                    <li>13</li>
                </ul>
                <ul style={{listStyleType: 'none'}}>
                    <li>21</li>
                    <li>22</li>
                    <li>23</li>
                </ul>
                <ul style={{listStyleType: 'none'}}>
                    <li>21</li>
                    <li>22</li>
                    <li>23</li>
                </ul>
            </div>
        )
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!dataLoaded || !userProfileData) {

    }

    return (
        <>
            <Header/>

            <div className="profile-container">
                <div className="profile-content">
                    <img src={bannerImage} style={{width: '100%', height: '200px', objectFit: 'cover', display: "block"}} alt="Banner"/>
                    <div className="profile-content-main">
                        <img src={profileImage} style={{width: '200px', height: '200px', objectFit: 'cover', position: 'absolute', top: "12vh"}} alt="Profile Image"/>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap:"20px"}}>
                            <h1 style={{fontSize: "45px"}}>{userProfileData.data.username.toUpperCase()}</h1>
                            <img src={userFlag} alt="User flag" style={{width:"45px"}}/>
                        </div>
                        <div className="profile-content-main-2">
                            <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap:"20px", padding:"10px"}}>
                                <p style={{alignItems:"center", display:"flex", gap:"10px", fontSize:"30px"}}>RANK :<img src={"https://tetrio.team2xh.net/images/ranks/sp.png"} style={{height:"30px"}}/></p>
                                <div className="profile-content-main-standing">
                                    <div className="profile-content-main-standing-detail">
                                        <p>GLOBAL</p>
                                        <p>#1234</p>
                                    </div>
                                    <div style={{border:"1px solid #717171"}}></div>
                                    <div className="profile-content-main-standing-detail">
                                        <p>LOCAL</p>
                                        <p>#1234</p>
                                    </div>
                                </div>
                            </div>
                            <div className="profile-content-main-badges">
                                {list.map((item, index) => (
                                    <div key={index}><img src={imageList[item-1]} style={{width:"30px"}}/></div>
                                ))}
                            </div>
                        </div>
                        <div className="profile-content-main-3">
                            <p>xp : {Math.floor(userProfileData.data.xp)}</p>
                            <p>time : {Math.floor(userProfileData.data.gametime)}</p>
                        </div>
                        <div className="profile-content-main-4">
                            <div className="profile-content-main-4-gamecon">
                                <h3 style={{marginBottom:"10px"}}>gameplayed : {userProfileData.data.gamesplayed}</h3>
                                <div style={{display:"flex", flexdirection:"row", justifyContent:"space-between", alignItems:"center", gap:"20px"}}>
                                    <div style={{background:"#6780FF", width:"80px", padding:"5px", display:"flex", justifyContent:"center", alignItems:"center"}}><p>win : {userProfileData.data.gameswon}</p></div>
                                    <div style={{background:"#FF6767", width:"80px", padding:"5px", display:"flex", justifyContent:"center", alignItems:"center"}}><p>lose : {(userProfileData.data.gamesplayed) - (userProfileData.data.gameswon)}</p></div>
                                </div>
                            </div>
                            <div style={{width:"100%", marginTop:"10px", marginBottom:"10px"}}>
                                <table style={{display: "flex", justifyContent:"space-between", alignItems:"center", gap:"20px", width: "100%"}}>
                                    <tbody>
                                    <tr><td>apm : {userProfileData.data.apm}</td></tr>
                                    <tr><td>glicko : {userProfileData.data.glicko}</td></tr>
                                    </tbody>
                                    <tbody>
                                    <tr><td>pps : {userProfileData.data.pps}</td></tr>
                                    <tr><td>rd : {userProfileData.data.rd}</td></tr>
                                    </tbody>
                                    <tbody>
                                    <tr><td>vs : {userProfileData.data.vs}</td></tr>
                                    <tr><td>ㅤ</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-content2">
                    <div className="profile-content2-40lines">
                        <div className="profile-content2-40lines-head">
                            <div className="profile-content2-40lines-box"><h3>40L</h3></div>
                            <a style={{textDecoration: "none", color: "white"}}>Replay</a>
                        </div>
                        <div className="profile-content2-40lines-records">
                            <h1 style={{fontSize: "50px"}}>0 : 38</h1>
                            <div className="profile-content-main-standing">
                                <div className="profile-content-main-standing-detail">
                                    <p>GLOBAL</p>
                                    <p>#1234</p>
                                </div>
                                <div style={{border: "1px solid #717171"}}></div>
                                <div className="profile-content-main-standing-detail">
                                    <p>LOCAL</p>
                                    <p>#1234</p>
                                </div>
                            </div>
                        </div>
                        <h3 style={{width: "100%", padding: "15px", fontSize: "30px"}}>7 days ago</h3>
                    </div>
                    <div onClick={() => {
                        setLineView(!lineView)
                    }} style={{width: "100%", padding: "0px", boxSizing: "content-box"}}>
                        more
                        {lineView && <LinesDropDown/>}
                    </div>
                    <div className="profile-content2-40lines">
                        <div className="profile-content2-40lines-head">
                            <div className="profile-content2-40lines-box"><h3>40L</h3></div>
                            <a style={{textDecoration: "none", color: "white"}}>Replay</a>
                        </div>
                        <div className="profile-content2-40lines-records">
                            <h1 style={{fontSize: "50px"}}>0 : 38</h1>
                            <div className="profile-content-main-standing">
                                <div className="profile-content-main-standing-detail">
                                    <p>GLOBAL</p>
                                    <p>#1234</p>
                                </div>
                                <div style={{border: "1px solid #717171"}}></div>
                                <div className="profile-content-main-standing-detail">
                                    <p>LOCAL</p>
                                    <p>#1234</p>
                                </div>
                            </div>
                        </div>
                        <h3 style={{width: "100%", padding: "15px", fontSize: "30px"}}>7 days ago</h3>
                    </div>
                    <div onClick={() => {
                        setLineView(!lineView)
                    }} style={{
                        width: "100%",
                        padding: "0px",
                        boxSizing: "border-box",
                        border: "1px solid #717171"
                    }}>
                        more
                        {lineView && <LinesDropDown/>}
                    </div>
                    <div className="profile-content2-40lines">
                        <div className="profile-content2-40lines-head">
                            <div className="profile-content2-40lines-box"><h3>40L</h3></div>
                            <a style={{textDecoration: "none", color: "white"}}>Replay</a>
                        </div>
                        <div className="profile-content2-40lines-records">
                            <h1 style={{fontSize: "50px"}}>0 : 38</h1>
                            <div className="profile-content-main-standing">
                                <div className="profile-content-main-standing-detail">
                                    <p>GLOBAL</p>
                                    <p>#1234</p>
                                </div>
                                <div style={{border: "1px solid #717171"}}></div>
                                <div className="profile-content-main-standing-detail">
                                    <p>LOCAL</p>
                                    <p>#1234</p>
                                </div>
                            </div>
                        </div>
                        <h3 style={{width: "100%", padding: "15px", fontSize: "30px"}}>7 days ago</h3>
                    </div>
                    <div onClick={() => {
                        setLineView(!lineView)
                    }} style={{
                        width: "100%",
                        padding: "0px",
                        boxSizing: "border-box",
                        border: "1px solid #717171"
                    }}>
                        more
                        {lineView && <LinesDropDown/>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
