import './SidebarChatList.css';
import { useEffect, useState } from 'react';
import ActiveChatsService from '../../services/ActiveChatsService';
import UserData, { UserChatField } from '../../Types/UserData';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useParams } from 'react-router';

interface SidebarChatListProps {
    userData: UserData|undefined,
}

export default function SidebarChatList({ userData }: SidebarChatListProps) {
    const [chats, setChats] = useState<UserChatField[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { chatId } = useParams();

    useEffect(() => {
        if (userData) {
            const service = new ActiveChatsService(userData as UserData);
            service.getChats(chats, setChats, setIsLoading);
        }
    }, [userData]);

    if (isLoading) return (
        <SkeletonTheme baseColor="#282d42" highlightColor="#464f74">
            {Array(5).fill(null).map(() => {
                return (
                    <div className="sidebar-chat">
                        <Skeleton height={25} width={60}/>
                        <Skeleton height={30} width={60} style={{ borderRadius: 'var(--msg-right-border-radius)' }}/>
                    </div>
                );
            })}
        </SkeletonTheme>
    );

    if (chats.length > 0) { 
        return (
            <div className="sidebar-chats-container">
                {chats.filter(c => c.lastMessage).map(chat => {
                    return (
                        <a className="sidebar-chat" href={`/chat/${chat.id}`}>
                            <div className="flex-row align-center">
                                <CheckCircleIcon className="sidebar-chat-check-icon" display={chat.id === chatId ? 'block' : 'none'}/>
                                <div className="sidebar-chat-name"><span className="gray">@</span> {chat.name}</div>
                            </div>
                            <div className={`sidebar-last-msg ${chat.lastMessage?.author === userData?.username ? 'message-sent' : ''}`}>{chat.lastMessage?.content}</div>
                        </a>
                    );
                })}
            </div>
        );
    } else {
        return <div className="empty-error">You don't have any chats. <a className="blue-link" href="/">Go here to create one.</a></div>
    }
}