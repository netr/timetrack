import { format } from 'date-fns';
import { Square } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { useTimeEntryForm } from '@/pages/time-entries/_TimeEntryForms/time-entry-form-context';
import { TimerDisplay } from '@/pages/time-entries/_TimeEntryForms/timer-display';
import { TimeEntry } from '@/types/tasks';

export const ActiveTimerForm = ({ timeEntry }: { timeEntry: TimeEntry }) => {
    const { form } = useTimeEntryForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const newData = {
            task_title: timeEntry.task.title,
            category_id: timeEntry.task.category_id,
            end_time: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        };
        form.transform((oldData) => ({ ...oldData, ...newData }));

        form.put(route('time-entries.update', [timeEntry.id]), {
            preserveScroll: true,
            onSuccess: () => {
                //
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    // convert start time to unix timestamp
    const startTime = new Date(timeEntry.start_time).getTime();

    const TimerModeStopButton = () => (
        <Button className={'ml-4'} disabled={form.processing} size="icon" type={'submit'} variant="destructive">
            <Square className="h-4 w-4" />
        </Button>
    );

    return (
        <div>
            <InputError message={form.errors.task_title} />
            <InputError message={form.errors.category_id} />
            <InputError message={form.errors.start_time} />
            <InputError message={form.errors.end_time} />
            <InputError message={form.errors.date} />
            <form onSubmit={submit}>
                <div className="flex items-center gap-2">
                    <div className={'flex-1'}>{timeEntry.task.title}</div>
                    <div className="w-[130px] text-gray-500 italic">{timeEntry.task.category?.name || 'Uncategorized'}</div>
                    <TimerDisplay isRunning startTime={startTime} />
                    <TimerModeStopButton />
                </div>
            </form>
        </div>
    );
};
