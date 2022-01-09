import { useState } from 'react';

export default function useLocalStorage<T>(key: string): [T, typeof setValue, typeof clearValue] {
    const [storedValue, setStoredValue] = useState<T>(localStorage.getItem(key) as unknown as T);

    const setValue = (value: T) => {
        localStorage.setItem(key, value as unknown as string);
        setStoredValue(value);
    }

    const clearValue = () => {
        localStorage.removeItem(key);
        setStoredValue('' as unknown as T);
    }

    return [storedValue, setValue, clearValue];
}