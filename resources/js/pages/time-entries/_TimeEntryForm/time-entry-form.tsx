import { format, parse } from 'date-fns';
import { Clock, Timer } from 'lucide-react';
import { FormEventHandler, useCallback, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCreateTimeEntryForm } from '@/pages/time-entries/_TimeEntryForm/time-entry-context';
import { TimeEntryManualMode } from '@/pages/time-entries/_TimeEntryForm/time-entry-manual-mode';
import { TimeEntryTimerMode } from '@/pages/time-entries/_TimeEntryForm/time-entry-timer-mode';

const categories = ['Development', 'Design', 'Meeting', 'Research', 'Documentation', 'Other'];

export const TimeEntryForm = () => {
    const [timeEntryMode, setTimeEntryMode] = useState<'manual' | 'timer'>('manual');

    const taskNameInput = useRef<HTMLInputElement>(null);

    const { form } = useCreateTimeEntryForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post(route('time-entries.store'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                taskNameInput.current?.focus();
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    const handleModeChange = useCallback(
        (mode: 'manual' | 'timer') => {
            setTimeEntryMode(mode);
            form.setData('mode', mode);
            form.reset();
        },
        [form.reset, form.setData],
    );

    const isEndTimeInvalid = form.data.end_time && form.data.start_time && form.data.end_time < form.data.start_time;
    const isStartTimeInvalid = form.data.start_time && form.data.end_time && form.data.start_time > form.data.end_time;

    return (
        <div>
            <InputError message={form.errors.task_title} />
            <InputError message={form.errors.category_id} />
            <InputError message={form.errors.start_time} />
            <InputError message={form.errors.end_time} />
            <InputError message={form.errors.date} />
            <form onSubmit={submit}>
                <div className="flex items-center gap-2">
                    <Input
                        className="flex-1"
                        error={form.errors.task_title}
                        onChange={(e) => {
                            form.setData('task_title', e.target.value);
                            form.setError('task_title', '');
                        }}
                        placeholder="Task title"
                        ref={taskNameInput}
                        value={form.data.task_title}
                    />

                    <Select
                        onValueChange={(e) => {
                            form.setData('category_id', e);
                            form.setError('category_id', '');
                        }}
                        value={form.data.category_id}
                    >
                        <SelectTrigger className="w-[130px]" error={form.errors.category_id}>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {timeEntryMode === 'timer' && (
                        <>
                            <TimeEntryTimerMode onStart={() => {}} />
                        </>
                    )}
                    {timeEntryMode === 'manual' && (
                        <>
                            <TimeEntryManualMode />
                            <Button
                                disabled={form.processing || isEndTimeInvalid || isStartTimeInvalid || !form.data.task_title || !form.data.start_time}
                                type={'submit'}
                            >
                                Save
                            </Button>
                        </>
                    )}

                    <ToggleGroup onValueChange={handleModeChange} type="single" value={timeEntryMode}>
                        <ToggleGroupItem aria-label="Manual mode" value="manual">
                            <Clock className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem aria-label="Timer mode" value="timer">
                            <Timer className="h-4 w-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </form>
        </div>
    );
};

const formatTimeInput = (value: string) => {
    try {
        if (!value) return '';
        const date = parse(value, 'HH:mm', new Date());
        return format(date, 'HH:mm');
    } catch {
        return value;
    }
};
