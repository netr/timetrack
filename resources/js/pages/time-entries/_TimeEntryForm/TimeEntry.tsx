'use client';

import { format, parse } from 'date-fns';
import { Clock, Play, Square, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

interface TimeEntryProps {
    onSave: (duration: string) => void;
    mode: 'manual' | 'timer';
    onModeChange: (mode: 'manual' | 'timer') => void;
    className?: string;
    saveDisabled?: boolean;
}

export function TimeEntry({ onSave, mode, onModeChange, className, saveDisabled }: TimeEntryProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timerValue, setTimerValue] = useState<number>(0);
    const [timerStart, setTimerStart] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

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

    // Handle mode change
    const handleModeChange = (value: string) => {
        const newMode = value as 'manual' | 'timer';
        onModeChange(newMode);
        setError('');
        setStartTime('');
        setEndTime('');
        setIsRunning(false);
        setTimerStart(null);
        setTimerValue(0);
    };

    // Handle timer start/stop
    const handleTimerToggle = () => {
        if (!isRunning) {
            setTimerStart(Date.now() - timerValue);
            setIsRunning(true);
        } else {
            setIsRunning(false);
        }
    };

    // Format time input for display
    const formatTimeInput = (value: string) => {
        try {
            if (!value) return '';
            const date = parse(value, 'HH:mm', new Date());
            return format(date, 'HH:mm');
        } catch {
            return value;
        }
    };

    const isEndTimeInvalid = endTime && startTime && endTime < startTime;
    const isStartTimeInvalid = startTime && endTime && startTime > endTime;

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div className="flex w-full items-center gap-2">
                {mode === 'manual' ? (
                    <div className="flex flex-1 items-center gap-2">
                        <Input
                            className={cn('flex-1', isStartTimeInvalid && 'border-red-500 bg-red-50 text-red-500')}
                            onChange={(e) => {
                                setError('');
                                setStartTime(formatTimeInput(e.target.value));
                            }}
                            type="time"
                            value={startTime}
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                            className={cn('flex-1', isEndTimeInvalid && 'border-red-500 bg-red-50 text-red-500')}
                            onChange={(e) => {
                                setError('');
                                setEndTime(formatTimeInput(e.target.value));
                            }}
                            type="time"
                            value={endTime}
                        />
                    </div>
                ) : (
                    <div className="flex flex-1 items-center gap-2">
                        <span className="flex-1 text-center font-mono">{formatDuration(timerValue)}</span>
                        <Button disabled={isLoading || saveDisabled} onClick={handleTimerToggle} size="icon" variant="outline">
                            {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                    </div>
                )}

                <ToggleGroup onValueChange={handleModeChange} type="single" value={mode}>
                    <ToggleGroupItem aria-label="Manual mode" value="manual">
                        <Clock className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem aria-label="Timer mode" value="timer">
                        <Timer className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
