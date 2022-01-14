import './Welcome.css';
import { Dispatch } from 'react';

import Login from './Login';
import CreateAccount from './CreateAccount';

interface WelcomeProps {
    setUsername: Dispatch<string>,
}

export default function Welcome(props: WelcomeProps) {
    const { setUsername } = props;

    return (
        <div className="welcome-page">
            <Login setUsername={setUsername}/>
            <CreateAccount setUsername={setUsername}/>
        </div>
    );
}