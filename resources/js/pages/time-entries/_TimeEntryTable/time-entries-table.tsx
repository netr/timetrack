import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { formatDistance } from 'date-fns/formatDistance';
import { FileEditIcon, Trash2Icon } from 'lucide-react';
import React, { useCallback } from 'react';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TimeEntry } from '@/types/tasks';

const TimeEntriesTable = ({ timeEntries }: { timeEntries: TimeEntry[] }) => {
    const { delete: deleteTimeEntry } = useForm({});
    const handleDeleteTimeEntry = useCallback(
        (id: number) => () => {
            console.log('ok');
            if (confirm('Are you sure you want to delete this time entry?')) {
                deleteTimeEntry(route('time-entries.destroy', id), {
                    onSuccess: () => {
                        // Remove the time entry from the list
                    },
                });
            }
        },
        [deleteTimeEntry],
    );

    return (
        <Table>
            <TableCaption>A list of your tasks</TableCaption>
            <TableHeader>
                <TableRow className={'bg-gray-50'}>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {timeEntries.map((entry) => (
                    <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.id}</TableCell>
                        <TableCell>{entry.task.title}</TableCell>
                        <TableCell>{entry.task.category?.name || 'Uncategorized'}</TableCell>
                        <TableCell className="text-right">{formatDistance(entry.end_time, entry.start_time)}</TableCell>
                        <TableCell className="text-right">{format(entry.created_at, 'E, MMM do, yyyy')}</TableCell>
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
    );
};

export default TimeEntriesTable;
