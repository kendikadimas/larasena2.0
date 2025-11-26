import UserLayout from '@/layouts/User/Layout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import BadgesSection from './Partials/BadgesSection';

export default function Edit({ mustVerifyEmail, status, badges = [] }) {
    return (
        <UserLayout title="Profil Saya">
            <Head title="Profil Saya" />

            <div className="p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Profile Information with Photo */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-xl border border-gray-100">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    {/* Badges Section */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-xl border border-gray-100">
                        <BadgesSection badges={badges} />
                    </div>

                    {/* Password Section */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-xl border border-gray-100">
                        <UpdatePasswordForm />
                    </div>

                    {/* Delete Account Section */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-xl border border-gray-100">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
