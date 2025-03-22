import { useForm } from '@inertiajs/react';
import { format, parse } from 'date-fns';
import { Clock, Timer } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

import { DatePicker } from '@/components/date-picker';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { TimeEntryTimerMode } from '@/pages/time-entries/_TimeEntryForm/time-entry-timer-mode';

const categories = ['Development', 'Design', 'Meeting', 'Research', 'Documentation', 'Other'];

export const TimeEntryForm = () => {
    const [timeEntryMode, setTimeEntryMode] = useState<'manual' | 'timer'>('manual');

    const taskNameInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, post, reset, processing } = useForm({
        task_title: '',
        category_id: '',
        start_time: '',
        end_time: '',
        date: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('time-entries.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                taskNameInput.current?.focus();
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    const handleModeChange = (mode: 'manual' | 'timer') => {
        setTimeEntryMode(mode);
        reset();
    };

    const canSave = data.task_title && data.category_id && (timeEntryMode === 'manual' || timeEntryMode === 'timer');
    const isEndTimeInvalid = data.end_time && data.start_time && data.end_time < data.start_time;
    const isStartTimeInvalid = data.start_time && data.end_time && data.start_time > data.end_time;

    return (
        <div>
            <InputError message={errors.task_title} />
            <InputError message={errors.category_id} />
            <InputError message={errors.start_time} />
            <InputError message={errors.end_time} />
            <InputError message={errors.date} />
            <form onSubmit={submit}>
                <div className="flex items-center gap-2">
                    <Input
                        className="flex-1"
                        onChange={(e) => setData('task_title', e.target.value)}
                        placeholder="Task title"
                        ref={taskNameInput}
                        value={data.task_title}
                    />

                    <Select onValueChange={(e) => setData('category_id', e)} value={data.category_id}>
                        <SelectTrigger className="w-[130px]">
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
                            <TimeEntryTimerMode mode={timeEntryMode} onModeChange={handleModeChange} onSave={() => {}} saveDisabled={!canSave} />
                        </>
                    )}
                    {timeEntryMode === 'manual' && (
                        <>
                            <div className={cn('flex flex-col gap-2')}>
                                <div className="flex w-full items-center gap-2">
                                    <div className="flex flex-1 items-center gap-2">
                                        <Input
                                            className={cn('flex-1', isStartTimeInvalid && 'border-red-500 bg-red-50 text-red-500')}
                                            onChange={(e) => {
                                                setData('start_time', formatTimeInput(e.target.value));
                                            }}
                                            type="time"
                                            value={data.start_time}
                                        />
                                        <span className="text-muted-foreground">to</span>
                                        <Input
                                            className={cn('flex-1', isEndTimeInvalid && 'border-red-500 bg-red-50 text-red-500')}
                                            onChange={(e) => {
                                                setData('end_time', formatTimeInput(e.target.value));
                                            }}
                                            type="time"
                                            value={data.end_time}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DatePicker
                                className={'w-[200px]'}
                                onChange={(dateString) => {
                                    setData('date', dateString);
                                }}
                                value={data.date}
                            />
                            <Button
                                disabled={processing || isEndTimeInvalid || isStartTimeInvalid || !data.task_title || !data.start_time}
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
