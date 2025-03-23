import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckIcon, FileEditIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { CreateTimeEntryProvider } from '@/pages/time-entries/_TimeEntryForm/time-entry-context';
import { TimeEntryForm } from '@/pages/time-entries/_TimeEntryForm/time-entry-form';
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

    useEffect(() => {
        if (flash.message) {
            setShowAlert(true);
        }
    }, [flash.message]);

    const handleHideAlert = () => {
        setShowAlert(false);
    };

    const { delete: deleteTimeEntry } = useForm({});

    const handleDeleteTimeEntry = (id: number) => () => {
        if (confirm('Are you sure you want to delete this time entry?')) {
            deleteTimeEntry(route('time-entries.destroy', id), {
                onSuccess: () => {
                    // Remove the time entry from the list
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Entries" />
            {showAlert && (
                <div className={'px-4 pt-4'}>
                    <Alert
                        className={'relative'}
                        onClose={handleHideAlert}
                        showCloseButton
                        variant={flash.type ? (flash.type.toString() as 'default' | 'success' | 'destructive') : 'default'}
                    >
                        <CheckIcon className="h-4 w-4" />
                        <AlertTitle className={'uppercase'}>{flash.type ? flash.type.toString() : ''}</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                </div>
            )}

            <div className={'mx-4 mt-4 rounded-xl border p-4'}>
                <CreateTimeEntryProvider>
                    <TimeEntryForm />
                </CreateTimeEntryProvider>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-4">
                <Table>
                    <TableCaption>A list of your tasks</TableCaption>
                    <TableHeader>
                        <TableRow className={'bg-gray-50'}>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Time</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {timeEntries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell className="font-medium">{entry.id}</TableCell>
                                <TableCell>{entry.task.title}</TableCell>
                                <TableCell>{entry.task.category?.name || 'Uncategorized'}</TableCell>
                                <TableCell className="text-right">
                                    {entry.start_time} - {entry.end_time}
                                </TableCell>
                                <TableCell className={'flex justify-end gap-x-2'}>
                                    <button className="cursor-pointer text-gray-500 hover:text-green-500">
                                        <FileEditIcon className={'h-4 w-4'} />{' '}
                                    </button>
                                    <button className="cursor-pointer text-gray-500 hover:text-red-500" onClick={handleDeleteTimeEntry(entry.id)}>
                                        <Trash2Icon className={'h-4 w-4'} />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
