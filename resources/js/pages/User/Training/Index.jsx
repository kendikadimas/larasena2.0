import UserLayout from '@/layouts/User/Layout';
import SEO from '@/components/SEO';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { GraduationCap, Clock, BookOpen, CheckCircle, TrendingUp, Award, Play, Filter, ChevronRight } from 'lucide-react';

export default function TrainingIndex({ courses, stats, filters }) {
    const [selectedLevel, setSelectedLevel] = useState(filters.level || 'all');

    const handleLevelFilter = (level) => {
        setSelectedLevel(level);
        router.get('/pelatihan', { level }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const levelColors = {
        'dasar': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', gradient: 'from-[#dc213e] to-[#dc213e]' },
        'menengah': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', gradient: 'from-[#dc213e] to-[#dc213e]' },
        'lanjutan': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', gradient: 'from-[#dc213e] to-[#dc213e]' }
    };

    return (
        <UserLayout title="Pelatihan Batik">
            <SEO 
                title="Pelatihan Batik Digital"
                description="Belajar membuat batik digital dengan pelatihan interaktif dari dasar hingga lanjutan. Dapatkan sertifikat setelah menyelesaikan course."
                keywords="pelatihan batik, kursus batik, belajar batik, batik digital, sertifikat batik"
            />

            <div className="p-6 space-y-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <button 
                        onClick={() => router.visit('/')}
                        className="hover:text-[#dc213e] transition-colors cursor-pointer"
                    >
                        Home
                    </button>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[#dc213e] font-semibold">Pelatihan</span>
                </nav>

                {/* Header Section */}
                <div className="bg-[#dc213e] rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                            <GraduationCap className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Pelatihan Batik Digital</h1>
                            <p className="text-white/90 mt-1">Belajar membuat batik dengan canvas interaktif</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <BookOpen className="w-6 h-6 mb-2" />
                            <div className="text-2xl font-bold">{stats.total_courses}</div>
                            <div className="text-sm text-white/80">Total Course</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <TrendingUp className="w-6 h-6 mb-2" />
                            <div className="text-2xl font-bold">{stats.my_courses || 0}</div>
                            <div className="text-sm text-white/80">Sedang Belajar</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <CheckCircle className="w-6 h-6 mb-2" />
                            <div className="text-2xl font-bold">{stats.completed_courses || 0}</div>
                            <div className="text-sm text-white/80">Selesai</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <Award className="w-6 h-6 mb-2" />
                            <div className="text-2xl font-bold">{stats.completed_courses || 0}</div>
                            <div className="text-sm text-white/80">Sertifikat</div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-800">Filter Level</h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleLevelFilter('all')}
                            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                                selectedLevel === 'all'
                                    ? 'bg-gradient-to-r from-[#4E8070] to-[#3F6D5F] text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Semua ({stats.total_courses})
                        </button>
                        <button
                            onClick={() => handleLevelFilter('dasar')}
                            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                                selectedLevel === 'dasar'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                        >
                            Dasar ({stats.dasar_courses})
                        </button>
                        <button
                            onClick={() => handleLevelFilter('menengah')}
                            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                                selectedLevel === 'menengah'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg scale-105'
                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                        >
                            Menengah ({stats.menengah_courses})
                        </button>
                        <button
                            onClick={() => handleLevelFilter('lanjutan')}
                            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                                selectedLevel === 'lanjutan'
                                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg scale-105'
                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                            }`}
                        >
                            Lanjutan ({stats.lanjutan_courses})
                        </button>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                        const colors = levelColors[course.level];
                        const progress = course.user_progress;
                        
                        return (
                            <div
                                key={course.id}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:scale-105"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                    {course.thumbnail_url ? (
                                        <img
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <GraduationCap className="w-20 h-20 text-gray-300" />
                                        </div>
                                    )}
                                    
                                    {/* Level Badge */}
                                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} backdrop-blur-sm shadow-lg`}>
                                        {course.level_label}
                                    </div>

                                    {/* Progress Indicator */}
                                    {progress && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                            <div className="flex items-center justify-between text-white text-xs mb-1">
                                                <span>Progress</span>
                                                <span className="font-semibold">{progress.progress_percentage}%</span>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
                                                    style={{ width: `${progress.progress_percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#4E8070] transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {course.description}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{course.total_lessons} Lesson</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{course.duration_minutes} min</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => router.get(`/pelatihan/${course.slug}`)}
                                        className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                                            progress
                                                ? 'bg-[#dc213e] text-white hover:shadow-lg'
                                                : `bg-[#dc213e] text-white hover:shadow-lg`
                                        }`}
                                    >
                                        <Play className="w-4 h-4" />
                                        {progress ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
                                    </button>

                                    {/* Completion Badge */}
                                    {progress?.is_completed && (
                                        <div className="mt-3 flex items-center justify-center gap-2 text-green-600 text-sm font-semibold">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Selesai</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {courses.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <GraduationCap className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Course</h3>
                        <p className="text-gray-600">
                            Tidak ada course untuk level {selectedLevel === 'all' ? 'ini' : selectedLevel}
                        </p>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
