import { doc, updateDoc, onSnapshot, arrayUnion, addDoc, collection } from 'firebase/firestore';
import { Dispatch } from 'react';
import { database } from '../index';
import ChatData from '../Types/ChatData';

import UserData, { UserChatField } from '../Types/UserData';

export default class ActiveChatsService {
    private userData: UserData;

    constructor(user: UserData) {
        this.userData = user;
    }

    public getChats(activeChats: UserChatField[], setActiveChats: Dispatch<UserChatField[]>, setIsLoading: Dispatch<boolean>): void {
        let activeChatsCopy = [...activeChats];
        onSnapshot(collection(database, 'chats'), (snap) => {
            let newActiveChats = [...activeChatsCopy];
            const filteredChanges = snap.docChanges().filter(chat => this.userData.chats.some(c => c.id === chat.doc.id));
            if (filteredChanges.length === 0) setIsLoading(false);
            filteredChanges.forEach((change, i) => {
                const chatIndex = newActiveChats.findIndex(c => c.id === change.doc.id);
                const chatData = change.doc.data() as ChatData;
                const lastMessage = chatData.messages[chatData?.messages.length - 1];

                if (change.type === 'modified' && chatIndex > -1) {
                    newActiveChats[chatIndex].lastMessage = lastMessage;
                    activeChatsCopy[chatIndex].lastMessage = lastMessage;
                    setActiveChats(newActiveChats);
                }
     
                if (change.type === 'added' && activeChatsCopy.every(c => c.id !== change.doc.id)) {
                    const newChat = {
                        id: change.doc.id,
                        name: chatData.users.find(user => user != this.userData.username) as string,
                        lastMessage: lastMessage,
                    }

                    newActiveChats.push(newChat);
                    activeChatsCopy.push(newChat)
                    setActiveChats(newActiveChats);
                }
                
                if (change.type === 'removed') {
                    newActiveChats.splice(chatIndex, 1);
                    activeChatsCopy.splice(chatIndex, 1);
                    setActiveChats(newActiveChats);
                }

                if (i === filteredChanges.length - 1 || filteredChanges.length === 1) setIsLoading(false);
            });
        });
    }

    public createChat(user: string): Promise<string> {
        return new Promise(async resolve => {
            let newChat = await addDoc(collection(database, 'chats'), {
                messages: [],
                users: [this.userData.username, user],
            });
    
            await updateDoc(doc(database, 'users', this.userData.username), {
                chats: arrayUnion({
                    id: newChat.id,
                    name: user,
                }),
            });
    
            await updateDoc(doc(database, 'users', user), {
                chats: arrayUnion({
                    id: newChat.id,
                    name: this.userData.username,
                }),
            });

            resolve(newChat.id);
        });
    }
}