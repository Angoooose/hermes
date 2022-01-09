import '../styles/App.css';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { database } from '../index';
import useLocalStorage from '../hooks/useLocalStorage';

import Header from './Header';
import Login from './Login';
import Chat from './Chat';
import ActiveChats from './ActiveChats';

export default function App() {
    const [username, setUsername, clearUsername] = useLocalStorage<string>('username');

    useEffect(() => {
        const token = localStorage.getItem('token') as string;
        if (username) {
            getDoc(doc(database, 'users', username)).then(query => {
                let userData = query.data();
                if (userData) {
                    if (userData.loginTokens.includes(token)) {
                        setUsername(username);
                    } else {
                        handleFail();
                    }
                } else {
                    handleFail();
                }
            });
        }
        
        function handleFail() {
            localStorage.removeItem('username');
            localStorage.removeItem('token');
        }
    }, []);

    return (
        <div className="app">
                <Header/>
                <Routes>
                    <Route path="/" element={username ? <ActiveChats username={username} setUsername={setUsername} clearUsername={clearUsername}/> : <Login setUsername={setUsername}/>}/>
                    <Route path="/chat/:chatId" element={<Chat username={username}/>}/>
                </Routes>
        </div>
    );
}