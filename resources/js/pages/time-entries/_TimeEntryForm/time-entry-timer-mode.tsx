'use client';

import { Play, Square } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimeEntryProps {
    onSave: (duration: string) => void;
    mode: 'manual' | 'timer';
    onModeChange: (mode: 'manual' | 'timer') => void;
    className?: string;
    saveDisabled?: boolean;
}

export function TimeEntryTimerMode({ mode, onModeChange, className, saveDisabled }: TimeEntryProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [timerValue, setTimerValue] = useState<number>(0);
    const [timerStart, setTimerStart] = useState<number | null>(null);
    const [error, setError] = useState<string>('');

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

    useEffect(() => {
        const newMode = mode as 'manual' | 'timer';
        onModeChange(newMode);
        setError('');
        setIsRunning(false);
        setTimerStart(null);
        setTimerValue(0);
    }, [mode, onModeChange]);

    // Handle timer start/stop
    const handleTimerToggle = () => {
        if (!isRunning) {
            setTimerStart(Date.now() - timerValue);
            setIsRunning(true);
        } else {
            setIsRunning(false);
        }
    };

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div className="flex w-full items-center gap-2">
                <div className="flex flex-1 items-center gap-2">
                    <span className="flex-1 text-center font-mono">{formatDuration(timerValue)}</span>
                    <Button disabled={saveDisabled} onClick={handleTimerToggle} size="icon" variant="outline">
                        {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
