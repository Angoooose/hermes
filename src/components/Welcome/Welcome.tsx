import './Welcome.css';
import { Dispatch } from 'react';

import Login from './Login';
import CreateAccount from './CreateAccount';

interface WelcomeProps {
    setUsername: Dispatch<string>,
    setToken: Dispatch<string>,
}

export default function Welcome(props: WelcomeProps) {
    const { setUsername, setToken } = props;

    return (
        <div className="welcome-page">
            <Login setUsername={setUsername} setToken={setToken}/>
            <CreateAccount setUsername={setUsername} setToken={setToken}/>
        </div>
    );
}