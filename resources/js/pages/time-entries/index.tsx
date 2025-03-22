import { Head, usePage } from '@inertiajs/react';

import { Alert } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { type SharedData } from '@/types';

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

export default function TimeEntries() {
    const { flash } = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Entries" />
            {flash.message && (
                <div className={'px-4 pt-4'}>
                    <Alert variant={flash.type.name as 'default' | 'destructive'}>{flash.message}</Alert>
                </div>
            )}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-4">hey</div>
        </AppLayout>
    );
}
