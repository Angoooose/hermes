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
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';

interface ActiveChatsProps {
    clearAuthData: () => void,
    userData: UserData|undefined,
    updateUserData: (newUserData: UserData) => Promise<boolean>,
}

export default function ActiveChats(props: ActiveChatsProps) {
    const { clearAuthData, userData } = props;
    const service = new ActiveChatsService(userData as UserData);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [isNewChatError, setIsNewChatError] = useState<boolean>(false);
    const [activeChats, setActiveChats] = useState<UserChatField[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [timeUntil, editTime] = useTimeUntil(userData?.expiresAt);
    const newChatRef = useRef<HTMLInputElement>(null);
    

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
        clearAuthData();
        window.location.reload();
    }

    if (isLoading) return <ActiveChatsSkeleton/>;
    
    return (
        <div className="active-chats-container">
            <div className="account-info">
                <div className="account-info-big">
                    <UserCircleIcon className="account-icon"/>
                    <div>
                        {userData?.username}
                        <div className="account-info-expiration-container"><ClockIcon className="account-info-clock-icon"/>Expires in {timeUntil}</div>
                    </div>
                </div>
                <Button text="Logout" isRed={true} onClick={() => logout()}></Button>
            </div>
            <ChatList activeChats={activeChats} username={userData?.username as string}/>
            <div className="new-chat-container">
                <form onSubmit={(e) => createNewChat(e)}>
                    <Input
                        placeholder="Username"
                        className="full-width"
                        ref={newChatRef}
                        onChange={(el) => handleCreateChatTyping(el.target.value)}
                    />
                    <Button text="Start Chatting" disabled={isButtonDisabled}></Button>
                </form>
                {isNewChatError && <div className="input-error">Please enter a valid username.</div>}
            </div>
        </div>
    );
}