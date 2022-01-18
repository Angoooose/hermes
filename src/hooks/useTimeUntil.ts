import { Dispatch, useEffect, useState } from 'react';
import getTimeUntil from '../utils/getTimeUntil';

export default function useTimeUntil(date: number|undefined): [string|undefined, Dispatch<number>] {
    const [dateState, setDateState] = useState<number|undefined>(date);
    const [timeUntil, setTimeUntil] = useState<string>('...');

    useEffect(() => {
        if (!date && !dateState) return;
        setTimeUntil(getTimeUntil(date as number));
        setInterval(() => setTimeUntil(getTimeUntil(date as number)), 5000);
    }, [dateState]);

    return [timeUntil, setDateState];
}