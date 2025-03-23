'use client';

import { format } from 'date-fns';
import { Play } from 'lucide-react';
import React, { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCreateTimeEntryForm } from '@/pages/time-entries/_TimeEntryForm/time-entry-context';

interface TimeEntryProps {
    className?: string;
    saveDisabled?: boolean;
}

export function TimeEntryTimerMode({ className }: TimeEntryProps) {
    const { form } = useCreateTimeEntryForm();

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
                    form.reset();
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
        }
    }, [form]);

    // Ensure the task has a title, and verify that the timer is either not running or has been running for at least 1 second.
    // If the user clicks the end button immediately after starting the timer, the PUT request will fail because of TimeAfterRule.
    const canControlTimer = form.data.task_title !== '';

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div className="flex w-full items-center gap-2">
                <div className="flex flex-1 items-center gap-2">
                    <span className="flex-1 text-center font-mono">00:00:00</span>
                    <Button disabled={!canControlTimer || form.processing} onClick={handleOnStart} size="icon" variant="outline">
                        <Play className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
