import Message from './Message';

export default interface ChatData {
    messages: Message[],
    users: string[],
}