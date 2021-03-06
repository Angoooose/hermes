import './MessageSkeletons.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useState, useEffect } from 'react';

export default function MessageSkeletons() {
    const [skeletonsArray, setSkeletonsArray] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const newSkeletonsArray = [];
        const maxHeight = window.innerHeight - 320;
        for (let i = 0; i + 200 < maxHeight; i += 200) {
            newSkeletonsArray.push(
                <SkeletonTheme height={30} width={100}>
                    <Skeleton
                        baseColor="#171a29"
                        highlightColor="#282d42"
                        style={{ borderRadius: 'var(--msg-left-border-radius)' }}
                        className="message-skeleton"
                        count={3}
                    />
                    <div className="message-skeletons-right">
                        <Skeleton
                            baseColor="#1d9bf5"
                            highlightColor="#61b9f8"
                            style={{ borderRadius: 'var(--msg-right-border-radius)' }}
                            className="message-skeleton"
                            count={3}
                        />
                    </div>
                </SkeletonTheme>
            );
        }

        setSkeletonsArray(newSkeletonsArray);
    }, []);

    return (
        <div>
            {skeletonsArray.map(skl => skl)}
        </div>
    );
}