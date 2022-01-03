import Message from './Message';

export default interface ChatData {
    id: string,
    name: string,
    lastMessage: Message,
}