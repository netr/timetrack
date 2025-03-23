import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type TimerDisplayProps = {
    isRunning: boolean;
    startTime: number | null;
    className?: string;
};
export const TimerDisplay = ({ isRunning, startTime, className }: TimerDisplayProps) => {
    const [timerValue, setTimerValue] = useState<number>(0);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        // Prevent initial 00:00:00 render
        setTimerValue(Date.now() - (startTime || 0));

        if (isRunning && startTime) {
            intervalId = setInterval(() => {
                const elapsed = Date.now() - startTime;
                setTimerValue(elapsed);
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, startTime]);

    return <div className={cn('text-center font-mono', className)}>{formatDuration(timerValue)}</div>;
};

export const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
