'use client';

import { Play, Square } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCreateTimeEntryForm } from '@/pages/time-entries/_TimeEntryForm/time-entry-context';

interface TimeEntryProps {
    onStart: () => void;
    className?: string;
    saveDisabled?: boolean;
}

export function TimeEntryTimerMode({ onStart, className }: TimeEntryProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [timerValue, setTimerValue] = useState<number>(0);
    const [timerStart, setTimerStart] = useState<number | null>(null);

    const { form } = useCreateTimeEntryForm();

    // Format milliseconds to duration
    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        const remainingSeconds = Math.floor((ms % 60000) / 1000);
        return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Handle timer update
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isRunning && timerStart) {
            intervalId = setInterval(() => {
                const elapsed = Date.now() - timerStart;
                setTimerValue(elapsed);
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, timerStart]);

    // Handle timer start/stop
    const handleTimerToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!isRunning) {
            onStart();
            setTimerStart(Date.now() - timerValue);
            setIsRunning(true);
        } else {
            setIsRunning(false);
        }
    };

    const canRunTimer = form.data.task_title !== '';

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div className="flex w-full items-center gap-2">
                <div className="flex flex-1 items-center gap-2">
                    <span className="flex-1 text-center font-mono">{formatDuration(timerValue)}</span>
                    <Button disabled={!canRunTimer} onClick={handleTimerToggle} size="icon" variant="outline">
                        {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
