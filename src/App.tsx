import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import useAuth from './hooks/useAuth';
import deleteExpiredUsers from './utils/deleteExpiredUsers';
import AuthData from './Types/AuthData';

import Header from './components/Header/Header';
import Welcome from './components/Welcome/Welcome';
import Chat from './components/Chat/Chat';
import ActiveChats from './components/ActiveChats/ActiveChats';

export default function App() {
    const [authData, setAuthData, clearAuthData] = useLocalStorage<AuthData>('authData');
    const [userData, updateUserData, authStatus] = useAuth(authData);

    useEffect(() => {
        deleteExpiredUsers();
    }, []);

    useEffect(() => {
        if (authStatus === 'FAILED') clearAuthData();
    }, [authStatus]);

    return (
        <div className="app">
            <Header/>
            <Routes>
                <Route path="/" element={authStatus === 'LOADING' || authStatus === 'SUCCESS' ? <ActiveChats clearAuthData={clearAuthData} userData={userData} updateUserData={updateUserData}/> : <Welcome setAuthData={setAuthData}/>}/>
                <Route path="/chat/:chatId" element={<Chat userData={userData} authStatus={authStatus}/>}/>
            </Routes>
        </div>
    );
}