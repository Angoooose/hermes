import '../styles/App.css';
import { useState } from 'react';

import Login from './Login';

export default function App() {
    const [username, setUserName] = useState<string>();

    return (
        <div>
            <Login setUsername={setUserName}/>
        </div>
    );
}