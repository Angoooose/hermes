import { Dispatch, useState, useEffect } from 'react';
import UserData from '../Types/UserData';

import { query, collection, where, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { database } from '../index';

export default function useAuth(username: string|undefined, token: string|undefined, setIsLoading: Dispatch<boolean>): [UserData|undefined, (newUserData: UserData) => Promise<boolean>] {
    const [userData, setUserData] = useState<UserData>();
    const [isAuthed, setIsAuthed] = useState<boolean>(false);

    useEffect(() => {
        if (username && token) {
            const userQuery = query(
                collection(database, 'users'),
                where('username', '==', username),
                where('loginTokens', 'array-contains', token),
            );

            onSnapshot(userQuery, (snap) => {
                if (snap.docs.length > 0) {
                    setUserData(snap.docs[0].data() as UserData);
                    setIsAuthed(true);
                }

                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [username, token]);

    const updateUserData = (newUserData: UserData): Promise<boolean> => {
        return new Promise(async resolve => {
            if (isAuthed && username && token) {
                await updateDoc(doc(database, 'users', username), {
                    ...newUserData,
                });

                setUserData({
                    ...userData,
                    ...newUserData,
                });

                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    return [userData, updateUserData];
}