import './CreateAccount.css';
import { Dispatch, useState, useRef, FormEvent, KeyboardEvent } from 'react';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { database } from '../../index';
import generateToken from '../../utils/generateToken';
import AuthData from '../../Types/AuthData';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';

interface CreateAccountProps {
    setAuthData: Dispatch<AuthData>,
}

export default function CreateAccount(props: CreateAccountProps) {
    const { setAuthData } = props;
    
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>();
    const [pinError, setPinError] = useState<string>();
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

            let isError: boolean = false;

            if (userDoc.exists()) {
                setUsernameError('That username is taken');
                isError = true;
            }

            if (pin !== confirmPin) {
                setPinError('Your pins do not match.');
                isError = true;
            }

            if (!isError) {
                setIsLoading(true);
                setIsDisabled(true);
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
                setIsDisabled(true);
            }
        }
    }

    function handleKeyPress(e: KeyboardEvent<HTMLInputElement>, origin: 'username'|'pin') {
        if (e.key === 'Enter') {
            if (origin === 'username') {
                pinRef.current?.focus();
            } else if (origin === 'pin') {
                confirmPinRef.current?.focus();
            }
        }
    }

    return (
        <div className="welcome-container">
            <h1>Create Account</h1>
            <div className="create-account-tip">Your account expires 48 hours after creation, and all chats are deleted.</div>
            <form className="welcome-form" onSubmit={(e) => createAccount(e)}>
                {errorMessage !== '' && <div className="error-box">{errorMessage}</div>}
                <Input
                    className="full-width"
                    placeholder="Username"
                    ref={usernameRef}
                    onChange={(el) => setIsDisabled(el.target.value === '' || pinRef.current!.value === '' || confirmPinRef.current!.value === '')}
                    onKeyDown={(e) => handleKeyPress(e, 'username')}
                    errorMessage={usernameError}
                    setErrorMessage={setUsernameError}
                />
                <Input
                    className="full-width"
                    placeholder="Pin"
                    type="password"
                    ref={pinRef}
                    onChange={(el) => setIsDisabled(el.target.value === '' || usernameRef.current!.value === '' || confirmPinRef.current!.value === '')}
                    onKeyDown={(e) => handleKeyPress(e, 'pin')}
                    errorMessage={pinError}
                    setErrorMessage={setPinError}
                />
                <Input
                    className="full-width"
                    placeholder="Confirm Pin"
                    type="password"
                    ref={confirmPinRef}
                    onChange={(el) => setIsDisabled(el.target.value === '' || usernameRef.current!.value === '' || pinRef.current!.value === '')}
                />
                <Button className="welcome-button" text="Create Account" isLoading={isLoading} disabled={isDisabled || isLoading}></Button>
            </form>
        </div>
    );
}