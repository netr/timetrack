'use client';

import { format } from 'date-fns';
import { Play, Square } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCreateTimeEntryForm } from '@/pages/time-entries/_TimeEntryForm/time-entry-context';

interface TimeEntryProps {
    className?: string;
    saveDisabled?: boolean;
}

export function TimeEntryTimerMode({ className }: TimeEntryProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [timerValue, setTimerValue] = useState<number>(0);
    const [timerStart, setTimerStart] = useState<number | null>(null);

    const { form } = useCreateTimeEntryForm();

    // get query params
    const urlParams = new URLSearchParams(window.location.search);
    const timeEntryId = urlParams.get('time_entry_id');

    const handleOnStart = useCallback(() => {
        // Check if there's enough data to submit the form
        if (form.data.task_title) {
            const joined = {
                start_time: format(new Date(), 'HH:mm:ss'),
                date: format(new Date(), 'yyyy-MM-dd'),
            };
            form.transform((data) => ({ ...data, ...joined }));
            // Trigger form submission
            form.post(route('time-entries.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setTimerStart(Date.now() - timerValue);
                    setIsRunning(true);
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
        }
    }, [form, timerValue]);

    const handleOnStop = useCallback(() => {
        // Check if there's enough data to submit the form
        if (form.data.task_title) {
            const joined = {
                end_time: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            };
            form.transform((data) => ({ ...data, ...joined }));
            // Trigger form submission
            form.put(route('time-entries.update', [timeEntryId]), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsRunning(false);
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
        }
    }, [form, timerValue]);

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
            handleOnStart();
        } else {
            setIsRunning(false);
            handleOnStop();
        }
    };

    // Ensure the task has a title, and verify that the timer is either not running or has been running for at least 1 second.
    // If the user clicks the end button immediately after starting the timer, the PUT request will fail because of TimeAfterRule.
    const canControlTimer = form.data.task_title !== '' && (!isRunning || (isRunning && timerValue > 1000));

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div className="flex w-full items-center gap-2">
                <div className="flex flex-1 items-center gap-2">
                    <span className="flex-1 text-center font-mono">{formatDuration(timerValue)}</span>
                    <Button disabled={!canControlTimer || form.processing} onClick={handleTimerToggle} size="icon" variant="outline">
                        {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
