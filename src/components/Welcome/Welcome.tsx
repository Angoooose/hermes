import './Welcome.css';
import { Dispatch } from 'react';

import Login from './Login';
import CreateAccount from './CreateAccount';
import AuthData from '../../Types/AuthData';

interface WelcomeProps {
    setAuthData: Dispatch<AuthData>,
}

export default function Welcome(props: WelcomeProps) {
    const { setAuthData } = props;

    return (
        <div className="welcome-page">
            <Login setAuthData={setAuthData}/>
            <CreateAccount setAuthData={setAuthData}/>
        </div>
    );
}