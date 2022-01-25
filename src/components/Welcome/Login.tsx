import { Dispatch, useState, useRef, FormEvent, KeyboardEvent } from 'react';
import { query, collection, updateDoc, doc, where, getDocs } from 'firebase/firestore';
import { database } from '../../index';
import generateToken from '../../utils/generateToken';
import UserData from '../../Types/UserData';
import AuthData from '../../Types/AuthData';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';

interface LoginProps {
    setAuthData: Dispatch<AuthData>,
}

export default function Login(props: LoginProps) {
    const { setAuthData } = props;

    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const usernameRef = useRef<HTMLInputElement>(null);
    const pinRef = useRef<HTMLInputElement>(null);

    async function login(e: FormEvent) {
        e.preventDefault();

        if (!isDisabled) {
            const username = usernameRef.current!.value;
            const pin = pinRef.current!.value;

            const userQuery = query(
                collection(database, 'users'),
                where('username', '==', username),
                where('pin', '==', pin),
            );

            const userDocs = await getDocs(userQuery);

            if (userDocs.docs.length > 0) {
                setIsLoading(true);
                const userData = userDocs.docs[0].data() as UserData;
                const newToken = generateToken();

                let loginTokens = [...userData?.loginTokens];
                loginTokens.push(newToken);
                updateDoc(doc(database, 'users', username), {
                    loginTokens,
                }).then(() => {
                    setAuthData({
                        username: username,
                        token: newToken,
                    });
                });
            } else {
                setErrorMessage('Invalid username or pin.');
                setIsDisabled(true);
            }
        }
    }

    function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            pinRef.current?.focus();
        }
    }

    return (
        <div className="welcome-container">
            <h1>Login</h1>
            <form className="welcome-form" onSubmit={(e) => login(e)}>
                <Input
                    className="full-width"
                    placeholder="Username"
                    ref={usernameRef}
                    onChange={(el) => setIsDisabled(el.target.value === '' || pinRef.current!.value === '')}
                    onKeyDown={(e) => handleKeyPress(e)}
                />
                <Input
                    className="full-width"
                    placeholder="Pin"
                    type="password"
                    ref={pinRef}
                    onChange={(el) => setIsDisabled(el.target.value === '' || usernameRef.current!.value === '')}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />
                <Button text="Login" className="welcome-button" isLoading={isLoading} disabled={isDisabled || isLoading}></Button>
            </form>
        </div>
    );
}