import React, { useEffect, useState, useCallback } from "react";
import Header from "../component/header";
import { chatdb } from "../data/connectUserFirebase";
import base64 from "base-64";
import { collection, setDoc, doc, getDoc, getDocs, addDoc } from "firebase/firestore";

function Tonew() {
    const [userConnecter, setUserConnecter] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [chats, setChats] = useState([]);
    const [toUserConnect, setToUserConnect] = useState([]);

    // 토큰 디코딩 함수
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

    // 채팅 전송 함수
    const toChat = async () => {
        const user = decodeToken();
        if (!user || !user.name) {
            setError("Unable to decode user from token.");
            return;
        }

        try {
            const userChatRef = doc(chatdb, 'userChat', user.name);
            const messagesCollectionRef = collection(userChatRef, 'messages');
            await addDoc(messagesCollectionRef, {
                userMessage: userMessage,
                username: user.name,
                timestamp: new Date()
            });
            setUserMessage('');
            setSuccess('Message sent successfully!');
        } catch (e) {
            console.error("Error sending message:", e);
            setError("An error occurred while sending the message.");
        }
    };

    // 연결된 사용자 로드 함수
    const loadConnectUser = useCallback(async () => {
        try {
            const user = decodeToken();
            if (!user || !user.name) {
                console.error("Unable to decode user from token.");
                return;
            }

            const connectUserRef = collection(chatdb, 'userConnect');
            const connectuser = await getDocs(connectUserRef);
            const data = connectuser.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));

            const connectedUser = data.filter(u => u.userConnect === user.name);
            setToUserConnect(connectedUser);
        } catch (e) {
            console.error("Error loading connect users:", e);
        }
    }, []);

    // 채팅 로드 함수
    const loadChats = useCallback(async () => {
        const user = decodeToken();
        if (!user || !user.name) {
            setError("Unable to decode user from token.");
            return;
        }

        try {
            const userChatRef = doc(chatdb, 'userChat', user.name);
            const messagesCollectionRef = collection(userChatRef, 'messages');
            const userChatLists = await getDocs(messagesCollectionRef);

            let allChats = userChatLists.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }));

            if (toUserConnect.length > 0) {
                const connectedUserChats = await Promise.all(toUserConnect.map(async (connectedUser) => {
                    const otherUserChatRef = doc(chatdb, 'userChat', connectedUser.username);
                    const otherMessagesCollectionRef = collection(otherUserChatRef, 'messages');
                    const otherChatLists = await getDocs(otherMessagesCollectionRef);
                    return otherChatLists.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                }));

                allChats = [
                    ...allChats,
                    ...connectedUserChats.flat()
                ];
            }

            // 타임스탬프를 기준으로 정렬
            const sortedData = allChats.sort((a, b) => a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime());
            setChats(sortedData);

        } catch (e) {
            console.error("Error loading chats:", e);
            setError("An error occurred while loading chats.");
        }
    }, [toUserConnect]);

    // 사용자 연결 함수
    const toConnect = async () => {
        setError('');
        setSuccess('');

        try {
            const user = decodeToken();
            if (!user || !user.name) {
                setError("User not authenticated or username not found. Please login again.");
                return;
            }

            if (!userConnecter) {
                setError("Please enter a user to connect with.");
                return;
            }

            const userConnectRef = collection(chatdb, 'userConnect');
            const userToConnectDoc = await getDoc(doc(userConnectRef, userConnecter));
            if (!userToConnectDoc.exists()) {
                setError("User to connect does not exist.");
                return;
            }

            await setDoc(doc(userConnectRef, user.name), {
                username: user.name,
                userConnect: userConnecter
            }, { merge: true });

            await setDoc(doc(userConnectRef, userConnecter), {
                username: userConnecter,
                userConnect: user.name
            }, { merge: true });

            setSuccess("Connection established successfully!");
            setUserConnecter('');
        } catch (error) {
            console.error("Error in toConnect:", error);
            setError("An error occurred while establishing the connection.");
        }
    };

    // 컴포넌트가 마운트될 때 데이터 로드 및 주기적인 채팅 업데이트 설정
    useEffect(() => {
        const fetchData = async () => {
            try {
                await loadConnectUser();
                await loadChats();
            } catch (error) {
                console.error("Error in useEffect:", error);
            }
        };

        fetchData();

        // 주기적인 채팅 데이터 리로드 설정 (5초마다)
        const intervalId = setInterval(loadChats, 5000); // 5000ms = 5초

        // 컴포넌트 언마운트 시 인터벌 클리어
        return () => clearInterval(intervalId);
    }, [loadConnectUser, loadChats]); // loadConnectUser와 loadChats 함수가 변경될 때마다 호출

    return (
        <>
            <Header />
            <div>
                <input
                    value={userConnecter}
                    onChange={(e) => setUserConnecter(e.target.value)}
                    placeholder="Enter user to connect"
                />
                <button onClick={toConnect}>Connect</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <input
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Enter your message"
                />
                <button onClick={toChat}>Send Message</button>
                <div>
                    <h2>Chat Messages:</h2>
                    {chats.map(chat => (
                        <div key={chat.id}>
                            <p><strong>{chat.username}</strong>: {chat.userMessage}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <h2>Connect Users:</h2>
                    {toUserConnect.map(user => (
                        <div key={user.id}>
                            <p>{user.username}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Tonew;
