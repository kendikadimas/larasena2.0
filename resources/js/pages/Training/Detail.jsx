import UserLayout from '@/layouts/User/Layout';
import SEO from '@/components/SEO';
import { router } from '@inertiajs/react';
import { GraduationCap, Clock, BookOpen, CheckCircle, Play, Lock, Award, Download, FileText, Video, Palette } from 'lucide-react';

export default function TrainingDetail({ course, lessons, user_progress, certificate }) {
    const levelColors = {
        'dasar': { bg: 'bg-green-100', text: 'text-green-700', gradient: 'from-[#dc213e] to-[#dc213e]' },
        'menengah': { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-[#dc213e] to-[#dc213e]' },
        'lanjutan': { bg: 'bg-red-100', text: 'text-red-700', gradient: 'from-[#dc213e] to-[#dc213e]' }
    };

    const colors = levelColors[course.level];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'theory': return <FileText className="w-5 h-5" />;
            case 'practice': return <Palette className="w-5 h-5" />;
            case 'quiz': return <CheckCircle className="w-5 h-5" />;
            default: return <BookOpen className="w-5 h-5" />;
        }
    };

    const handleStartLesson = (lessonSlug) => {
        router.get(`/pelatihan/${course.slug}/lesson/${lessonSlug}`);
    };

    return (
        <UserLayout title={course.title}>
            <SEO 
                title={course.title}
                description={course.description}
                keywords={`${course.title}, pelatihan batik, ${course.level_label}`}
                image={course.thumbnail_url}
            />

            <div className="p-6 space-y-6">
                {/* Course Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200">
                        {course.thumbnail_url ? (
                            <img
                                src={course.thumbnail_url}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <GraduationCap className="w-32 h-32 text-gray-300" />
                            </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        
                        {/* Content on Image */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${colors.bg} ${colors.text}`}>
                                {course.level_label}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
                            <div className="flex flex-wrap gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    <span>{course.total_lessons} Lesson</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span>{course.duration_minutes} menit</span>
                                </div>
                                {user_progress && (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>{user_progress.completed_lessons} / {user_progress.total_lessons} Selesai</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {user_progress && (
                        <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-white border-b">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">Progress Course</span>
                                <span className={`text-sm font-bold ${user_progress.progress_percentage >= 100 ? 'text-green-600' : 'text-[#dc213e]'}`}>
                                    {user_progress.progress_percentage}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        user_progress.progress_percentage >= 100
                                            ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                            : 'bg-gradient-to-r from-[#dc213e] to-rose-600'
                                    }`}
                                    style={{ width: `${user_progress.progress_percentage}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Tentang Course Ini</h2>
                        <p className="text-gray-600 leading-relaxed">{course.description}</p>

                        {/* Certificate Section */}
                        {certificate && (
                            <div className="mt-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-2 border-[#dc213e] shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#dc213e] rounded-xl shadow-md">
                                        <Award className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            🎉 Selamat! Anda Telah Menyelesaikan Course Ini!
                                        </h3>
                                        <p className="text-sm text-gray-700 mb-1 font-medium">
                                            Nomor Sertifikat: <span className="text-[#dc213e] font-bold">{certificate.certificate_number}</span>
                                        </p>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Diterbitkan pada: {certificate.issued_at}
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => router.get(`/sertifikat/${certificate.id}`)}
                                                className="px-5 py-2.5 bg-[#dc213e] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                                            >
                                                <Award className="w-4 h-4" />
                                                Lihat Sertifikat
                                            </button>
                                            <button
                                                onClick={() => router.get(`/sertifikat/${certificate.id}/download`)}
                                                className="px-5 py-2.5 bg-white text-[#dc213e] border-2 border-[#dc213e] rounded-lg font-semibold hover:bg-red-50 transition-all flex items-center gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download PDF
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Progress Indicator */}
                        {user_progress && !certificate && (
                            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-700">Progress Course</span>
                                    <span className="text-sm font-bold text-blue-600">
                                        {user_progress.completed_lessons}/{user_progress.total_lessons} Lesson
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${user_progress.progress_percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    Selesaikan semua materi untuk mendapatkan sertifikat!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lessons List */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <BookOpen className="w-7 h-7 text-[#BA682A]" />
                        Daftar Materi
                    </h2>

                    <div className="space-y-3">
                        {lessons.map((lesson, index) => {
                            const isCompleted = lesson.is_completed;
                            const isFirst = index === 0;
                            const prevCompleted = index === 0 || lessons[index - 1].is_completed;
                            const isAccessible = isFirst || prevCompleted;

                            return (
                                <div
                                    key={lesson.id}
                                    className={`group relative border-2 rounded-xl p-5 transition-all ${
                                        isCompleted
                                            ? 'bg-green-50 border-green-200 hover:border-green-300'
                                            : isAccessible
                                            ? 'bg-white border-gray-200 hover:border-[#BA682A] hover:shadow-md'
                                            : 'bg-gray-50 border-gray-200 opacity-60'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Lesson Number */}
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                                            isCompleted
                                                ? 'bg-green-500 text-white'
                                                : isAccessible
                                                ? 'bg-gradient-to-r ' + colors.gradient + ' text-white'
                                                : 'bg-gray-300 text-gray-500'
                                        }`}>
                                            {isCompleted ? (
                                                <CheckCircle className="w-6 h-6" />
                                            ) : isAccessible ? (
                                                index + 1
                                            ) : (
                                                <Lock className="w-5 h-5" />
                                            )}
                                        </div>

                                        {/* Lesson Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#BA682A] transition-colors">
                                                    {lesson.title}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                                    lesson.type === 'theory' ? 'bg-blue-100 text-blue-700' :
                                                    lesson.type === 'practice' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {getTypeIcon(lesson.type)}
                                                    {lesson.type_label}
                                                </span>
                                            </div>
                                            {lesson.description && (
                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                    {lesson.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        {isAccessible ? (
                                            <button
                                                onClick={() => handleStartLesson(lesson.slug)}
                                                className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                                                    isCompleted
                                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                                        : 'bg-gradient-to-r ' + colors.gradient + ' text-white hover:shadow-lg'
                                                }`}
                                            >
                                                <Play className="w-4 h-4" />
                                                {isCompleted ? 'Review' : 'Mulai'}
                                            </button>
                                        ) : (
                                            <div className="flex-shrink-0 px-6 py-3 rounded-xl bg-gray-200 text-gray-500 font-semibold flex items-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                Terkunci
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
