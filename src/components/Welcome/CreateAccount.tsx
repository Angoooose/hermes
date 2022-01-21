import './CreateAccount.css';
import { Dispatch, useState, useRef, FormEvent } from 'react';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { database } from '../../index';
import generateToken from '../../utils/generateToken';
import AuthData from '../../Types/AuthData';

interface CreateAccountProps {
    setAuthData: Dispatch<AuthData>,
}

export default function CreateAccount(props: CreateAccountProps) {
    const { setAuthData } = props;
    
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const usernameRef = useRef<HTMLInputElement>(null);
    const pinRef = useRef<HTMLInputElement>(null);
    const confirmPinRef = useRef<HTMLInputElement>(null);

    async function createAccount(e: FormEvent) {
        e.preventDefault();
        
        if (!isDisabled) {
            const username = usernameRef.current!.value;
            const pin = pinRef.current!.value;
            const confirmPin = confirmPinRef.current!.value;
            const userDoc = await getDoc(doc(database, 'users', username));
            if (!userDoc.exists()) {
                if (pin === confirmPin) {
                    const newToken = generateToken();
                    setDoc(doc(database, 'users', username), {
                        username,
                        pin,
                        loginTokens: [newToken],
                        expiresAt: new Date().getTime() + 1.728e+8,
                        chats: [],
                    }).then(() => {
                        setAuthData({
                            username: username,
                            token: newToken,
                        });
                    });
                } else {
                    setErrorMessage('Your pins do not match.');
                    setIsDisabled(true);
                }
            } else {
                setErrorMessage('That username is taken.');
                setIsDisabled(true);
            }
        }
    }

    return (
        <div className="welcome-container">
            <h1>Create Account</h1>
            <div className="create-account-tip">Your account expires 48 hours after creation, and all chats are deleted.</div>
            <form className="welcome-form" onSubmit={(e) => createAccount(e)}>
                {errorMessage !== '' && <div className="error-box">{errorMessage}</div>}
                <input className="welcome-input" placeholder="Username" ref={usernameRef} onChange={(el) => setIsDisabled(el.target.value === '' || pinRef.current!.value === '' || confirmPinRef.current!.value === '')}/>
                <input className="welcome-input" placeholder="Pin" type="password" ref={pinRef} onChange={(el) => setIsDisabled(el.target.value === '' || usernameRef.current!.value === '' || confirmPinRef.current!.value === '')}/>
                <input className="welcome-input" placeholder="Confirm Pin" type="password" ref={confirmPinRef} onChange={(el) => setIsDisabled(el.target.value === '' || usernameRef.current!.value === '' || pinRef.current!.value === '')}/>
                <button className="welcome-button" disabled={isDisabled}>Create Account</button>
            </form>
        </div>
    )
}