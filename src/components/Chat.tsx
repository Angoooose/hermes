import '../styles/Chat.css';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { database } from '../index';
import getMessageTimestamp from '../utils/getMessageTimestamp';

import ChatProps from '../Types/ChatProps';
import Message from '../Types/Message';

export default function Chat(props: ChatProps) {
    const [isSendDisabled, setIsSendDisabled] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatName, setChatName] = useState<string>('');
    const [isFailed, setIsFailed] = useState<boolean>(false);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { username } = props;
    const { chatId } = useParams();
    
    useEffect(() => {
        const chatDoc = doc(database, 'chats', chatId as string);

        getDoc(chatDoc).then(d => d.data()).then(chatData => {
            if (chatData && username) {
                let chatUsers: string[] = chatData?.users;
                setChatName(chatUsers.find(name => name !== username) as string);
            } else {
                setIsFailed(true);
            }
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
            let newMessages = [...messages];
            newMessages.push({
                author: username,
                content: chatRef.current!.value,
                timestamp: new Date().getTime(),
            });

            setMessages(newMessages);
            formRef.current?.reset();
            setIsSendDisabled(true);

            const chatDocRef = doc(database, 'chats', chatId as string);
            
            updateDoc(chatDocRef, {
                messages: newMessages,
            });
        }
    }

    function RenderMessages() {
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
                <RenderMessages/>
                <div ref={lastMessageRef}/>
            </div>
            <form onSubmit={(e) => sendMessage(e)} ref={formRef}>
                <input placeholder={`Send a message to @${chatName}`} className="full-width" ref={chatRef} onChange={(el) => setIsSendDisabled(el.target.value === '')}/>
                <button disabled={isSendDisabled}>Send</button>
            </form>
        </div>
    );
}