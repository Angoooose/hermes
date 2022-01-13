import './ActiveChats.css';

import { useEffect, useState, useRef, FormEvent } from 'react';

import { getDoc, doc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { database } from '../../index';
import getMessageTimestamp from '../../utils/getMessageTimestamp';

import UserData, { UserChatField } from '../../Types/UserData';

interface ActiveChatsProps {
    username: string,
    clearUsername: () => void,
    userData: UserData|undefined,
    updateUserData: (newDoc: UserData) => Promise<void>,
}

export default function ActiveChats(props: ActiveChatsProps) {
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [isNewChatError, setIsNewChatError] = useState<boolean>(false);
    const [activeChats, setActiveChats] = useState<UserChatField[]>([]);
    const newChatRef = useRef<HTMLInputElement>(null);
    const { username, clearUsername, userData, updateUserData } = props;

    useEffect(() => {
        if (userData) {
            let newUserDoc: UserChatField[] = [];
            for (let i = 0; i < userData.chats.length; i++) {
                getDoc(doc(database, 'chats', userData.chats[i].id)).then(chatQuery => {
                    let chatData = chatQuery.data();
                    newUserDoc.push({
                        ...userData.chats[i],
                        lastMessage: chatData?.messages[chatData?.messages.length - 1],
                    });
    
                    if (i === userData.chats.length - 1) setActiveChats(newUserDoc);
                });
            }
        }
    }, [userData]);

    async function createNewChat(e: FormEvent) {
        e.preventDefault();

        if (newChatRef !== null && newChatRef.current?.value !== '') {
            const newUserName = newChatRef.current?.value as string;
            const newUserData = await getDoc(doc(database, 'users', newUserName)).then(d => d.data());
            if (newUserData) {
                if (!activeChats.some(c => c.name === newUserName)) {
                    let newChat = await addDoc(collection(database, 'chats'), {
                        messages: [],
                        users: [username, newUserName],
                    });
    
                    let newChats = [...userData?.chats as UserChatField[]];
                    newChats.push({
                        id: newChat.id,
                        name: newUserName,
                    });

                    await updateUserData({
                        chats: newChats,
                    } as UserData);
    
                    await getDoc(doc(database, 'users', newUserName)).then(d => d.data()).then(async userDoc => {
                        let newChats = [...userDoc?.chats];
                        newChats.push({
                            id: newChat.id,
                            name: username,
                        });
    
                        await updateDoc(doc(database, 'users', newUserName), {
                            chats: newChats,
                        });
                    });
    
                    window.location.replace(`/chat/${newChat.id}`);
                } else {
                    window.location.replace(`/chat/${activeChats.find(c => c.name === newUserName)?.id}`);
                }
            } else {
                setIsNewChatError(true);
                setIsButtonDisabled(true);
            }
        }
    }

    function handleCreateChatTyping(inputValue: string) {
        setIsButtonDisabled(inputValue === '');
        setIsNewChatError(false);
    }

    function logout() {
        localStorage.removeItem('token');
        clearUsername();
    }

    function ChatList() {
        if (activeChats.length > 0) {
            return (
                <div>
                    {activeChats.map(chat => {
                        return (
                            <a className="active-chat-card" href={`/chat/${chat.id}`}>
                                <div className="active-chat-name"><span className="gray">@</span> {chat.name}</div>
                                <div className="active-chat-right">
                                    {chat.lastMessage ?
                                        <div>
                                            <div className="active-chat-timestamp">{getMessageTimestamp(new Date(chat.lastMessage.timestamp))}</div>
                                            <div className={`active-chat-last-msg ${chat.lastMessage.author === username ? 'active-chat-last-msg-sent' : ''}`}>{chat.lastMessage.content}</div>
                                        </div> : <div className="gray">No messages sent</div>}
                                </div>
                            </a>
                        );
                    })}
                </div>
            );
        } else {
            return <div className="no-chats">Looks like you haven't messaged anybody yet...</div>
        }
    }

    return (
        <div className="active-chats-container">
            <h1>Your active chats</h1>
            <div className="active-chat-cards-container">
                <div className="active-chats-account-info">
                    <div>
                        <div className="gray">Signed in as:</div>
                        <div className="active-chats-account-info-big"><span className="gray">@</span> {username}</div>
                    </div>
                    <button className="logout-button" onClick={() => logout()}>Logout</button>
                </div>
                <ChatList/>
                <form onSubmit={(e) => createNewChat(e)}>
                    <input placeholder="Username" className="full-width" ref={newChatRef} onChange={(el) => handleCreateChatTyping(el.target.value)}/>
                    <button disabled={isButtonDisabled}>Start Chatting</button>
                </form>
                {isNewChatError && <div className="input-error">Please enter a valid username.</div>}
            </div>
        </div>
    );
}