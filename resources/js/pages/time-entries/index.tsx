import { Head, usePage } from '@inertiajs/react';

import { Alert } from '@/components/ui/alert';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Entries" />
            {flash.message && (
                <div className={'px-4 pt-4'}>
                    <Alert variant={flash.type.name as 'default' | 'destructive'}>{flash.message}</Alert>
                </div>
            )}

            <div className={'mx-4 mt-4 rounded-xl border p-4'}>
                <TimeEntryForm />
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-4">
                <Table>
                    <TableCaption>A list of your tasks</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Time</TableHead>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
