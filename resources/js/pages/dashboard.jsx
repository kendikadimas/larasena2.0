import React from 'react';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import Onboarding from '../components/Onboarding';
import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const isNew = auth && auth.user && auth.user.is_new ? true : false;

    return (
        <AuthenticatedLayout>
            <Onboarding forceShow={isNew} />
            <div className="text-gray-800">
                <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
                <p>This is your dashboard content.</p>
            </div>
        </AuthenticatedLayout>
    );
}
