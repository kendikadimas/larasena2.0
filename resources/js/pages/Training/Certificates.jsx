import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/User/Layout';
import SEO from '@/components/SEO';
import { Award, Download, Calendar, BookOpen, ExternalLink } from 'lucide-react';

export default function Certificates({ certificates }) {
    const handleDownload = (certificateId) => {
        window.open(`/sertifikat/${certificateId}/download`, '_blank');
    };

    const handleShareLinkedIn = (certificate) => {
        const certUrl = `${window.location.origin}/sertifikat/${certificate.id}`;
        const courseName = certificate.course.title;
        const orgName = 'Larasena';
        const issueYear = new Date(certificate.issued_at).getFullYear();
        const issueMonth = new Date(certificate.issued_at).getMonth() + 1;
        
        const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(courseName)}&organizationName=${encodeURIComponent(orgName)}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${encodeURIComponent(certUrl)}&certId=${encodeURIComponent(certificate.certificate_number)}`;
        
        window.open(linkedInUrl, '_blank');
    };

    const getLevelConfig = (level) => {
        const configs = {
            dasar: { color: 'from-green-500 to-emerald-600', text: 'Dasar' },
            menengah: { color: 'from-amber-500 to-orange-600', text: 'Menengah' },
            lanjutan: { color: 'from-red-500 to-rose-600', text: 'Lanjutan' }
        };
        return configs[level] || configs.dasar;
    };

    return (
        <UserLayout>
            <Head title="Sertifikat Saya" />
            <SEO
                title="Sertifikat Saya"
                description="Koleksi sertifikat pelatihan batik yang telah diselesaikan"
                url="/sertifikat"
            />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sertifikat</h1>
                        <p className="text-gray-600">Koleksi sertifikat pelatihan batik yang telah diselesaikan</p>
                    </div>

                    {/* Stats */}
                    {certificates.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                                        <Award className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
                                        <p className="text-sm text-gray-600">Total Sertifikat</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                                        <Award className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {certificates.filter(c => c.course.level === 'dasar').length}
                                        </p>
                                        <p className="text-sm text-gray-600">Level Dasar</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center">
                                        <Award className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {certificates.filter(c => ['menengah', 'lanjutan'].includes(c.course.level)).length}
                                        </p>
                                        <p className="text-sm text-gray-600">Level Advanced</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Certificates Grid */}
                    {certificates.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {certificates.map((certificate) => {
                                const levelConfig = getLevelConfig(certificate.course.level);
                                
                                return (
                                    <div
                                        key={certificate.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                                    >
                                        {/* Certificate Header */}
                                        <div className={`bg-gradient-to-r ${levelConfig.color} p-6 text-white`}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                                    <Award className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold opacity-90">Sertifikat Kompetensi</p>
                                                    <p className="text-xs opacity-75">Pelatihan Batik Tradisional</p>
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold mb-1">{certificate.course.title}</h3>
                                            <p className="text-sm text-white/80">Level {levelConfig.text}</p>
                                        </div>

                                        {/* Certificate Body */}
                                        <div className="p-6">
                                            {/* Certificate Number */}
                                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                                <p className="text-xs text-gray-500 mb-1">Nomor Sertifikat</p>
                                                <p className="font-mono text-xs font-semibold text-gray-900">{certificate.certificate_number}</p>
                                            </div>

                                            {/* Course Info */}
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Tanggal Selesai</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {new Date(certificate.issued_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Total Materi</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {certificate.course.lessons_count || 4} Lesson
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDownload(certificate.id)}
                                                    className="flex-1 bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white font-semibold py-2.5 rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download PDF
                                                </button>
                                                <button
                                                    onClick={() => handleShareLinkedIn(certificate)}
                                                    className="px-4 py-2.5 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-all flex items-center gap-2 text-sm font-semibold"
                                                    title="Tambahkan ke LinkedIn"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                    </svg>
                                                </button>
                                                <a
                                                    href={`/sertifikat/${certificate.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 text-sm"
                                                    title="Lihat Sertifikat"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Sertifikat</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Selesaikan pelatihan batik untuk mendapatkan sertifikat kompetensi
                            </p>
                            <a
                                href="/pelatihan"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white font-semibold px-6 py-3 rounded-lg hover:shadow-md transition-all"
                            >
                                <BookOpen className="w-5 h-5" />
                                Mulai Belajar
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
