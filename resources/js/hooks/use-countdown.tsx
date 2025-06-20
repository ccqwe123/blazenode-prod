import { useEffect, useState } from 'react';

const getTimeLeft = (endTime: string | null) => {
    if (!endTime) return 0;
    return new Date(endTime).getTime() - new Date().getTime();
};

export function useCountdown(endTime: string | null) {
    const [timeLeftMs, setTimeLeftMs] = useState(() => getTimeLeft(endTime));

    useEffect(() => {
        if (!endTime) {
            setTimeLeftMs(0);
            return;
        }

        const updateTime = () => {
            const diff = getTimeLeft(endTime);
            setTimeLeftMs(diff);
        };

        updateTime(); // update right away

        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [endTime]); // <--- this is key! resets timer when miner changes

    const isFinished = timeLeftMs <= 0;

    const totalSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    const timeLeft = `${hours}H ${minutes}M ${seconds}S`;
    return { timeLeft, isFinished };
}
