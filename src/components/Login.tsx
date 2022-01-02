import '../styles/Login.css';

import { useRef, FormEvent, useState } from 'react';
import { setDoc, getDoc, doc } from 'firebase/firestore';
import { database } from '../index';

import LoginProps from '../Types/LoginProps';

export default function Login(props: LoginProps) {
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const nameRef = useRef<HTMLInputElement>(null);
    const { setUsername }  = props;
    
    async function login(e: FormEvent) {
        e.preventDefault();

        if (nameRef.current!.value !== '') {
            let name = nameRef.current!.value;
            setUsername(name);
            let nameQuery = await getDoc(doc(database, 'users', name));
            if (nameQuery.data() === undefined) {
                setDoc(doc(database, 'users', name), {
                    name,
                    chats: [],
                });
            }
        }
    }

    return (
        <div className="login-page">
            <h1>Please login</h1>
            <form className="login-form" onSubmit={(e) => login(e)}>
                <input placeholder="Name" ref={nameRef} onChange={(el) => setIsButtonDisabled(el.target.value === '')}/>
                <button disabled={isButtonDisabled}>Login</button>
            </form>
        </div>
    );
}