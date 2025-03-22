import { useForm } from '@inertiajs/react';
import { Clock, Timer } from 'lucide-react';
import { useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TimeEntryManualMode } from '@/pages/time-entries/_TimeEntryForm/time-entry-manual-mode';
import { TimeEntryTimerMode } from '@/pages/time-entries/_TimeEntryForm/time-entry-timer-mode';

const categories = ['Development', 'Design', 'Meeting', 'Research', 'Documentation', 'Other'];

export const TimeEntryForm = () => {
    const [timeEntryMode, setTimeEntryMode] = useState<'manual' | 'timer'>('manual');

    const taskNameInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, post, reset, processing, recentlySuccessful } = useForm({
        taskName: '',
        category: '',
    });

    const handleTimeEntrySave = (duration: string) => {
        post(route('time-entries.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                taskNameInput.current?.focus();
            },
        });
    };

    const handleModeChange = (mode: 'manual' | 'timer') => {
        setTimeEntryMode(mode);
    };

    const canSave = data.taskName && data.category && (timeEntryMode === 'manual' || timeEntryMode === 'timer');

    return (
        <div>
            <div className="flex items-center gap-2">
                <Input
                    className="flex-1"
                    onChange={(e) => setData('taskName', e.target.value)}
                    placeholder="Task name"
                    ref={taskNameInput}
                    value={data.taskName}
                />

                <Select onValueChange={(e) => setData('category', e)} value={data.category}>
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
                    <TimeEntryTimerMode mode={timeEntryMode} onModeChange={handleModeChange} onSave={handleTimeEntrySave} saveDisabled={!canSave} />
                )}
                {timeEntryMode === 'manual' && (
                    <TimeEntryManualMode mode={timeEntryMode} onModeChange={handleModeChange} onSave={handleTimeEntrySave} saveDisabled={!canSave} />
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
            <InputError message={errors.taskName} />
            <InputError message={errors.category} />
        </div>
    );
};
