import { doc, updateDoc, onSnapshot, getDoc, arrayUnion, DocumentReference } from 'firebase/firestore';
import { Dispatch } from 'react';
import { database } from '../index';

import ChatData from '../Types/ChatData';
import Message from '../Types/Message';

export default class ChatService {
    private documentRef: DocumentReference;

    constructor(chatId: string) {
        this.documentRef = doc(database, 'chats', chatId);
    };

    public getChatData(): Promise<ChatData|undefined> {
        return new Promise(resolve => {
            getDoc(this.documentRef).then(d => d.data()).then(res => {
                resolve(res as ChatData|undefined);
            });
        });
    }

    public addMessage(newMessage: Message): void {
        updateDoc(this.documentRef, {
            messages: arrayUnion(newMessage),
        });
    }

    public liveMessageUpdate(setMessages: Dispatch<Message[]>): void {
        onSnapshot(this.documentRef, (doc) => {
            setMessages(doc.data()?.messages);
        });
    }
}