'use client';

import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Updated to accept string values
export function DatePicker({
    value,
    onChange,
    className,
    dateFormat = 'EEE MMM dd yyyy', // Format matching toDateString()
}: {
    value: string | undefined;
    onChange: (date: string) => void;
    className?: string;
    dateFormat?: string;
}) {
    // Convert string to Date for internal use
    const getDateValue = () => {
        if (!value) return undefined;
        try {
            return parse(value, dateFormat, new Date());
        } catch {
            return undefined;
        }
    };

    const dateValue = getDateValue();

    // Handle Calendar's Date selection and convert to string
    const handleSelect = (date: Date | undefined) => {
        onChange(date ? date.toDateString() : '');
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className={cn('w-[280px] justify-start text-left font-normal', !value && 'text-muted-foreground', className)}
                    variant={'outline'}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateValue ? format(dateValue, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar initialFocus mode="single" onSelect={handleSelect} selected={dateValue} />
            </PopoverContent>
        </Popover>
    );
}
