import '../styles/ActiveChats.css';

import { useEffect, useState, useRef, FormEvent } from 'react';

import { getDoc, doc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { database } from '../index';

import ActiveChatsProps from '../Types/ActiveChatsProps';
import ChatData from '../Types/ChatData';

export default function ActiveChats(props: ActiveChatsProps) {
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [activeChats, setActiveChats] = useState<ChatData[]>([]);
    const newChatRef = useRef<HTMLInputElement>(null);
    const { username } = props;

    useEffect(() => {
        getDoc(doc(database, 'users', username)).then(d => d.data()).then(async userDoc => {
            let typedUserDoc = userDoc?.chats as ChatData[];
            let newUserDoc: ChatData[] = [];

            for (let i = 0; i < typedUserDoc.length; i++) {
                getDoc(doc(database, 'chats', typedUserDoc[i].id)).then(chatQuery => {
                    let chatData = chatQuery.data();
                    newUserDoc.push({
                        ...typedUserDoc[i],
                        lastMessage: chatData?.messages[chatData?.messages.length - 1],
                    });

                    if (i === typedUserDoc.length - 1) setActiveChats(newUserDoc);
                });
            }
        });
    }, []);

    function LoadChats() {
        if (activeChats.length > 0) {
            return (
                <div>
                    {activeChats.map(chat => {
                        return (
                            <a className="active-chat-card" href={`/chat/${chat.id}`}>
                                <div className="active-chat-name"><span className="gray">@</span> {chat.name}</div>
                                <div className="active-chat-right">
                                    <div className="active-chat-timestamp">{new Date(chat.lastMessage.timestamp).toDateString()}</div>
                                    <div className={`active-chat-last-msg ${chat.lastMessage.author === username ? 'active-chat-last-msg-sent' : ''}`}>{chat.lastMessage.content}</div>
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

    async function createNewChat(e: FormEvent) {
        e.preventDefault();

        if (newChatRef !== null && newChatRef.current?.value !== '') {
            let newUserName = newChatRef.current?.value as string;
            if (!activeChats.some(c => c.name === newUserName)) {
                let newChat = await addDoc(collection(database, 'chats'), {
                    messages: [],
                    users: [username, newUserName],
                });

                getDoc(doc(database, 'users', username)).then(d => d.data()).then(userDoc => {
                    let newChats = [...userDoc?.chats];
                    newChats.push({
                        id: newChat.id,
                        name: newUserName,
                    });

                    updateDoc(doc(database, 'users', username), {
                        chats: newChats,
                    });
                });

                getDoc(doc(database, 'users', newUserName)).then(d => d.data()).then(userDoc => {
                    let newChats = [...userDoc?.chats];
                    newChats.push({
                        id: newChat.id,
                        name: username,
                    });

                    updateDoc(doc(database, 'users', newUserName), {
                        chats: newChats,
                    });

                    window.location.replace(`/chat/${newChat.id}`);
                });

                
                window.location.replace(`/chat/${newChat.id}`);
            } else {
                window.location.replace(`/chat/${activeChats.find(c => c.name === newUserName)?.id}`);
            }
        }
    }

    return (
        <div className="active-chats-container">
            <h1>Your active chats</h1>
            <LoadChats/>
            <form onSubmit={(e) => createNewChat(e)}>
                <input placeholder="Name (eg. John Doe)" className="full-width" ref={newChatRef} onChange={(el) => setIsButtonDisabled(el.target.value === '')}/>
                <button disabled={isButtonDisabled}>Start Chatting</button>
            </form>
        </div>
    );
}