import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeEntry } from '@/pages/time-entries/_TimeEntryForm/TimeEntry';

const categories = ['Development', 'Design', 'Meeting', 'Research', 'Documentation', 'Other'];

export const TimeEntryForm = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [taskName, setTaskName] = useState('');
    const [category, setCategory] = useState('');
    const [timeEntryMode, setTimeEntryMode] = useState<'manual' | 'timer'>('manual');

    const handleTimeEntrySave = (duration: string) => {
        console.log('Time entry saved:', { duration, taskName, category, date });
        // Add your save logic here
    };

    const handleModeChange = (mode: 'manual' | 'timer') => {
        setTimeEntryMode(mode);
    };

    const canSave = taskName && category && (timeEntryMode === 'manual' || timeEntryMode === 'timer');

    return (
        <div className="flex items-center gap-2">
            <Input className="flex-1" onChange={(e) => setTaskName(e.target.value)} placeholder="Task name" value={taskName} />

            <Select onValueChange={setCategory} value={category}>
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

            <TimeEntry mode={timeEntryMode} onModeChange={handleModeChange} onSave={handleTimeEntrySave} saveDisabled={!canSave} />
        </div>
    );
};
