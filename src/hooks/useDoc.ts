import { useEffect, useState } from 'react';
import { getDoc, doc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { database } from '../index';

export default function useDoc<T>(collection: string, id: string, snapshot?: boolean, field?: string): [T|undefined, (newDoc: T) => void, (newDoc: T) => void] {
    const [document, setDocument] = useState<T>();
    const docQuery = doc(database, collection, id);
    
    useEffect(() => {
        getDoc(docQuery).then(result => {
            setDocument(field ? result.get(field) : result.data());
        });

        if (snapshot) {
            onSnapshot(docQuery, (doc) => {
                setDocument(doc as unknown as T);
            });
        }
    }, []);

    const overwriteDocument = (newDoc: T) => {
        setDoc(docQuery, newDoc);
        setDocument(newDoc);
    }

    const updateDocument = (newDoc: T) => {
        updateDoc(docQuery, newDoc);
        setDocument(newDoc);
    }

    return [document, overwriteDocument, updateDocument];
}