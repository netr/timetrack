import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { formatDistance } from 'date-fns/formatDistance';
import { FileEditIcon, Trash2Icon } from 'lucide-react';
import React from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TimeEntry } from '@/types/tasks';

const TimeEntriesTable = ({ timeEntries }: { timeEntries: TimeEntry[] }) => {
    const { delete: submitDelete } = useForm({});
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [currentEntry, setCurrentEntry] = React.useState<TimeEntry | null>(null);

    const handleDeleteEntry = () => {
        setIsDialogOpen(false);
        submitDelete(route('time-entries.destroy', currentEntry?.id), {
            onSuccess: () => {
                // Remove the time entry from the list
            },
            onError: () => {
                // Show an error message
                console.error('An error occurred while deleting the time entry');
            },
        });
    };

    const handleConfirmDeleteEntry = (timeEntry: TimeEntry) => {
        setIsDialogOpen(true);
        setCurrentEntry(timeEntry);
    };

    return (
        <>
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
                                <button className="cursor-pointer text-gray-500 hover:text-red-500" onClick={() => handleConfirmDeleteEntry(entry)}>
                                    <Trash2Icon className={'h-4 w-4'} />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <AlertDialog onOpenChange={(isOpen) => setIsDialogOpen(isOpen)} open={isDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the time entry and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className={'bg-destructive'} onClick={() => handleDeleteEntry()}>
                            Yes, Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default TimeEntriesTable;
