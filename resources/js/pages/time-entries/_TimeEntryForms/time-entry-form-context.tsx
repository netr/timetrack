import { FormDataConvertible } from '@inertiajs/core';
import { InertiaFormProps, useForm } from '@inertiajs/react';
import React, { createContext, ReactNode } from 'react';

interface TimeEntryFormData {
    task_title: string;
    category_id: string;
    start_time: string;
    end_time: string;
    date: string;
    mode: 'manual' | 'timer';
    [key: string]: FormDataConvertible;
}

interface TimeEntryFormProviderProps {
    children: ReactNode;
}

interface TimeEntryFormContextProps {
    form: InertiaFormProps<TimeEntryFormData>;
}

const TimeEntryFormContext = createContext<TimeEntryFormContextProps | undefined>(undefined);

export const useTimeEntryForm = () => {
    const context = React.useContext(TimeEntryFormContext);

    if (!context) {
        throw new Error('useTimeEntryForm must be used within a TimeEntryProvider');
    }

    return context;
};

export const TimeEntryProvider: React.FC<TimeEntryFormProviderProps> = ({ children }) => {
    const form = useForm<TimeEntryFormData>({
        task_title: '',
        category_id: '',
        start_time: '',
        end_time: '',
        date: '',
        mode: 'manual',
    });

    return <TimeEntryFormContext.Provider value={{ form }}>{children}</TimeEntryFormContext.Provider>;
};
