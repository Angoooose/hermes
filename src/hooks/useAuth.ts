import { useState, useEffect } from 'react';
import UserData from '../Types/UserData';

import { query, collection, where, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { database } from '../index';

import AuthData from '../Types/AuthData';
import AuthStatus from '../Types/AuthStatus';

export default function useAuth(authData: AuthData|'LOADING'|null): [UserData|undefined, (newUserData: UserData) => Promise<boolean>, AuthStatus] {
    const [userData, setUserData] = useState<UserData>();
    const [status, setStatus] = useState<AuthStatus>('LOADING');
    const [isAuthed, setIsAuthed] = useState<boolean>(false);

    useEffect(() => {
        if (authData && authData !== 'LOADING' && authData.username && authData.token) {
            const userQuery = query(
                collection(database, 'users'),
                where('username', '==', authData.username),
                where('loginTokens', 'array-contains', authData.token),
            );

            onSnapshot(userQuery, (snap) => {
                if (snap.docs.length > 0) {
                    setUserData(snap.docs[0].data() as UserData);
                    setStatus('SUCCESS');
                    setIsAuthed(true);
                } else {
                    setStatus('FAILED');
                }
            });
        } else if (authData !== 'LOADING') {
            setStatus('LOGIN');
        }
    }, [authData]);

    const updateUserData = (newUserData: UserData): Promise<boolean> => {
        return new Promise(async resolve => {
            if (isAuthed && authData && authData !== 'LOADING' && authData.username && authData.token) {
                await updateDoc(doc(database, 'users', authData.token), {
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

    return [userData, updateUserData, status];
}