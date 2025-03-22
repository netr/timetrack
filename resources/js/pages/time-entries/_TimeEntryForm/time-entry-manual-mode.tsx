'use client';

import { format, parse } from 'date-fns';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TimeEntryProps {
    onSave: (duration: string) => void;
    mode: 'manual' | 'timer';
    onModeChange: (mode: 'manual' | 'timer') => void;
    className?: string;
    saveDisabled?: boolean;
}

export function TimeEntryManualMode({ onSave, mode, onModeChange, className, saveDisabled }: TimeEntryProps) {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const newMode = mode as 'manual' | 'timer';
        onModeChange(newMode);
        setError('');
        setStartTime('');
        setEndTime('');
    }, [mode, onModeChange]);

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
            </div>

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
