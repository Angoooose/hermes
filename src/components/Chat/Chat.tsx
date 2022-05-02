import './Chat.css';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { UserCircleIcon, AtSymbolIcon } from '@heroicons/react/outline';
import { useParams } from 'react-router-dom';
import ChatService from '../../services/ChatService';

import ChatSidebar from './ChatSidebar';
import Messages from './Messages';
import Button from '../common/Button/Button';

import Message from '../../Types/Message';
import UserData from '../../Types/UserData';
import AuthStatus from '../../Types/AuthStatus';

interface ChatProps {
    userData: UserData|undefined,
    authStatus: AuthStatus,
}

export default function Chat(props: ChatProps) {
    const { userData, authStatus } = props;
    const { chatId } = useParams();

    const [containerLeftMargin, setContainerLeftMargin] = useState<number>(-45);
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
        if (authStatus !== 'LOADING') {
            if (chatId && userData) {
                service.getChatData(userData?.username).then(chatData => {
                    if (chatData !== 0) {
                        service.liveMessageUpdate(setMessages);
                        setChatName(chatData.users.find(u => u !== userData?.username) as string);
                        setMessages(chatData.messages);
                        setIsLoading(false);
                    } else {
                        setIsFailed(true);
                    }
                });
            } else {
                setIsFailed(true);
            }
        }
    }, [userData, authStatus, chatId]);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    window.addEventListener('keydown', () => {
        chatRef.current?.focus();
    });

    function sendMessage(e: FormEvent) {
        e.preventDefault();

        if (isFailed || !userData) return;
        if (!isSendDisabled) {
            const newMessageObject: Message = {
                author: userData?.username,
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
        <div className="chat-flex">
            <ChatSidebar userData={userData} setContainerLeftMargin={setContainerLeftMargin}/>
            <div className="chat-container" style={{ marginLeft: containerLeftMargin }}>
                <div className="chat-header">
                    <div>
                        <div className="gray">Chatting with:</div>
                        <div className="chat-header-big"><AtSymbolIcon className="chat-at-icon"/>{chatName}</div>
                    </div>
                    <div className="chat-header-right">
                        <div className="gray">Signed in as:</div>
                        <a className="chat-header-big" href="/"><UserCircleIcon className="chat-account-icon"/>{userData?.username}</a>
                    </div>
                </div>
                <div className="messages-container">
                    <Messages messages={messages} isLoading={isLoading} username={userData?.username as string}/>
                    <div ref={lastMessageRef}/>
                </div>
                <form onSubmit={(e) => sendMessage(e)} ref={formRef}>
                    <input placeholder={`Send a message to @${chatName}`} className="full-width" ref={chatRef} onChange={(el) => setIsSendDisabled(el.target.value === '' || el.target.value.replace(/\s/g, '').length === 0)}/>
                    <Button text="Send" disabled={isSendDisabled || authStatus === 'LOADING'}></Button>
                </form>
            </div>
        </div>
    );
}