import '../styles/App.css';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import useDoc from '../hooks/useDoc';
import deleteExpiredUsers from '../utils/expirationManager';

import Header from './Header';
import Login from './Login';
import Chat from './Chat';
import ActiveChats from './ActiveChats';

import UserData from '../Types/UserData';

export default function App() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [username, setUsername, clearUsername] = useLocalStorage<string>('username');
    const [userData, setUserData, updateUserData, updateUserId] = useDoc<UserData>('users', username);

    useEffect(() => {
        deleteExpiredUsers();
    }, []);

    useEffect(() => {
        if (username) updateUserId(username);
        setIsLoading(false);
    }, [username]);

    useEffect(() => {
        if (userData) {
            const token = localStorage.getItem('token') as string;
            if (!userData.loginTokens.includes(token)) {
                authFail();
            }
        } else if (!isLoading) {
            authFail()
        }

        function authFail() {
            localStorage.removeItem('token');
            clearUsername();
        }
    }, [userData]);

    return (
        <div className="app">
                <Header/>
                <Routes>
                    <Route path="/" element={username ? <ActiveChats username={username} clearUsername={clearUsername} userData={userData} updateUserData={updateUserData}/> : <Login setUsername={setUsername}/>}/>
                    <Route path="/chat/:chatId" element={<Chat username={username as string}/>}/>
                </Routes>
        </div>
    );
}