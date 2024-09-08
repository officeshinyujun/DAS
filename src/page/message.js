import React, { useEffect, useState, useCallback } from "react";
import Header from "../component/header";
import { openerdb } from "../data/openerFirebase";
import base64 from "base-64";
import { collection, setDoc, doc, getDoc, addDoc,getDocs, onSnapshot, query, where } from "firebase/firestore";

function Tonew() {
    const [userConnecter, setUserConnecter] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [chats, setChats] = useState([]);
    const [toUserConnect, setToUserConnect] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Tracks the selected user for chatting

    // Decode token function
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

    // Send a message to the currently selected user
    const toChat = async () => {
        const user = decodeToken();
        if (!user || !user.name) {
            setError("Unable to decode user from token.");
            return;
        }

        if (!selectedUser) {
            setError("Please select a user to chat with.");
            return;
        }

        try {
            // Use a unique chat room for each user pair (a-b, a-c, etc.)
            const chatRoomId = [user.name, selectedUser.username].sort().join('_');
            const userChatRef = doc(openerdb, 'chats', chatRoomId);
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

    // Load the connected users
    const loadConnectUser = async () => {
        try {
            const user = decodeToken();
            if (!user || !user.name) {
                console.error("Unable to decode user from token.");
                return;
            }

            const connectUserRef = collection(openerdb, 'userConnect');
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
    };

    // Load chats for the selected user
    const loadChats = useCallback(async () => {
        const user = decodeToken();
        if (!user || !user.name) {
            setError("Unable to decode user from token.");
            return;
        }

        if (!selectedUser) {
            setChats([]);
            return;
        }

        try {
            // Use the chat room ID unique to the user pair
            const chatRoomId = [user.name, selectedUser.username].sort().join('_');
            const selectedUserChatRef = doc(openerdb, 'chats', chatRoomId);
            const messagesCollectionRef = collection(selectedUserChatRef, 'messages');

            // Listener for the selected user's messages
            onSnapshot(messagesCollectionRef, (snapshot) => {
                const allChats = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                // Sort by timestamp
                const sortedData = allChats.sort((a, b) => a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime());
                setChats(sortedData);
            });
        } catch (e) {
            console.error("Error loading chats:", e);
            setError("An error occurred while loading chats.");
        }
    }, [selectedUser]);

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

            // 올바르게 컬렉션과 문서 참조
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

            setSuccess("Connection established successfully!");
            setUserConnecter('');
        } catch (error) {
            console.error("Error in toConnect:", error);
            setError("An error occurred while establishing the connection.");
        }
    };


    // Load chats and connected users on component mount
    useEffect(() => {
        loadConnectUser();
    }, []);

    // Load chats when the selected user changes
    useEffect(() => {
        loadChats();
    }, [selectedUser, loadChats]);

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
                    <h2>Chat Messages with {selectedUser ? selectedUser.username : "..."}</h2>
                    {chats.map(chat => (
                        <div key={chat.id}>
                            <p><strong>{chat.username}</strong>: {chat.userMessage}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <h2>Connected Users:</h2>
                    {toUserConnect.map(user => (
                        <div key={user.id} onClick={() => setSelectedUser(user)}>
                            <p>{user.username}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Tonew;
