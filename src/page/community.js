import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { openerdb, openerstorage } from "../data/openerFirebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from "uuid";
import "../design/community.css"; // 스타일 시트 이름 변경
import Header from "../component/header";
import base64 from "base-64";
import { Link } from "react-router-dom";

Modal.setAppElement('#root');

function Community(key, value) {
    const [fileUploads, setFileUploads] = useState([]); // 이미지 및 비디오 파일 상태
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
                fileUrls: fileUrls, // fileUrls로 통합
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
            console.log("잘불러옴ㅇㅇ");
        } catch (error) {
            console.error("Error loading documents: ", error);
        }
    };

    const handleFileChange = (e) => {
        setFileUploads([...e.target.files]);
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
                                const url = doc.fileUrls[0]; // 배열의 첫 번째 항목만 가져옵니다.
                                const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('.avi'); // 파일 확장자를 기준으로 비디오 여부 확인
                                return isVideo ? (
                                    <video key={0} src={url} controls style={{ width: "200px", margin: "10px" }} />
                                ) : (
                                    <img key={0} src={url} alt={`image-0`} style={{ width: "200px", margin: "10px" }} />
                                );
                            })()}
                        </div>
                        <div style={{
                            color: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: "column",
                            padding: "20px",
                            width:"100%"
                        }}>
                            <div style={{display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between", width:"90%"}}>
                                <div style={{display: "flex", gap:"20px", alignItems: "center"}}>
                                    <h1>{doc.title}</h1>
                                    <p>{doc.users}</p>
                                </div>
                                <div style={{display: "flex", gap:"20px"}}>
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
                <div style={{display: "flex", justifyContent: "flex-start", width: "90%", marginTop:"30px"}}>
                    <div style={{background:"#282828", width:"280px", borderRadius:"5px", height:"44px", display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                        <input
                            id="titleSearch"
                            className="tagsearch-input"
                            color="white"
                            value={searchWhat}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="검색할 태그나 제목을 입력하세요"
                        />
                        <button onClick={toSearchTags}
                                className="tagsearch-button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.342a5.5 5.5 0 1 0-1.397 1.397l3.75 3.75a1 1 0 0 0 1.415-1.415l-3.75-3.75zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            <div className="community-content-list-container">
                {writeDocs()}
            </div>
            <button className="community-content-add-btn" onClick={() => {setModalOpen2(true)}}>
                <p>+</p>
            </button>
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
                                const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('.avi'); // 파일 확장자를 기준으로 비디오 여부 확인
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
