import './Chat.css';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { UserCircleIcon, AtSymbolIcon } from '@heroicons/react/outline';
import { useParams } from 'react-router-dom';
import ChatService from '../../services/ChatService';
import Message from '../../Types/Message';
import Messages from './Messages';

interface ChatProps {
    username: string,
}

export default function Chat(props: ChatProps) {
    const { username } = props;
    const { chatId } = useParams();

    const [isSendDisabled, setIsSendDisabled] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatName, setChatName] = useState<string>('');
    const [isFailed, setIsFailed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const service = new ChatService(chatId as string);

    useEffect(() => {
        if (chatId) {
            service.getChatData().then(chatData => {
                if (chatData) {
                    service.liveMessageUpdate(setMessages);
                    setChatName(chatData?.users.find(u => u !== localStorage.getItem('username')) as string);
                    setMessages(chatData?.messages);
                    setIsLoading(false);
                } else {
                    setIsFailed(true);
                }
            });
        } else {
            setIsFailed(true);
        }
    }, []);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    window.addEventListener('keydown', () => {
        chatRef.current?.focus();
    });

    function sendMessage(e: FormEvent) {
        e.preventDefault();

        if (isFailed) return;
        if (!isSendDisabled) {
            const newMessageObject: Message = {
                author: username,
                content: chatRef.current!.value,
                timestamp: new Date().getTime(),
            }

            let newMessages = [...messages];
            newMessages.push(newMessageObject);
            setMessages(newMessages);
            formRef.current?.reset();
            setIsSendDisabled(true);
            
            service.addMessage(newMessageObject);
        }
    }

    if (isFailed) return (
       <div className="failed-container">
           <div className="failed-header">404</div>
           <div className="failed-description">We couldn't find that chat. You may be signed into the wrong account or the chat expired.</div>
       </div> 
    );

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div>
                    <div className="gray">Chatting with:</div>
                    <div className="chat-header-big"><AtSymbolIcon className="chat-at-icon"/>{chatName}</div>
                </div>
                <div className="chat-header-right">
                    <div className="gray">Signed in as:</div>
                    <a className="chat-header-big" href="/"><UserCircleIcon className="chat-account-icon"/>{username}</a>
                </div>
            </div>
            <div className="messages-container">
                <Messages messages={messages} isLoading={isLoading} username={username}/>
                <div ref={lastMessageRef}/>
            </div>
            <form onSubmit={(e) => sendMessage(e)} ref={formRef}>
                <input placeholder={`Send a message to @${chatName}`} className="full-width" ref={chatRef} onChange={(el) => setIsSendDisabled(el.target.value === '')}/>
                <button disabled={isSendDisabled || isLoading}>Send</button>
            </form>
        </div>
    );
}