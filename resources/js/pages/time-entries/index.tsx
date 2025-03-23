import { Head, usePage } from '@inertiajs/react';
import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle, AlertVariant } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { ActiveTimerForm } from '@/pages/time-entries/_TimeEntryForms/active-timer-form';
import { CreateTimeEntryForm } from '@/pages/time-entries/_TimeEntryForms/create-time-entry-form';
import { TimeEntryProvider } from '@/pages/time-entries/_TimeEntryForms/time-entry-form-context';
import TimeEntriesTable from '@/pages/time-entries/_TimeEntryTable/time-entries-table';
import { BreadcrumbItem } from '@/types';
import { type SharedData } from '@/types';
import { TimeEntry } from '@/types/tasks';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Time Entries',
        href: '/time-entries',
    },
];

export default function TimeEntries({ timeEntries }: { timeEntries: TimeEntry[] }) {
    const { flash } = usePage<SharedData>().props;
    const [showAlert, setShowAlert] = useState(false);

    const handleHideAlert = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        if (flash.message) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        }
    }, [flash.message]);

    const timeEntriesWithActiveTimers = timeEntries.filter((entry) => !entry.end_time);
    const completedTimeEntries = timeEntries.filter((entry) => entry.end_time);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Entries" />

            <TimeEntryProvider>
                {timeEntriesWithActiveTimers.length > 0 ? (
                    <div className={'mx-4 mt-4 rounded-xl border p-4'}>
                        {timeEntriesWithActiveTimers.map((entry) => (
                            <ActiveTimerForm key={entry.id} timeEntry={entry} />
                        ))}
                    </div>
                ) : null}

                {timeEntriesWithActiveTimers.length === 0 ? (
                    <div className={'mx-4 mt-4 rounded-xl border p-4'}>
                        <CreateTimeEntryForm />
                    </div>
                ) : null}
            </TimeEntryProvider>

            {showAlert ? (
                <div className={'px-4 pt-4'}>
                    <Alert
                        className={'relative'}
                        onClose={handleHideAlert}
                        showCloseButton
                        variant={flash.type ? (flash.type.toString() as AlertVariant) : 'default'}
                    >
                        <CheckIcon className="h-4 w-4" />
                        <AlertTitle className={'uppercase'}>{flash.type ? flash.type.toString() : ''}</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                </div>
            ) : null}

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-4">
                <TimeEntriesTable timeEntries={completedTimeEntries} />
            </div>
        </AppLayout>
    );
}
