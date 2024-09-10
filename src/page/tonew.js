import React, { useEffect, useState } from "react";
import { collection, setDoc, doc, getDocs } from "firebase/firestore";
import { toNewdb } from "../data/toNewFirebase";
import Header from "../component/header";
import base64 from "base-64";
import { v4 as uuidv4 } from "uuid";
import "../design/tonew.css";

const fetchUserData = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/api/users/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user data.");
    return response.json();
};

const fetchUserContent = async (id, type) => {
    const response = await fetch(`http://127.0.0.1:8000/user-content/${type}/${id}.jpg`);
    if (!response.ok) throw new Error(`Failed to fetch ${type} image.`);
    return URL.createObjectURL(await response.blob());
};

function ToNew() {
    const [userProfileData, setUserProfileData] = useState(null);
    const [userFlag, setUserFlag] = useState('');
    const [bannerImage, setBannerImage] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [userRecordData, setUserRecordData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [contentTags, setContentTags] = useState('');
    const [content, setContent] = useState('');
    const [contentList, setContentList] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [error, setError] = useState(null);

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

    const loadData = async (id) => {
        if (!id) return;

        setIsLoading(true);

        try {
            const userData = await fetchUserData(id);
            setUserProfileData(userData);

            const recordResponse = await fetch(`http://127.0.0.1:8000/api/users/${id}/summaries`);
            if (!recordResponse.ok) throw new Error("Failed to fetch record data.");
            const recordData = await recordResponse.json();
            setUserRecordData(recordData);

            if (userData?.data?.country) {
                const flagResponse = await fetch(`https://restcountries.com/v3.1/alpha/${userData.data.country}`);
                if (!flagResponse.ok) throw new Error("Failed to fetch flag data.");
                const flagData = await flagResponse.json();
                const flag = flagData[0]?.flags?.svg;
                setUserFlag(flag);
            }

            const [profileUrl, bannerUrl] = await Promise.all([
                fetchUserContent(userData.data._id, 'avatars'),
                fetchUserContent(userData.data._id, 'banners')
            ]);
            setProfileImage(profileUrl);
            setBannerImage(bannerUrl);

        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load user data.");
        } finally {
            setIsLoading(false);
            setDataLoaded(true);
        }
    };

    const upload = async () => {
        const token = decodeToken();
        if (!token) return;

        console.log('User Profile Data before upload:', userProfileData);
        console.log('User Record Data before upload:', userRecordData);

        if (!userProfileData || !userRecordData) {
            console.error("User data not loaded yet");
            setError("User data not loaded. Please try again.");
            return;
        }

        try {
            const docRef = doc(collection(toNewdb, 'toNewintroduce'), uuidv4());

            await setDoc(docRef, {
                title: token.name,
                content: content,
                tags: contentTags.split(',').map(tag => tag.trim())
            });

            console.log('Document successfully written!');
            loadContentData();
        } catch (error) {
            console.error("Error adding document:", error);
            setError("Failed to upload content: " + error.message);
        }
    };

    const loadContentData = async () => {
        try {
            const querySnapshot = await getDocs(collection(toNewdb, 'toNewintroduce'));
            const contentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched content data:", contentData);
            setContentList(contentData);
            setFilteredContent(contentData);
        } catch (error) {
            console.error("Error loading documents:", error);
            setError("Failed to load content data.");
        }
    };

    useEffect(() => {
        const tokenData = decodeToken();
        if (tokenData) {
            loadData(tokenData.id); // Make sure to use the correct token property here
        }
    }, []);

    useEffect(() => {
        loadContentData();
    }, []);

    const openModal = () => {
        if (!modalOpen) setModalOpen(true);
    };

    const closeModal = () => {
        if (modalOpen) setModalOpen(false);
    };

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

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
        if (tag) {
            const filtered = contentList.filter(item => item.tags.includes(tag));
            setFilteredContent(filtered);
        } else {
            setFilteredContent(contentList);
        }
    };

    const handleShowAll = () => {
        setSelectedTag('');
        setFilteredContent(contentList);
    };

    return (
        <div className="tonew-container">
            <Header />
            <button onClick={openModal} style={{ zIndex: "99" }}>Open Modal</button>
            <button onClick={handleShowAll} className="tonew-Showall">Show All</button>
            {isLoading && <div className="loading-spinner">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            <div className="content-list">
                {filteredContent.map((item) => (
                    <div key={item.id} className="content-item">
                        <h2>{item.title}</h2>
                        <p>{item.content}</p>
                        <div className="tags">
                            {formatTags(item.tags)}
                        </div>
                    </div>
                ))}
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
