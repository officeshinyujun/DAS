import Header from "../component/header";
import { useEffect, useState } from "react";
import base64 from "base-64";
import "../design/profile.css";
import date from "date-and-time";
import {Link} from "react-router-dom";

function Profile() {
    const [userProfileData, setUserProfileData] = useState(null);
    const [userFlag, setUserFlag] = useState('');
    const [bannerImage, setBannerimage] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [userReacordData, setUserReacordData] = useState(null);
    const [userDecodeName, setUserDecodeName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [lineView, setLineView] = useState(false);
    const [expandedBox, setExpandedBox] = useState(false);
    const [whatExpandedBox, setWhatExpandedBox] = useState('');

    const list = [1, 2, 3, 4, 5];
    const imageList = [
        "http://127.0.0.1:8000/user-content/res/badges/allclear.png",
        "http://127.0.0.1:8000/user-content/res/badges/100player.png",
        "http://127.0.0.1:8000/user-content/res/badges/leaderboard1.png",
        "http://127.0.0.1:8000/user-content/res/badges/secretgrade.png",
        "http://127.0.0.1:8000/user-content/res/badges/twc23_t8.png"
    ];

    const decodeToken = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("Token not found in localStorage.");
            return null;
        }

        try {
            const payload = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
            const decode = base64.decode(payload);
            return JSON.parse(decode);
        } catch (err) {
            console.error("Error decoding or parsing token:", err);
            return null;
        }
    };

    useEffect(() => {
        const decodedData = decodeToken();
        if (decodedData) {
            setUserDecodeName(decodedData);
            loadData(decodedData);
        }
        testasync()
    }, []);

    const forthynow = () => {
        const now = new Date();
        const recordDate = new Date(userReacordData.data["40l"].record.ts);
        const diffDays = Math.floor((now - recordDate) / (1000 * 60 * 60 * 24));
        return `${diffDays} days ago`;
    };

    const blitznow = () => {
        const now = new Date();
        const recordDate = new Date(userReacordData.data["blitz"].record.ts);
        const diffDays = Math.floor((now - recordDate) / (1000 * 60 * 60 * 24));
        return `${diffDays} days ago`;
    };

    const loadData = async (decodedData) => {
        if (!decodedData) return;

        console.log(decodedData);
        setIsLoading(true);

        try {
            const userResponse = await fetch(`http://127.0.0.1:8000/users/${decodedData.name}`);
            if (!userResponse.ok) {
                throw new Error("Failed to fetch user data.");
            }
            const userData = await userResponse.json();
            console.log(userData)
            setUserProfileData(userData);

            const recordResponse = await fetch(`http://127.0.0.1:8000/users/${decodedData.name}/summaries`);
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

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
            setDataLoaded(true);
        }
    };

    const testasync = async() => {
        try {
            const userImageResponse = await fetch("http://127.0.0.1:8000/user-content/res/badges/allclear.png");
            if (!userImageResponse.ok) {
                throw new Error('Failed to fetch image');
            }
            const imageUrl = userImageResponse.url;
            setProfileImage(imageUrl);
            console.log(profileImage)
        } catch (error) {
            console.log(error);
        }
    }

    const handleBoxClick = (t) => {
        if (expandedBox === true) {
            setExpandedBox(false);
            setWhatExpandedBox('');
            document.getElementById(t).style.height = "17vh";
        } else {
            setExpandedBox(true);
            setWhatExpandedBox(t);
            document.getElementById(t).style.height = "23vh";
        }
    };



    return (
        <>
            <div className="profile-container">
                <Link to="/">
                    <button className="profile-content-more">back</button>
                </Link>
                {isLoading ? (
                    <p>Loading...</p>
                ) : dataLoaded && userProfileData ? (
                    <div className="profile-content-all">
                        <div className="profile-content">
                            <div className="profile-content-banner"
                            >
                                <img src={profileImage} style={{
                                    width: '250px',
                                    height: '250px',
                                    objectFit: 'cover',
                                    top: "12vh"
                                }} alt="Profile Image"/>
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "column",
                                gap: "20px"
                            }}>
                                <div className="profile-content-main">
                                    <h1 style={{fontSize: "45px", fontWeight: "bold"}}
                                        className="profile-content-main-username">{userProfileData.data.username.toUpperCase()}</h1>
                                    {console.log(userProfileData.data.username.toUpperCase())}
                                    <img src={userFlag} alt="User flag" style={{width: "45px"}}/>
                                </div>
                                <div className="profile-content-main-2">
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "20px",
                                        padding: "10px"
                                    }}>
                                        <p style={{
                                            alignItems: "center",
                                            display: "flex",
                                            gap: "10px",
                                            fontSize: "30px"
                                        }}>RANK :<img src={"https://tetrio.team2xh.net/images/ranks/sp.png"}
                                            //https://tetr.io/res/league-ranks/a.png <-여기서 이미지 얻어올수 잇음
                                                      style={{height: "30px"}}/></p>
                                        <div className="profile-content-main-standing-ranks">
                                            <div className="profile-content-main-standing-detail-ranks">
                                                <p>GLOBAL</p>
                                                <p>#{userReacordData.data.league.standing}</p>
                                            </div>
                                            <div className="profile-content-main-standing-detail-ranks">
                                                <p>LOCAL</p>
                                                <p>#{userReacordData.data.league.standing_local}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="profile-content-main-3">
                                    <p style={{fontSize:"16px"}}>xp : {Math.floor(userProfileData.data.xp)}</p>
                                    <p style={{fontSize:"16px"}}>time : {Math.floor(userProfileData.data.gametime)}</p>
                                </div>
                                <div className="profile-content-main-3">
                                    <div className="profile-content-main-badges">
                                        {list.map((item, index) => (
                                            <div key={index}><img src={imageList[item - 1]} style={{width: "30px"}}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="profile-content-main-4">
                                    <div className="profile-content-main-4-gamecon">
                                        <h3 style={{
                                            marginBottom: "10px",
                                            fontSize: "1.5rem",
                                            fontWeight: "normal"
                                        }}>Gameplayed
                                            : {userProfileData.data.gamesplayed}</h3>
                                        <div style={{
                                            display: "flex",
                                            flexdirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "20px"
                                        }}>
                                            <div style={{
                                                background: "#6780FF",
                                                width: "100px",
                                                padding: "5px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}><p>{userProfileData.data.gameswon}</p></div>
                                            <div style={{
                                                background: "#FF6767",
                                                width: "100px",
                                                padding: "5px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}><p>
                                                {(userProfileData.data.gamesplayed) - (userProfileData.data.gameswon)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{width: "100%", marginTop: "10px", marginBottom: "10px"}}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "20px",
                                            width: "100%"
                                        }}>
                                            <div className="profile-content-main-4-p">
                                                <p>apm : {userProfileData.data.apm}</p>
                                                <p>glicko : {userProfileData.data.glicko}</p>
                                                <p>pps : {userProfileData.data.pps}</p>
                                                <p>rd : {userProfileData.data.rd}</p>
                                                <p>vs : {userProfileData.data.vs}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="profile-content2">
                            <div className="profile-content2-40lines" id="40lBox" onClick={() => {handleBoxClick("40lBox")}}>
                                <div className="profile-content2-40lines-head">
                                    <div className="profile-content2-40lines-box"><h3>40L</h3></div>
                                    <a style={{textDecoration: "none", color: "white", fontSize:"20px"}}>Replay</a>
                                </div>
                                <div className={"profile-content2-40lines-records"}>
                                    <p style={{fontSize: "50px", fontWeight:"bolder"}}>
                                        {
                                            parseInt(((userReacordData.data["40l"].record.results.stats.finaltime) / (1000 * 60)) % 60)
                                        }
                                        :
                                        {
                                            (((userReacordData.data["40l"].record.results.stats.finaltime) / 1000) % 60).toFixed(2)
                                        }
                                    </p>
                                    <h3 style={{width: "100%", padding: "15px", fontSize: "20px", fontWeight:"lighter", color:"gray"}}>{forthynow()}</h3>

                                    <div className="profile-content-main-standing">
                                        <div className="profile-content-main-standing-detail-40l">
                                            <p>GLOBAL</p>
                                            <p>#{userReacordData.data["40l"].rank}</p>
                                        </div>
                                        <div style={{border: "1px solid #717171"}}></div>
                                        <div className="profile-content-main-standing-detail-40l">
                                            <p>LOCAL</p>
                                            <p>#{userReacordData.data["40l"].rank_local}</p>
                                        </div>
                                    </div>
                                </div>
                                {expandedBox && whatExpandedBox === "40lBox" &&(

                                    <div style={{width: "100%", padding: "0px", boxSizing: "content-box"}}>
                                        <div className="profile-content2-40lines-more2">
                                            <div style={{border: "1px solid #3c3c3c", width: "100%"}}></div>
                                            <div style={{display:"flex", alignItems:"center", justifyContent:"space-around", width:"100%", padding:"10px"}}>
                                                <div>pps - {(userReacordData.data["40l"].record.results.aggregatestats.pps).toFixed(3)}</div>
                                                <div>finesse - {userReacordData.data["40l"].record.results.stats.finesse.faults}F</div>
                                                <div>pices - {userReacordData.data["40l"].record.results.stats.piecesplaced} pieces</div>
                                            </div>
                                        </div>
                                    </div>

                                )}

                            </div>
                            <div className="profile-content2-40lines" id = "blitzBox" onClick={() => {handleBoxClick("blitzBox")}}>
                                <div className="profile-content2-40lines-head">
                                    <div className="profile-content2-blitz-box"><h3>BLITZ</h3></div>
                                    <a style={{textDecoration: "none", color: "white", fontSize:"20px"}}>Replay</a>
                                </div>
                                <div className="profile-content2-40lines-records">
                                    <p style={{fontSize: "50px", fontWeight:"bolder"}}>{userReacordData.data.blitz.record.results.stats.score}</p>
                                    <h3 style={{width: "100%", padding: "15px",fontSize: "20px", fontWeight:"lighter", color:"gray"}}>{blitznow()}</h3>
                                    <div className="profile-content-main-standing">
                                        <div className="profile-content-main-standing-detail-blitz">
                                            <p>GLOBAL</p>
                                            <p>#{userReacordData.data.blitz.rank}</p>
                                        </div>
                                        <div style={{border: "1px solid #717171"}}></div>
                                        <div className="profile-content-main-standing-detail-blitz">
                                            <p>LOCAL</p>
                                            <p>#{userReacordData.data.blitz.rank_local}</p>
                                        </div>
                                    </div>
                                </div>
                                {expandedBox && whatExpandedBox === "blitzBox" && (
                                    <div style={{width: "100%", padding: "0px", boxSizing: "content-box"}}>
                                        <div className="profile-content2-40lines-more2">
                                            <div style={{border: "1px solid #3c3c3c", width: "100%"}}></div>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-around",
                                                width: "100%",
                                                padding: "10px"
                                            }}>
                                                <div>pps
                                                    - {(userReacordData.data.blitz.record.results.aggregatestats.pps).toFixed(3)}</div>
                                                <div>finesse
                                                    - {userReacordData.data.blitz.record.results.stats.finesse.faults}F
                                                </div>
                                                <div>pices
                                                    - {userReacordData.data.blitz.record.results.stats.piecesplaced} pieces
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="profile-content2-zen" id = "zenBox">
                                <div className="profile-content2-40lines-head">
                                    <div className="profile-content2-zen-box"><h3>ZEN</h3></div>
                                </div>
                                <div className="profile-content2-40lines-records">
                                    <p style={{fontSize: "50px", fontWeight:"bolder"}}>{userReacordData.data.zen.score}</p>
                                    <h3 style={{
                                        width: "100%",
                                        padding: "15px",
                                        fontSize: "20px", fontWeight:"lighter", color:"gray"
                                    }}>level {userReacordData.data.zen.level}</h3>

                                </div>
                            </div>
                            <div className="profile-content2-40lines" id="quickBox" onClick={() => {handleBoxClick("quickBox")}}>
                                <div className="profile-content2-quick-head">
                                    <div className="profile-content2-quick-box"><h3>{("quickplay & achivement").toUpperCase()}</h3></div>
                                </div>
                                <div className="profile-content2-40lines-records">
                                    <h1 style={{fontSize: "50px"}}>
                                        {
                                            parseInt(((userReacordData.data["40l"].record.results.stats.finaltime) / (1000 * 60)) % 60)
                                        }
                                        :
                                        {
                                            (((userReacordData.data["40l"].record.results.stats.finaltime) / 1000) % 60).toFixed(2)
                                        }
                                    </h1>
                                    <h3 style={{width: "100%", padding: "15px",fontSize: "20px", fontWeight:"lighter", color:"gray"}}>7 days ago</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </>
    );
}

export default Profile;