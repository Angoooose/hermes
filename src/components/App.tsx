import '../styles/App.css';
import { useState } from 'react';

import Header from './Header';
import Login from './Login';

export default function App() {
    const [username, setUserName] = useState<string>();

    return (
        <div>
            <Header/>
            <Login setUsername={setUserName}/>
        </div>
    );
}