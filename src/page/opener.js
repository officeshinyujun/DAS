import ReactQuill from "react-quill";
import Header from "../component/header";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { openerImageDb, openerImagestorage } from "../data/openerImageFirebase";
import base64 from "base-64";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Modal from 'react-modal';
import "../design/opener.css"
import {Link} from "react-router-dom";

// 모달 스타일
const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '55vw',
        height: '50vh',
        border: "none",
        borderRadius:"10px",
        color:"white",
        backgroundColor: "#171A29",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)' // 검은색 배경, 투명도 75%
    }
};
const modalStylses2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '55vw',
        height: '50vh',
        border: "none",
        borderRadius:"10px",
        color:"white",
        backgroundColor: "#171A29",
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)' // 검은색 배경, 투명도 75%
    }
}

// react-modal 초기화
Modal.setAppElement('#root'); // #root는 애플리케이션의 루트 DOM 요소입니다.

function Opener() {
    const quillRef = useRef();
    const [content, setContent] = useState("");
    const [contentTitle, setContentTitle] = useState("");
    const [contentTags, setContentTags] = useState("");
    const [posts, setPosts] = useState([]); // 글 목록 상태
    const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 글 목록 상태
    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
    const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
    const [modalContent, setModalContent] = useState(null); // 모달에 표시할 상세 내용
    const [key, setKey] = useState(0); // 리렌더링을 위한 키 값

    const decodeToken = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("Token not found in localStorage.");
            return null;
        }

        try {
            const payload = token.split('.')[1]; // 중간의 페이로드 부분 추출
            const decoded = base64.decode(payload);
            return JSON.parse(decoded);
        } catch (err) {
            console.error("Error decoding or parsing token:", err);
            return null;
        }
    };

    const imageHandler = () => {
        if (!quillRef.current) return; // quillRef가 정의되어 있는지 확인
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.addEventListener("change", async () => {
            const file = input.files[0];
            if (!file) return; // 파일이 선택되지 않으면 종료

            const editor = quillRef.current.getEditor();
            const range = editor.getSelection(true);
            try {
                const storageRef = ref(openerImagestorage, `image/${Date.now()}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                editor.insertEmbed(range.index, "image", url);
                editor.setSelection(range.index + 1);
            } catch (error) {
                console.error("Error uploading image: ", error);
            }
        });
    };

    const upload = () => {
        const token = decodeToken();
        console.log(token);

        // Split tags by #, filter out empty strings, and trim whitespace
        const tagsArray = contentTags.split('#').filter(tag => tag.trim()).map(tag => tag.trim());

        const openerDocsRef = collection(openerImageDb, 'write');
        addDoc(openerDocsRef, {
            title: contentTitle,
            content: content,
            tags: tagsArray, // Store the tags array
            users: token ? token.name : "Anonymous" // Default to "Anonymous" if no token
        }).then(() => {
            console.log("Document successfully written!");
            fetchPosts(); // Refresh the post list after upload
            setIsModalOpen(false); // Close the modal after upload
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    };

    const fetchPosts = async () => {
        const openerDocsRef = collection(openerImageDb, 'write');
        try {
            const querySnapshot = await getDocs(openerDocsRef);
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
            setFilteredPosts(postsData); // Initialize filtered posts
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            setKey(prevKey => prevKey + 1); // Increment key to force re-render of Quill when modal opens
        }
    }, [isModalOpen]);

    useEffect(() => {
        // Filter posts based on search query and selected tags
        const filtered = posts.filter(post => {
            const title = post.title || ''; // Default to empty string if undefined
            const content = post.content || ''; // Default to empty string if undefined

            const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                content.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTags = selectedTags.every(tag => post.tags && post.tags.includes(tag));
            return matchesSearch && matchesTags;
        });
        setFilteredPosts(filtered);
    }, [searchQuery, selectedTags, posts]);

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, false] }],
                    ["bold", "underline"],
                    ["image"],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        };
    }, []);

    const extractFirstImage = (htmlContent) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const img = tempDiv.querySelector('img');
        return img ? img.src : null;
    };

    const handleTagClick = (tag) => {
        setSelectedTags(prevTags => {
            if (prevTags.includes(tag)) {
                return prevTags.filter(t => t !== tag);
            } else {
                return [...prevTags, tag];
            }
        });
    };

    const openDetailModal = (post) => {
        setModalContent(post);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null); // Clear modal content when closing
    };

    return (
        <div className="opener-container">
            <Header />
            <div className="opener-content-postlist">
                <div className="opener-content-searchandadd">
                    <input
                        type="text"
                        placeholder="Search posts"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={() => setIsModalOpen(true)}  className="addButton">Add</button>
                </div>
                {filteredPosts.map(post => (
                    <div key={post.id}
                         className="opener-content-posts"
                         style={{padding: '20px', cursor: 'pointer'}} onClick={() => openDetailModal(post)}>
                        <div>
                            {extractFirstImage(post.content) && (
                                <img
                                    src={extractFirstImage(post.content)}
                                    alt="Preview"
                                    style={{ height: '14.5rem', maxWidth:"19vw", display: 'block', margin: '10px 0' }}
                                />
                            )}
                        </div>
                        <div className="opener-content-posts-prebviewText">
                            <div style={{display: "flex", flexDirection:"column", justifyContent:"center"}}>
                                <p style={{fontSize:"50px", color:"white", fontWeight:"bolder"}}>{post.title}</p>
                                <p style={{fontSize:"20px", color:"#a1a1a1"}}>{post.users}</p>
                            </div>
                            {post.tags && post.tags.length > 0 && (
                                <div className="opener-content-posts-tags-list">
                                    {post.tags.map(tag => (
                                        <div
                                            className="opener-content-posts-tags"
                                            key={tag}
                                            onClick={() => handleTagClick(tag)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            #{tag}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 상세 모달 */}
            {modalContent && (
                <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStylses2}>
                    <div className="modal-content2-title">
                        <h2>{modalContent.title}</h2>
                        <Link to="/userProfile"><p>{modalContent.users}</p></Link>
                        {window.localStorage.setItem("whoUsers",modalContent.users)}

                    </div>
                    <div
                        dangerouslySetInnerHTML={{ __html: modalContent.content }}
                        style={{ marginBottom: '20px' }}
                        className="modal-content-imgset"
                    />
                    <div style={{display: "flex", justifyContent: "flex-start", alignItems:"center", gap:"0.6rem"}}>
                        {modalContent.tags && modalContent.tags.map((tag, index) => (
                            <div
                                className="modal-content2-tags"
                                key={index}
                                onClick={() => handleTagClick(tag)}
                                style={{ cursor: 'pointer', marginRight: '5px' }}
                            >
                                #{tag}
                            </div>
                        ))} 
                    </div>
                    <div style={{ textAlign: 'center'}}>
                        <button onClick={closeModal} style={{border:"none", background:"none" , color:"white" , fontSize:"1rem"}}>X</button>
                    </div>
                </Modal>
            )}

            {/* 업로드 모달 */}
            {isModalOpen && !modalContent && (
                <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyles}>
                    <input
                        type="text"
                        placeholder="Enter title"
                        value={contentTitle}
                        onChange={(e) => setContentTitle(e.target.value)}
                        style={{width: "50vw", marginBottom: "10px", boxSizing: "border-box"}}
                        className="opener-content-modal-input"
                        required
                    />
                    <ReactQuill
                        key={key}
                        style={{
                            width: "50vw",
                            height: "300px",
                            border: "none",
                            backgroundColor: "#131620",
                            color: "white",
                            marginBottom: "1.4rem"
                        }}
                        placeholder="Write something..."
                        theme="snow"
                        ref={quillRef}
                        value={content}
                        onChange={setContent}
                        modules={modules}
                    />
                    <div className="opener-content-modal-interaction">
                        <input
                            type="text"
                            placeholder="태그를 쉼표로 구분해 입력하세요"
                            value={contentTags}
                            onChange={(e) => setContentTags(e.target.value)}
                            className="opener-content-modal-tags-input"
                            required
                        />
                        <button onClick={upload} className="opener-content-modal-upload">업로드</button>
                    </div>
                    <button onClick={closeModal} className="opener-content-modal-close">X</button>
                </Modal>
            )}
        </div>
    );
}

export default Opener;
