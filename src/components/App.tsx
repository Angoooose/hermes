import '../styles/App.css';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './Header';
import Login from './Login';
import Chat from './Chat';

import ActiveChats from './ActiveChats';

export default function App() {
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        let name = localStorage.getItem('name');
        setUsername(name as string);
    }, []);

    return (
        <div className="app">
                <Header/>
                <Routes>
                    <Route path="/" element={username ? <ActiveChats username={username}/> : <Login setUsername={setUsername}/>}/>
                    <Route path="/chat/:chatId" element={<Chat username={username}/>}/>
                </Routes>
        </div>
    );
}