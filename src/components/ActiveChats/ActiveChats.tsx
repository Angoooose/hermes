import './ActiveChats.css';

import { useEffect, useState, useRef, FormEvent } from 'react';
import { ClockIcon, UserCircleIcon } from '@heroicons/react/outline';
import { getDoc, doc } from 'firebase/firestore';
import { database } from '../../index';
import useTimeUntil from '../../hooks/useTimeUntil';

import UserData, { UserChatField } from '../../Types/UserData';
import ActiveChatsService from '../../services/ActiveChatsService';

import ActiveChatsSkeleton from './ActiveChatsSkeleton';
import ChatList from './ChatList';

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const newChatRef = useRef<HTMLInputElement>(null);

    const { username, clearUsername, userData } = props;
    const service = new ActiveChatsService(userData as UserData);

    const [timeUntil, editTime] = useTimeUntil(userData?.expiresAt);

    useEffect(() => {
        if (userData) {
            service.getChats(activeChats, setActiveChats, setIsLoading);
            editTime(userData.expiresAt);
        }
    }, [userData]);

    async function createNewChat(e: FormEvent) {
        e.preventDefault();

        if (newChatRef !== null && newChatRef.current?.value !== '') {
            const newUsername = newChatRef.current?.value as string;
            const newUser = await getDoc(doc(database, 'users', newUsername));
            if (newUser.exists()) {
                if (!activeChats.some(c => c.name === newUsername)) {
                    service.createChat(newUsername).then(chatId => {
                        window.location.replace(`/chat/${chatId}`);
                    });
                } else {
                    window.location.replace(`/chat/${activeChats.find(c => c.name === newUsername)?.id}`);
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
        window.location.reload();
    }

    if (isLoading) return <ActiveChatsSkeleton/>;
    
    return (
        <div className="active-chats-container">
            <h1>Your active chats</h1>
            <div className="active-chat-cards-container">
                <div className="account-info">
                    <div className="account-info-big">
                        <UserCircleIcon className="account-icon"/>
                        <div>
                            {username}
                            <div className="account-info-expiration-container"><ClockIcon className="account-info-clock-icon"/>Expires in {timeUntil}</div>
                        </div>
                    </div>
                    <button className="logout-button" onClick={() => logout()}>Logout</button>
                </div>
                <ChatList activeChats={activeChats} username={username}/>
                <form onSubmit={(e) => createNewChat(e)}>
                    <input placeholder="Username" className="full-width" ref={newChatRef} onChange={(el) => handleCreateChatTyping(el.target.value)}/>
                    <button disabled={isButtonDisabled}>Start Chatting</button>
                </form>
                {isNewChatError && <div className="input-error">Please enter a valid username.</div>}
            </div>
        </div>
    );
}