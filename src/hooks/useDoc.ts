import { useEffect, useState } from 'react';
import { getDoc, doc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { database } from '../index';

export default function useDoc<T>(collection: string, id: string|undefined, snapshot?: boolean, field?: string): [T|undefined, (newDoc: T) => void, (newDoc: T) => Promise<void>, (newDocId: string) => void] {
    const [document, setDocument] = useState<T>();
    let docQuery = id ? doc(database, collection, id) : null;
    
    useEffect(() => {
        if (docQuery) {
            getDoc(docQuery).then(result => {
                setDocument(field ? result.get(field) : result.data());
            });
    
            if (snapshot) {
                onSnapshot(docQuery, (doc) => {
                    setDocument(doc as unknown as T);
                });
            }
        }
    }, []);

    const overwriteDocument = (newDoc: T) => {
        if (docQuery) {
            setDoc(docQuery, newDoc);
            setDocument(newDoc);
        }
    }

    const updateDocument = (newDoc: T) => {
        return new Promise<void>(resolve => {
            if (docQuery) {
                updateDoc(docQuery, newDoc);
                setDocument(newDoc);
            }

            resolve();
        });
    }

    const updatedDocumentId = (newDocId: string) => {
        docQuery = doc(database, collection, newDocId);
        getDoc(docQuery).then(result => {
            setDocument(field ? result.get(field) : result.data());
        });

        if (snapshot) {
            onSnapshot(docQuery, (doc) => {
                setDocument(doc as unknown as T);
            });
        }
    }

    return [document, overwriteDocument, updateDocument, updatedDocumentId];
}