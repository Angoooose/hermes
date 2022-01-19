import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import useAuth from './hooks/useAuth';
import deleteExpiredUsers from './utils/deleteExpiredUsers';

import Header from './components/Header/Header';
import Welcome from './components/Welcome/Welcome';
import Chat from './components/Chat/Chat';
import ActiveChats from './components/ActiveChats/ActiveChats';

export default function App() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [username, setUsername, clearUsername] = useLocalStorage<string>('username');
    const [token, setToken, clearToken] = useLocalStorage<string>('token');
    const [userData, updateUserData] = useAuth(username, token, setIsLoading);

    useEffect(() => {
        deleteExpiredUsers();
    }, []);

    useEffect(() => {
        if (userData === 0 && !isLoading) {
            clearUsername();
            clearToken();
        }
    }, [userData]);

    if (isLoading) return <div/>;

    return (
        <div className="app">
            <Header/>
            <Routes>
                <Route path="/" element={userData ? <ActiveChats username={username as string} clearUsername={clearUsername} userData={userData} updateUserData={updateUserData}/> : <Welcome setUsername={setUsername} setToken={setToken}/>}/>
                <Route path="/chat/:chatId" element={<Chat userData={userData}/>}/>
            </Routes>
        </div>
    );
}