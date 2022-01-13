import '../styles/Chat.css';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, onSnapshot, getDoc, arrayUnion } from 'firebase/firestore';
import { database } from '../index';
import getMessageTimestamp from '../utils/getMessageTimestamp';

import Skeleton from 'react-loading-skeleton'

import Message from '../Types/Message';

interface ChatProps {
    username: string,
}

export default function Chat(props: ChatProps) {
    const [isSendDisabled, setIsSendDisabled] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatName, setChatName] = useState<string>('');
    const [isFailed, setIsFailed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { username } = props;
    const { chatId } = useParams();
    
    useEffect(() => {
        const chatDoc = doc(database, 'chats', chatId as string);

        getDoc(chatDoc).then(d => d.data()).then(chatData => {
            if (chatData && localStorage.getItem('username')) {
                let chatUsers: string[] = chatData?.users;
                setChatName(chatUsers.find(name => name !== localStorage.getItem('username')) as string);
            } else {
                setIsFailed(true);
            }

            setIsLoading(false);
        });

        onSnapshot(chatDoc, (doc) => {
            setMessages(doc.data()?.messages as Message[]);
        });
    }, []);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    window.addEventListener('keydown', () => {
        chatRef.current?.focus();
    });

    function sendMessage(e: FormEvent) {
        e.preventDefault();

        if (!isSendDisabled) {

            const newMessageObject = {
                author: username,
                content: chatRef.current!.value,
                timestamp: new Date().getTime(),
            }

            let newMessages = [...messages];
            newMessages.push(newMessageObject);
            setMessages(newMessages);
            formRef.current?.reset();
            setIsSendDisabled(true);

            const chatDocRef = doc(database, 'chats', chatId as string);
            
            updateDoc(chatDocRef, {
                messages: arrayUnion(newMessageObject),
            });
        }
    }

    function MessageSkeletons() {
        const skeletonsArray = [];
        const maxHeight = window.innerHeight - 320;
        for (let i = 0; i + 100 <= maxHeight; i += 100) {
            skeletonsArray.push(
                <div>
                    <Skeleton
                        baseColor="#171a29"
                        highlightColor="#282d42"
                        style={{ height: 30, width: 100, marginTop: 5, marginBottom: 5, borderRadius: '12px 12px 12px 0', opacity: 0.8 }}
                        count={3}
                    />
                    <div style={{ marginLeft: 'auto', width: 'fit-content' }}>
                        <Skeleton
                            baseColor="#1d9bf5"
                            highlightColor="#61b9f8"
                            style={{ height: 30, width: 100, marginTop: 5, marginBottom: 5, borderRadius: '12px 12px 0 12px', opacity: 0.8 }}
                            count={3}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div>
                {skeletonsArray.map(skl => skl)}
            </div>
        );
    }

    function Messages() {
        if (isLoading) return <MessageSkeletons/>
        if (messages.length > 0) {
            return (
                <div>
                    {messages.map((msg, i) => {
                        let messageClassType = 'received';
                        if (msg.author === username) messageClassType = 'sent';
        
                        let isMessageGroup = i === 0 || (msg.timestamp - messages[i - 1].timestamp <= 60000 * 5 && messages[i - 1].author === msg.author);
                        if (i === 0) isMessageGroup = false;

                        return (
                            <div className={`message-container message-container-${messageClassType}`}>
                                {!isMessageGroup && <div className="message-timestamp">{getMessageTimestamp(new Date(msg.timestamp))}</div>}
                                <div className={`message message-${messageClassType}`}>
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return <div className="no-messages">Looks like you haven't talked yet.</div>
        }
    }
    
    if (isFailed) return (
       <div className="failed-container">
           <div className="failed-header">404</div>
           <div className="failed-description">We couldn't find that chat. Maybe if you were logged into a different account we could find it.</div>
       </div> 
    );

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div>
                    <div className="gray">Chatting with:</div>
                    <div className="chat-header-big"><span className="gray">@</span> {chatName}</div>
                </div>
                <div className="chat-header-right">
                    <div className="gray">Signed in as:</div>
                    <div className="chat-header-big"><span className="gray">@</span> {username}</div>
                </div>
            </div>
            <div className="messages-container">
                <Messages/>
                <div ref={lastMessageRef}/>
            </div>
            <form onSubmit={(e) => sendMessage(e)} ref={formRef}>
                <input placeholder={`Send a message to @${chatName}`} className="full-width" ref={chatRef} onChange={(el) => setIsSendDisabled(el.target.value === '')}/>
                <button disabled={isSendDisabled}>Send</button>
            </form>
        </div>
    );
}