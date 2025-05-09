import { format, parse } from 'date-fns';

import { DatePicker } from '@/components/date-picker';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTimeEntryForm } from '@/pages/time-entries/_TimeEntryForms/time-entry-form-context';

export const TimeAndDatePicker = () => {
    const { form, isTimeRangeValid } = useTimeEntryForm();

    return (
        <div className="flex items-center gap-2">
            <div className={cn('flex flex-col gap-2')}>
                <div className="flex w-full items-center gap-2">
                    <div className="flex flex-1 items-center gap-2">
                        <Input
                            className={'flex-1'}
                            error={form.errors.start_time || (!isTimeRangeValid ? 'Invalid time range' : null)}
                            onChange={(e) => {
                                form.setData('start_time', formatTimeInput(e.target.value + ':00'));
                                form.setError('start_time', '');
                            }}
                            type="time"
                            value={form.data.start_time}
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                            className={'flex-1'}
                            error={form.errors.end_time || (!isTimeRangeValid ? 'Invalid time range' : null)}
                            onChange={(e) => {
                                form.setData('end_time', formatTimeInput(e.target.value + ':00'));
                                form.setError('end_time', '');
                            }}
                            type="time"
                            value={form.data.end_time}
                        />
                    </div>
                </div>
            </div>
            <DatePicker
                className={'w-[200px]'}
                disabledDates={{ after: new Date() }}
                error={form.errors.date}
                onChange={(dateString) => {
                    form.setData('date', dateString);
                    form.setError('date', '');
                }}
                value={form.data.date}
            />
        </div>
    );
};

const formatTimeInput = (value: string) => {
    try {
        if (!value) return '';
        const date = parse(value, 'HH:mm:ss', new Date());
        return format(date, 'HH:mm:ss');
    } catch {
        return value;
    }
};
