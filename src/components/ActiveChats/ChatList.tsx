import './ChatList.css';

import { UserChatField } from '../../Types/UserData';
import getMessageTimestamp from '../../utils/getMessageTimestamp';

interface ChatListProps {
    activeChats: UserChatField[],
    username: string,
}

export default function ChatList(props: ChatListProps) {
    const { activeChats, username } = props;
    const filteredChats = activeChats.filter(c => c.lastMessage);

    if (filteredChats.length > 0) {
        return (
            <div>
                {filteredChats.map(chat => {
                    return (
                        <a className="active-chat-card" href={`/chat/${chat.id}`}>
                            <div className="active-chat-name"><span className="gray">@</span> {chat.name}</div>
                            <div className="active-chat-right">
                                {chat.lastMessage ?
                                    <div>
                                        <div className="active-chat-timestamp">{getMessageTimestamp(new Date(chat.lastMessage.timestamp))}</div>
                                        <div className={`active-chat-last-msg ${chat.lastMessage.author === username ? 'active-chat-last-msg-sent' : ''}`}>{chat.lastMessage.content}</div>
                                    </div> : <div className="gray">No messages sent</div>}
                            </div>
                        </a>
                    );
                })}
            </div>
        );
    } else {
        return <div className="empty-error">Looks like you haven't messaged anybody yet...</div>
    }
}