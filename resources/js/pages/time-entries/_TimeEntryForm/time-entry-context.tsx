import { FormDataConvertible } from '@inertiajs/core';
import { InertiaFormProps, useForm } from '@inertiajs/react';
import React, { createContext, ReactNode } from 'react';

interface CreateTimeEntryFormData {
    task_title: string;
    category_id: string;
    start_time: string;
    end_time: string;
    date: string;
    mode: 'manual' | 'timer';
    [key: string]: FormDataConvertible;
}

interface CreateTimeEntryFormProviderProps {
    children: ReactNode;
}

interface CreateTimeEntryFormContextProps {
    form: InertiaFormProps<CreateTimeEntryFormData>;
}

const CreateTimeEntryFormContext = createContext<CreateTimeEntryFormContextProps | undefined>(undefined);

export const useCreateTimeEntryForm = () => {
    const context = React.useContext(CreateTimeEntryFormContext);

    if (!context) {
        throw new Error('useCreateTimeEntryForm must be used within a CreateTimeEntryProvider');
    }

    return context;
};

export const CreateTimeEntryProvider: React.FC<CreateTimeEntryFormProviderProps> = ({ children }) => {
    const form = useForm<CreateTimeEntryFormData>({
        task_title: '',
        category_id: '',
        start_time: '',
        end_time: '',
        date: '',
        mode: 'manual',
    });

    return <CreateTimeEntryFormContext.Provider value={{ form }}>{children}</CreateTimeEntryFormContext.Provider>;
};
