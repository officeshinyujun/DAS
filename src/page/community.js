import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { openerdb, openerstorage } from "../data/openerFirebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from "uuid";
import "../design/community.css";
import Header from "../component/header";
import base64 from "base-64";
import { Link } from "react-router-dom";

Modal.setAppElement('#root');

function Community(key, value) {
    const [fileUploads, setFileUploads] = useState([]);
    const [title, setTitle] = useState("");
    const [documents, setDocuments] = useState([]);
    const [content, setContent] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const fileInputRef = useRef(null);
    const [searchWhat, setSearch] = useState("");
    const [ifSearchTags, setIfSearchTags] = useState(false);
    const [ifSearchTitle, setIfSearchTitle] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectItem, setSelectItem] = useState(null);
    const [tagSearchMode, setTagSearchMode] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);

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

    const toModalOpen = (item) => {
        setModalOpen(true);
        setSelectItem(item);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectItem(null);
    };

    const uploadFile = async (fileUrls) => {
        try {
            const tags = tagsInput.split(',').map(tag => tag.trim());
            const users = decodeToken();
            const testCollectionRef = collection(openerdb, `test`);
            await addDoc(testCollectionRef, {
                title: title,
                content: content,
                fileUrls: fileUrls,
                tags: tags,
                users: users.name
            });
            alert("성공적으로 올라갔습니다!");
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    };

    const upload = async () => {
        if (fileUploads.length === 0) {
            console.error("No files selected");
            return;
        }

        const uploadPromises = fileUploads.map(file => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const fileType = file.type.startsWith("image/") ? "images" : "videos";
            const fileRef = ref(openerstorage, `${fileType}/${uuidv4()}.${fileExtension}`);
            return uploadBytes(fileRef, file).then(snapshot => {
                return getDownloadURL(snapshot.ref);
            });
        });

        try {
            const urls = await Promise.all(uploadPromises);
            await uploadFile(urls);
        } catch (error) {
            console.error("Error uploading files: ", error);
        }
    };

    useEffect(() => {
        loadDocs();
    }, []);

    const loadDocs = async () => {
        try {
            const testCollectionRef = collection(openerdb, "test");
            const lists = await getDocs(testCollectionRef);
            const data = lists.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }));
            setDocuments(data);
            console.log(data);
            console.log("잘 불러옴ㅇㅇ");
        } catch (error) {
            console.error("Error loading documents: ", error);
        }
    };

    const handleFileChange = (e) => {
        setFileUploads([...e.target.files]);
    };

    // Enter 키로 검색 기능 실행
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            toSearchTags();
        }
    };

    const toSearchTags = () => {
        if (searchWhat.includes('#')) {
            setIfSearchTags(true);
            setIfSearchTitle(false);
        } else {
            setIfSearchTitle(true);
            setIfSearchTags(false);
        }
    };

    const writeDocs = () => {
        let filteredDocs;

        if (ifSearchTags) {
            filteredDocs = documents.filter(doc => doc.tags && doc.tags.includes(searchWhat));
        } else if (ifSearchTitle) {
            filteredDocs = documents.filter(doc => doc.title && doc.title.includes(searchWhat));
        } else if (tagSearchMode) {
            const selectedTag = JSON.parse(localStorage.getItem('selectedTag'));
            filteredDocs = documents.filter(doc => doc.tags && doc.tags.includes(selectedTag));
        } else {
            filteredDocs = documents;
        }

        return (
            <>
                {filteredDocs.map(doc => (
                    <div className="community-content-lists" key={doc.id} onClick={() => toModalOpen(doc)}>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            {doc.fileUrls && doc.fileUrls.length > 0 && (() => {
                                const url = doc.fileUrls[0];
                                const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('.avi');
                                return isVideo ? (
                                    <video key={0} src={url} controls style={{ width: "300px", margin: "10px" }} />
                                ) : (
                                    <img key={0} src={url} alt={`image-0`} style={{ width: "300px", margin: "10px" }} />
                                );
                            })()}
                        </div>
                        <div className="community-content-lists-contents">
                            <div>
                                <h1 style={{fontSize:"50px", color:"white", fontWeight:"bolder"}}>{doc.title}</h1>
                                <p style={{fontSize:"20px", color:"#a1a1a1"}}>{doc.users}</p>
                            </div>
                            <div style={{display:"flex", gap:"1rem"}}>
                            {Array.isArray(doc.tags) ?
                                    doc.tags.map((tag, index) => (
                                        <span
                                            className="detail-modal-tags"
                                            key={index}
                                            onClick={() => tagSearch(tag)}
                                            style={{marginRight: '10px', cursor: 'pointer'}}
                                        >
                                        {tag}
                                    </span>
                                    ))
                                    : ''}
                            </div>
                        </div>
                    </div>
                ))}
            </>
        );
    };

    const tagSearch = (tag) => {
        setTagSearchMode(true);
        console.log(tag);
        localStorage.setItem('selectedTag', JSON.stringify(tag));
        setModalOpen(false);
    };

    return (
        <div className="community-background">
            {modalOpen2 && (
                <div className="modal2background">
                    <div className="modal2-container">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="modal-container2-file"
                        />
                        <input
                            style={{color: "blue"}}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <input
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="태그를 쉼표로 구분하여 입력하세요"
                        />
                        <button onClick={upload}>Upload</button>
                        <button onClick={() => {setModalOpen2(false)}}>X</button>
                    </div>
                </div>
            )}
            <Header/>
            {tagSearchMode === false && (
                <div style={{display: "flex", justifyContent: "flex-end", width: "90vw", marginTop:"3.3vh"}}>
                    <div style={{
                        display:"flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <input
                            className="tagsearch-input"
                            color="white"
                            value={searchWhat}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown} // Enter 키로 검색 실행
                            placeholder="검색할 태그나 제목을 입력하세요"
                        />
                        <button className="community-content-add-btn" onClick={() => {
                            setModalOpen2(true)
                        }}>
                            <p>Add</p>
                        </button>
                    </div>
                </div>
            )}
            <div className="community-content-list-container">
                {writeDocs()}
            </div>
            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor:"#131620",
                        border:"1px solid #282828",
                        width: '90%',
                        height: '90%',
                        padding:"30px"
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    }
                }}
                contentLabel="Selected Document"
            >
                {selectItem && (
                    <div className="detail-modal-container">
                        <div>
                            <Link to="/userProfile"><p>{selectItem.users}</p></Link>
                            {window.localStorage.setItem("whoUsers",selectItem.users)}
                            <h2 className="detail-modal-container-head">{selectItem.title}</h2>
                            {selectItem.fileUrls && selectItem.fileUrls.map((url, index) => {
                                const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('.avi');
                                return isVideo ? (
                                    <video key={index} src={url} controls style={{width: "300px", margin: "10px"}}/>
                                ) : (
                                    <img key={index} src={url} alt={`image-${index}`}
                                         style={{width: "300px", margin: "10px"}}/>
                                );
                            })}
                            <div>{selectItem.content}</div>
                        </div>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection:"column", gap:"20px"}}>
                            <div className="detail-modal-tags-list">
                                {Array.isArray(selectItem.tags) ?
                                    selectItem.tags.map((tag, index) => (
                                        <span
                                            className="detail-modal-tags"
                                            key={index}
                                            onClick={() => tagSearch(tag)}
                                            style={{marginRight: '10px', cursor: 'pointer'}}
                                        >
                                        {tag}
                                    </span>
                                    ))
                                    : ''}
                            </div>
                            <button className="detail-modal-close" onClick={closeModal}>X</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Community;
