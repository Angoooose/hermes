import '../styles/Chat.css';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { database } from '../index';

import ChatProps from '../Types/ChatProps';
import Message from '../Types/Message';

export default function Chat(props: ChatProps) {
    const [isSendDisabled, setIsSendDisabled] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const chatRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { username } = props;
    const { chatId } = useParams();
    
    useEffect(() => {
        onSnapshot(doc(database, 'chats', chatId as string), (doc) => {
            setMessages(doc.data()?.messages as Message[]);
        });
    }, []);

    function sendMessage(e: FormEvent) {
        e.preventDefault();

        if (!isSendDisabled) {
            let newMessages = [...messages];
            newMessages.push({
                author: username,
                content: chatRef.current!.value,
                timestamp: new Date().toJSON(),
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
                    {messages.map(msg => {
                        let messageClassType = 'received';
                        if (msg.author === username) messageClassType = 'sent';
        
                        return (
                            <div className={`message-container message-container-${messageClassType}`}>
                                <div className="message-timestamp">{new Date(msg.timestamp).toDateString()}</div>
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
    
    return (
        <div className="chat-container">
            <div className="messages-container">
                <RenderMessages/>
                {/* <div className="message-container">
                    <div className="message-timestamp">Today @ 1:21 PM</div>
                    <div className="message message-received">
                        hey, how are you?
                    </div>
                </div>
                <div className="message-container message-container-sent">
                    <div className="message-timestamp">Today @ 1:25 PM</div>
                    <div className="message message-sent">
                        i'm good, thanks
                    </div>
                </div> */}
            </div>
            <form onSubmit={(e) => sendMessage(e)} ref={formRef}>
                <input placeholder="Send a message to @user" className="full-width" ref={chatRef} onChange={(el) => setIsSendDisabled(el.target.value === '')}/>
                <button disabled={isSendDisabled}>Send</button>
            </form>
        </div>
    );
}