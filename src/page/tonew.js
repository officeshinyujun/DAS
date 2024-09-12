import React, { useEffect, useState, useCallback } from "react";
import { collection, setDoc, doc, getDocs, getDoc,firestore } from "firebase/firestore";
import { toNewdb } from "../data/toNewFirebase";
import Header from "../component/header";
import base64 from "base-64";
import { v4 as uuidv4 } from "uuid";
import "../design/tonew.css";
import {openerdb} from "../data/openerFirebase";

function ToNew() {
    const [userProfileData, setUserProfileData] = useState(null);
    const [userFlag, setUserFlag] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [contentTags, setContentTags] = useState('');
    const [content, setContent] = useState('');
    const [contentList, setContentList] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [userRecordData, setUserRecordData] = useState(null);
    const [error, setError] = useState(null);
    const [userProfileReturnData, setUserProfileReturnData] = useState(null);
    const [userRecordsReturnData, setUserRecordsReturnData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [bannerimage, setBannerimage] = useState(null);

    // Decode the auth token
    const decodeToken = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("Token not found in localStorage.");
            return null;
        }
        try {
            const payload = token.split('.')[1];
            const decoded = base64.decode(payload);
            return JSON.parse(decoded);
        } catch (err) {
            console.error("Error decoding or parsing token:", err);
            return null;
        }
    };

    // Save data to Firestore
    const saveToFirestore = async (id, userProfileData, userRecordData) => {
        try {
            await setDoc(doc(toNewdb, `userProfiles/${id}`), userProfileData);
            await setDoc(doc(toNewdb, `userRecords/${id}`), userRecordData);
            if (process.env.NODE_ENV === 'development') {
                console.log('Data successfully saved to Firestore!');
            }
        } catch (error) {
            console.error("Error saving data to Firestore:", error);
            setError("Failed to save data to Firestore: " + error.message);
        }
    };

    // Load user data and related information
    const loadData = useCallback(async (id) => {
        setIsLoading(true);

        try {
            const userResponse = await fetch(`http://127.0.0.1:8000/api/users,${id}`);
            if (!userResponse.ok) throw new Error("Failed to fetch user data.");
            const userData = await userResponse.json();
            setUserProfileData(userData);

            const recordResponse = await fetch(`http://127.0.0.1:8000/api/users,${id},summaries`);
            if (!recordResponse.ok) throw new Error("Failed to fetch record data.");
            const recordData = await recordResponse.json();
            setUserRecordData(recordData);

            await saveToFirestore(id, userData, recordData);

            if (userData && userData.data && userData.data.country) {
                const flagResponse = await fetch(`https://restcountries.com/v3.1/alpha/${userData.data.country}`);
                if (!flagResponse.ok) throw new Error("Failed to fetch flag data.");
                const flagData = await flagResponse.json();
                const flag = flagData[0]?.flags?.svg;
                setUserFlag(flag);
            }

        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
            setDataLoaded(true);
        }
    }, []);

    // Load content data from Firestore
    const loadContentData = useCallback(async () => {
        try {
            const contentQuerySnapshot = await getDocs(collection(toNewdb, 'toNewintroduce'));
            const contentData = contentQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const userProfileQuerySnapshot = await getDocs(collection(toNewdb, 'userProfiles'));
            const userProfileData = userProfileQuerySnapshot.docs.reduce((acc, doc) => {
                acc[doc.id] = doc.data();
                return acc;
            }, {});

            const userRecordsQuerySnapshot = await getDocs(collection(toNewdb, 'userRecords'));
            const userRecordsData = userRecordsQuerySnapshot.docs.reduce((acc, doc) => {
                acc[doc.id] = doc.data();
                return acc;
            }, {});

            setUserRecordsReturnData(userRecordsData);
            setUserProfileReturnData(userProfileData);

            const contentWithProfiles = contentData.map(item => ({
                ...item,
                userProfile: userProfileData[item.title] || null,
                userRecords: userRecordsData[item.title] || null
            }));

            setContentList(contentWithProfiles);
            setFilteredContent(contentWithProfiles);

        } catch (error) {
            console.error("Error loading documents:", error);
            setError("Failed to load content data.");
        }
    }, []);

    // Upload new content
    const upload = async () => {
        const token = decodeToken();
        if (!token || !userProfileData) {
            console.error("User profile data is missing or token is not available.");
            return;
        }

        try {
            const docRef = doc(collection(toNewdb, 'toNewintroduce'), uuidv4());
            await setDoc(docRef, {
                title: token.name || 'Unnamed',
                content: content,
                tags: contentTags.split(',').map(tag => tag.trim())
            });

            await saveToFirestore(token.name, userProfileData, userRecordData);

            loadContentData();
        } catch (error) {
            console.error("Error adding document:", error);
            setError("Failed to upload content: " + error.message);
        }
    };

    // Fetch initial data when component mounts
    useEffect(() => {
        const token = decodeToken();
        if (token && token.name) {
            loadData(token.name);
        }
        setProfileImage("https://i.ibb.co/5L43xB2/profiletest.png");
        loadContentData();
    }, [loadData, loadContentData]);

    useEffect(() => {
        if (userProfileReturnData) {
            console.log("Updated userProfileReturnData:", userProfileReturnData);
        }
    }, [userProfileReturnData]);

    useEffect(() => {
        if (userRecordsReturnData) {
            console.log("Updated userRecordsReturnData:", userRecordsReturnData);
        }
    }, [userRecordsReturnData]);

    // Open and close modal handlers
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    // Format tags as clickable elements
    const formatTags = (tags) => {
        if (typeof tags === 'string') {
            return tags.split(',').map((tag, index) => (
                <span
                    key={index}
                    className="tag"
                    onClick={() => handleTagClick(tag.trim())}
                >
                    {tag.trim()}
                </span>
            ));
        }
        if (Array.isArray(tags)) {
            return tags.map((tag, index) => (
                <span
                    key={index}
                    className="tag"
                    onClick={() => handleTagClick(tag)}
                >
                    {tag}
                </span>
            ));
        }
        return null;
    };

    // Handle tag click and filter content
    const handleTagClick = useCallback((tag) => {
        setSelectedTag(tag);
        if (tag) {
            const filtered = contentList.filter(item => item.tags.includes(tag));
            setFilteredContent(filtered);
        } else {
            setFilteredContent(contentList);
        }
    }, [contentList]);

    const handleShowAll = () => {
        setSelectedTag('');
        setFilteredContent(contentList);
    };

    const toConnect = async (userConnecter) => {
        setError('');

        try {
            const user = decodeToken();
            if (!user || !user.name) {
                setError("User not authenticated or username not found. Please login again.");
                return;
            }

            const userConnectRef = collection(openerdb, 'userConnect');
            const userToConnectDoc = await getDoc(doc(openerdb, 'userConnect', userConnecter));

            if (!userToConnectDoc.exists()) {
                setError("User to connect does not exist.");
                return;
            }

            await setDoc(doc(openerdb, 'userConnect', user.name), {
                username: user.name,
                userConnect: userConnecter,
                userAccept: true
            }, { merge: true });

            await setDoc(doc(openerdb, 'userConnect', userConnecter), {
                username: userConnecter,
                userConnect: user.name,
                userAccept: false
            }, { merge: true });

        } catch (error) {
            console.error("Error in toConnect:", error);
            setError("An error occurred while establishing the connection.");
        }
    };

    return (
        <div className="tonew-container">
            <Header/>
            <button onClick={openModal} style={{zIndex: "99", border:"none", backgroundColor:"#7F5FFF", padding:"0.5rem", color:"white", borderRadius:"5px"}}>Add</button>
            <button onClick={handleShowAll} className="tonew-Showall">Show All</button>
            {isLoading && <div className="loading-spinner">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            <div className="content-list">
                {filteredContent.map((item) => {
                    // item.title을 키로 사용하여 동적으로 접근
                    const profileData = userProfileReturnData[item.title]?.data;
                    const recordsData = userRecordsReturnData[item.title]?.data;
                    console.log(recordsData);
                    console.log(profileData)
                    return (
                        <div key={item.id} className="content-item">
                            <div className="profile-content-banner"
                                 style={{
                                     backgroundImage: "url(https://i.ibb.co/1Yc9m1h/bgbgbgbgbgb.png)",
                                     boxSizing: "border-box",
                                     height: "17vh"
                                 }}>
                                <img style={{
                                    width: '7vh',
                                    borderRadius: "10px",
                                    height: '7vh',
                                    objectFit: 'cover',
                                    top: "12vh"
                                }} src={profileImage}/>
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "20px",
                                padding: "10px"
                            }}>
                                <p className="profile-content-main-username">{profileData ? profileData.username.toUpperCase() : "Loading..."}</p>
                                <img
                                    src={`http://127.0.0.1:8000/user-content/res,league-ranks,${recordsData.league.rank}.png`}
                                    style={{height: "30px"}}/>
                            </div>
                            <div className="tonew-profile-content-2">
                                <div className="profile-content-main-standing-detail-ranks">
                                    <p>GLOBAL</p>
                                    <p>#{recordsData.league.standing}</p>
                                </div>
                                <div className="profile-content-main-standing-detail-ranks">
                                    <p>LOCAL</p>
                                    <p>#{recordsData.league.standing_local}</p>
                                </div>
                            </div>
                            <div className="profile-content-main-3">
                                <p style={{fontSize: "16px"}}>xp : {Math.floor(profileData.xp)}</p>
                                <p style={{fontSize: "16px"}}>time : {Math.floor(profileData.gametime)}</p>
                            </div>
                            <div className="profile-content-main-3">
                                <p style={{color: "white", fontSize: "1.4rem"}}>{item.content}</p>
                            </div>
                            <div className="profile-content-main-4" style={{fontSize: "16px", padding: "0.6rem"}}>
                                <div className="tags">
                                    {formatTags(item.tags)}
                                </div>
                            </div>
                            <button onClick={() => {toConnect(item.title)}} style={{border:"none", backgroundColor:"#7F5FFF", padding:"0.5rem", borderRadius:"5px", color:"white", fontWeight:"bolder"}}>Chat</button>
                        </div>
                    );
                })}
            </div>
            {modalOpen && (
                <div className="tonew-modal-container">
                    <div className="tonew-modal-content">
                        <input
                            type="text"
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Tags"
                            value={contentTags}
                            onChange={(e) => setContentTags(e.target.value)}
                        />
                        <button onClick={upload}>Upload</button>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ToNew;
