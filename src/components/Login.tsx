import '../styles/Login.css';

import { useRef, FormEvent, useState, Dispatch } from 'react';
import { setDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { database } from '../index';

interface LoginProps {
    setUsername: Dispatch<string>,
}

export default function Login(props: LoginProps) {
    const [isLoginDisabled, setIsLoginDisabled] = useState<boolean>(true);
    const [isCreateDisabled, setIsCreateDisabled] = useState<boolean>(true);
    const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');
    const [createErrorMessage, setCreateErrorMessage] = useState<string>('');
    const loginNameRef = useRef<HTMLInputElement>(null);
    const loginPinRef = useRef<HTMLInputElement>(null);
    const createNameRef = useRef<HTMLInputElement>(null);
    const createPinRef = useRef<HTMLInputElement>(null);
    const confirmPinRef = useRef<HTMLInputElement>(null);
    const { setUsername }  = props;
    
    async function login(e: FormEvent) {
        e.preventDefault();

        if (loginNameRef.current!.value !== '' && loginPinRef.current!.value !== '') {
            const username = loginNameRef.current!.value;
            const pin = loginPinRef.current!.value;
            const userDoc = await getDoc(doc(database, 'users', username));

            if (userDoc.data()?.pin === pin) {
                const userData = await getDoc(doc(database, 'users', username)).then(d => d.data());
                const newToken = generateToken();
                let loginTokens = [...userData?.loginTokens];
                loginTokens.push(newToken);
                localStorage.setItem('token', newToken);
                setUsername(username);

                updateDoc(doc(database, 'users', username), {
                    loginTokens,
                });
            } else {
                setLoginErrorMessage('Invalid username or pin.');
                setIsLoginDisabled(true);
            }
        }
    }

    async function createAccount(e: FormEvent) {
        e.preventDefault();
        
        if (!isCreateDisabled) {
            const username = createNameRef.current!.value;
            const pin = createPinRef.current!.value;
            const confirmPin = confirmPinRef.current!.value;
            const userDoc = await getDoc(doc(database, 'users', username));
            if (userDoc.data() === undefined) {
                if (pin === confirmPin) {
                    const newToken = generateToken();
                    localStorage.setItem('token', newToken);
                    setUsername(username);
                    setDoc(doc(database, 'users', username), {
                        username,
                        pin,
                        loginTokens: [newToken],
                        expiresAt: new Date().getTime() + 1.728e+8,
                        chats: [],
                    });
                } else {
                    setCreateErrorMessage('Your pins do not match.');
                    setIsCreateDisabled(true);
                }
            } else {
                setCreateErrorMessage('That username is taken.');
                setIsCreateDisabled(true);
            }
        }
    }

    function generateToken(): string {
        const random = (): string => Math.random().toString(36).substr(2);
        return random() + random();
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Login</h1>
                <form className="login-form" onSubmit={(e) => login(e)}>
                    {loginErrorMessage !== '' && <div className="error-box">{loginErrorMessage}</div>}
                    <input className="login-input" placeholder="Username" ref={loginNameRef} onChange={(el) => setIsLoginDisabled(el.target.value === '' || loginPinRef.current!.value === '')}/>
                    <input className="login-input" placeholder="Pin" type="password" ref={loginPinRef} onChange={(el) => setIsLoginDisabled(el.target.value === '' || loginNameRef.current!.value === '')}/>
                    <button className="login-button" disabled={isLoginDisabled}>Login</button>
                </form>
            </div>
            <div className="login-container">
                <h1>Create Account</h1>
                <form className="login-form" onSubmit={(e) => createAccount(e)}>
                    {createErrorMessage !== '' && <div className="error-box">{createErrorMessage}</div>}
                    <input className="login-input" placeholder="Username" ref={createNameRef} onChange={(el) => setIsCreateDisabled(el.target.value === '' || createPinRef.current!.value === '' || confirmPinRef.current!.value === '')}/>
                    <input className="login-input" placeholder="Pin" type="password" ref={createPinRef} onChange={(el) => setIsCreateDisabled(el.target.value === '' || createNameRef.current!.value === '' || confirmPinRef.current!.value === '')}/>
                    <input className="login-input" placeholder="Confirm Pin" type="password" ref={confirmPinRef} onChange={(el) => setIsCreateDisabled(el.target.value === '' || createNameRef.current!.value === '' || confirmPinRef.current!.value === '')}/>
                    <button className="login-button" disabled={isCreateDisabled}>Create Account</button>
                </form>
            </div>
        </div>
    );
}