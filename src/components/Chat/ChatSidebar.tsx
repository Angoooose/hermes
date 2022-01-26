import './ChatSidebar.css';

import { Dispatch, useState } from 'react';
import { ArrowCircleLeftIcon, MenuAlt1Icon } from '@heroicons/react/outline';
import UserData from '../../Types/UserData';
import SidebarChatList from './SidebarChatList';

interface ChatSidebarProps {
    userData: UserData|undefined;
    setContainerLeftMargin: Dispatch<number>,
}

export default function ChatSidebar(props: ChatSidebarProps) {
    const { userData, setContainerLeftMargin } = props;
    const [sidebarX, setSidebarX] = useState<number>(0);
    const [expandButtonX, setExpandButtonX] = useState<number>(-60);

    function toggleSidebar() {
        if (sidebarX === 0) {
            setSidebarX(-370);
            setContainerLeftMargin(-375);
            setTimeout(() => setExpandButtonX(0), 800);
        } else {
            setSidebarX(0);
            setContainerLeftMargin(-45);
            setExpandButtonX(-60);
        }
    }

    return (
        <div className="chat-sidebar-container" style={{ transform: `translateX(${sidebarX}px)` }}>
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    Chats
                    <ArrowCircleLeftIcon className="sidebar-icon" onClick={() => toggleSidebar()}/>
                </div>
                <SidebarChatList userData={userData}/>
                </div>
            <div className="sidebar-expand-button" style={{ transform: `translateX(${expandButtonX}px)` }}>
                <MenuAlt1Icon className="sidebar-icon" onClick={() => toggleSidebar()}/>
            </div>
        </div>
    );
}