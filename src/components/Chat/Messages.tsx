import './Messages.css';

import Message from '../../Types/Message';
import MessageSkeletons from './MessageSkeletons';
import getMessageTimestamp from '../../utils/getMessageTimestamp';

interface MessagesProps {
    messages: Message[],
    isLoading: boolean,
    username: string,
}

export default function Messages(props: MessagesProps) {
    const { messages, isLoading, username } = props;

    if (isLoading) return <MessageSkeletons/>
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