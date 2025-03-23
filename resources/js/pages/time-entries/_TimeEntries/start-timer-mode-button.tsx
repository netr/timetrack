'use client';

import { format } from 'date-fns';
import { Play } from 'lucide-react';
import React, { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { useTimeEntryForm } from '@/pages/time-entries/_TimeEntries/time-entry-form-context';

interface TimeEntryProps {
    className?: string;
}

export function StartTimerModeButton({ className }: TimeEntryProps) {
    const { form } = useTimeEntryForm();

    const handleOnStart = useCallback(() => {
        if (form.data.task_title) {
            const newData = {
                start_time: format(new Date(), 'HH:mm:ss'),
                date: format(new Date(), 'yyyy-MM-dd'),
            };
            form.transform((oldData) => ({ ...oldData, ...newData }));

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
        <Button className={className} disabled={!canControlTimer || form.processing} onClick={handleOnStart} size="icon" variant="outline">
            <Play className="h-4 w-4" />
        </Button>
    );
}
