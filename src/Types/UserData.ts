import Message from './Message';

export interface UserChatField {
    id: string,
    name: string,
    lastMessage?: Message,
}

export default interface UserData {
    username: string,
    pin: string|number,
    expiresAt: number,
    chats: UserChatField[],
    loginTokens: string[],
    status?: 'LOADING'|'SUCCESS'|'FAILED'|'LOGIN',
}