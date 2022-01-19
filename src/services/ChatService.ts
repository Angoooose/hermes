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

    public getChatData(username: string): Promise<ChatData|0> {
        return new Promise(resolve => {
            getDoc(this.documentRef).then(d => d.data()).then(res => {
                if (res) {
                    if (res.users.includes(username)) {
                        resolve(res as ChatData);
                    } else {
                        resolve(0);
                    }
                } else {
                    resolve(0);
                }
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