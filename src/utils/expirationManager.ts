import { database } from '../index';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import UserData from '../Types/UserData';

// I would much rather have this as a cloud function or a seperate NodeJS app, however I am keeping it in 
// the React app to make it easier for people to clone the repo and run the app locally.

export default async function deleteExpiredUsers() { 
    const lastUserScan = await getDoc(doc(database, 'global', 'lastUserScan')).then(d => d.data());
    if (!lastUserScan || lastUserScan?.timestamp <= new Date().getTime() - 5 * 60000) {
        setDoc(doc(database, 'global', 'lastUserScan'), {
            timestamp: new Date().getTime(),
        });

        const expiredUsersQuery = query(collection(database, 'users'), where('expiresAt', '<=', new Date().getTime()));
        const expiredUsersResponse = await getDocs(expiredUsersQuery);
        const expiredUsers = expiredUsersResponse.docs;
        if (expiredUsers.length > 0) {
            expiredUsers.forEach(user => {
                const userData = user.data() as UserData;
                userData.chats.forEach(async chat => {
                    deleteDoc(doc(database, 'chats', chat.id));
                    const otherUserDoc = doc(database, 'username', chat.name);
                    let otherChatUser = await getDoc(otherUserDoc).then(d => d.data()) as UserData;
                    if (otherChatUser) {
                        let otherUserChats = [...otherChatUser.chats];
                        otherUserChats.splice(otherUserChats.findIndex(c => c.id === chat.id), 1);
                        updateDoc(otherUserDoc, {
                            chats: otherUserChats,
                        });
                    }
                });

                deleteDoc(doc(database, 'users', user.id));
            });
        }
    }
}