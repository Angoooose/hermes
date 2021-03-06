import './ChatList.css';

import { Link } from 'react-router-dom';
import { UserChatField } from '../../Types/UserData';
import getMessageTimestamp from '../../utils/getMessageTimestamp';

interface ChatListProps {
    activeChats: UserChatField[],
    username: string,
}

export default function ChatList(props: ChatListProps) {
    const { activeChats, username } = props;
    const filteredChats = activeChats.filter(c => c.lastMessage);

    return (
        <div>
            {filteredChats.map(chat => {
                return (
                    <Link className="active-chat-card" to={`/chat/${chat.id}`}>
                        <div className="active-chat-name"><span className="gray">@</span> {chat.name}</div>
                        <div className="active-chat-right">
                            {chat.lastMessage ?
                                <div>
                                    <div className="active-chat-timestamp">{getMessageTimestamp(new Date(chat.lastMessage.timestamp))}</div>
                                    <div className={`active-chat-last-msg ${chat.lastMessage.author === username ? 'active-chat-last-msg-sent' : ''}`}>{chat.lastMessage.content}</div>
                                </div> : <div className="gray">No messages sent</div>}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}