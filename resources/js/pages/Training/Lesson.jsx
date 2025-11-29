import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import UserLayout from '@/layouts/User/Layout';
import SEO from '@/components/SEO';
import CanvasEditor from '@/components/Training/CanvasEditor';
import {
    BookOpen,
    Video,
    Palette,
    CheckCircle2,
    Lock,
    ChevronLeft,
    ChevronRight,
    Award,
    Clock,
    PlayCircle,
    FileText
} from 'lucide-react';

export default function Lesson({ course, lesson, progress, allLessons, nextLesson, prevLesson, canvasWork, availableMotifs }) {
    const [canvasData, setCanvasData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (lesson.type === 'practice' && lesson.canvas_data) {
            try {
                const parsedData = typeof lesson.canvas_data === 'string' 
                    ? JSON.parse(lesson.canvas_data) 
                    : lesson.canvas_data;
                setCanvasData(parsedData);
            } catch (error) {
                console.error('Failed to parse canvas data:', error);
            }
        }
    }, [lesson]);

    const handleSaveProgress = async (canvasState = null) => {
        setIsSaving(true);

        try {
            await router.post(`/pelatihan/${course.slug}/lesson/${lesson.slug}/progress`, {
                canvas_work: canvasState
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                }
            });
        } catch (error) {
            console.error('Failed to save progress:', error);
            alert('Gagal menyimpan progress. Silakan coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    const getLessonTypeConfig = (type) => {
        const configs = {
            theory: {
                icon: BookOpen,
                label: 'Teori',
                color: 'text-blue-600',
                bg: 'bg-blue-100'
            },
            practice: {
                icon: Palette,
                label: 'Praktik',
                color: 'text-[#BA682A]',
                bg: 'bg-amber-100'
            },
            quiz: {
                icon: CheckCircle2,
                label: 'Kuis',
                color: 'text-purple-600',
                bg: 'bg-purple-100'
            }
        };
        return configs[type] || configs.theory;
    };

    const typeConfig = getLessonTypeConfig(lesson.type);
    const TypeIcon = typeConfig.icon;

    return (
        <UserLayout>
            <Head title={`${lesson.title} - ${course.title}`} />
            <SEO
                title={`${lesson.title} - ${course.title}`}
                description={lesson.description}
                image={course.thumbnail}
                url={`/pelatihan/${course.slug}/lesson/${lesson.slug}`}
            />

            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <button 
                            onClick={() => router.visit('/')}
                            className="hover:text-[#BA682A] transition-colors cursor-pointer"
                        >
                            Home
                        </button>
                        <ChevronRight className="w-4 h-4" />
                        <button 
                            onClick={() => router.visit('/pelatihan')}
                            className="hover:text-[#BA682A] transition-colors cursor-pointer"
                        >
                            Pelatihan
                        </button>
                        <ChevronRight className="w-4 h-4" />
                        <button 
                            onClick={() => router.visit(`/pelatihan/${course.slug}`)}
                            className="hover:text-[#BA682A] transition-colors cursor-pointer"
                        >
                            {course.title}
                        </button>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#BA682A] font-semibold">{lesson.title}</span>
                    </nav>

                    {/* Lesson Header */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`${typeConfig.bg} ${typeConfig.color} p-3 rounded-xl`}>
                                        <TypeIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className={`text-sm font-semibold ${typeConfig.color}`}>
                                            {typeConfig.label}
                                        </span>
                                        <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
                            </div>

                            {/* Lesson Status */}
                            {progress?.completed && (
                                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Selesai
                                </div>
                            )}
                        </div>

                        {/* Lesson Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                <Clock className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Durasi</p>
                                    <p className="font-semibold text-gray-900">{lesson.duration} menit</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Urutan</p>
                                    <p className="font-semibold text-gray-900">Lesson {lesson.order} dari {allLessons.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                                <Award className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Progress Kursus</p>
                                    <p className="font-semibold text-gray-900">{Math.round(course.user_progress || 0)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lesson Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Theory Content */}
                            {lesson.type === 'theory' && (
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <div className="prose prose-lg max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                                    </div>

                                    {lesson.video_url && (
                                        <div className="mt-8">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <PlayCircle className="w-6 h-6 text-[#BA682A]" />
                                                Video Tutorial
                                            </h3>
                                            <div className="relative rounded-2xl overflow-hidden shadow-lg">
                                                <iframe
                                                    src={lesson.video_url}
                                                    className="w-full h-96"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-8 pt-6 border-t">
                                        <button
                                            onClick={() => handleSaveProgress()}
                                            disabled={isSaving}
                                            className="w-full bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            {isSaving ? 'Menyimpan...' : 'Tandai Selesai'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Practice Content with Canvas */}
                            {lesson.type === 'practice' && canvasData && (
                                <CanvasEditor
                                    canvasData={canvasData}
                                    availableMotifs={availableMotifs || []}
                                    onSave={handleSaveProgress}
                                    initialCanvasWork={canvasWork}
                                />
                            )}
                            
                            {/* Quiz Content */}
                            {lesson.type === 'quiz' && lesson.quiz_data && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">

                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Kuis: {lesson.title}</h2>

                                {lesson.quiz_data.questions?.map((q, index) => (
                                    <div key={index} className="p-6 border rounded-xl bg-gray-50 space-y-4">

                                        <div className="text-lg font-semibold text-gray-800">
                                            {index + 1}. {q.question}
                                        </div>

                                        {/* Multiple choice */}
                                        {q.type === "multiple_choice" && (
                                            <div className="space-y-2">
                                                {q.options.map((opt, optIndex) => (
                                                    <label
                                                        key={optIndex}
                                                        className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`q-${index}`}
                                                            value={opt}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-gray-700">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {/* Essay */}
                                        {q.type === "essay" && (
                                            <textarea
                                                className="w-full border rounded-lg p-3 text-gray-700"
                                                rows={4}
                                                placeholder="Tulis jawaban Anda..."
                                            />
                                        )}

                                    </div>
                                ))}

                                {/* Tombol Submit */}
                                <button
                                    onClick={() => handleSaveProgress()}
                                    className="w-full bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white py-4 rounded-xl font-semibold hover:shadow-lg"
                                >
                                    Selesaikan Kuis
                                </button>

                            </div>
                        )}


                            {/* Save Success Message */}
                            {saveSuccess && (
                                <>
                                    {/* Backdrop Overlay */}
                                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />
                                    
                                    {/* Success Popup - Perfectly Centered */}
                                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                                        <div className="bg-white rounded-2xl shadow-2xl border-4 border-green-500 p-8 max-w-md w-full animate-bounce">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 bg-green-500 rounded-full">
                                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Progress Berhasil Disimpan!</h3>
                                                    <p className="text-gray-600">Materi ini telah ditandai selesai</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Sidebar - Lesson Navigation */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Daftar Materi</h3>
                                
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                    {allLessons.map((l, index) => {
                                        const lTypeConfig = getLessonTypeConfig(l.type);
                                        const LIcon = lTypeConfig.icon;
                                        const isActive = l.id === lesson.id;
                                        const isCompleted = l.user_progress?.completed;
                                        // Materi pertama selalu terbuka, materi selanjutnya terbuka jika materi sebelumnya sudah selesai
                                        const isLocked = index > 0 && !allLessons[index - 1].user_progress?.completed;

                                        return (
                                            <button
                                                key={l.id}
                                                onClick={() => !isLocked && router.visit(`/pelatihan/${course.slug}/lesson/${l.slug}`)}
                                                disabled={isLocked}
                                                className={`w-full text-left p-4 rounded-xl transition-all ${
                                                    isActive
                                                        ? 'bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white shadow-lg'
                                                        : isLocked
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${
                                                        isActive ? 'bg-white/20' : `${lTypeConfig.bg}`
                                                    }`}>
                                                        {isLocked ? (
                                                            <Lock className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                                        ) : isCompleted ? (
                                                            <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-white' : 'text-green-600'}`} />
                                                        ) : (
                                                            <LIcon className={`w-4 h-4 ${isActive ? 'text-white' : lTypeConfig.color}`} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-xs font-semibold mb-1 ${
                                                            isActive ? 'text-white/80' : 'text-gray-500'
                                                        }`}>
                                                            {lTypeConfig.label} • {l.duration} menit
                                                        </p>
                                                        <p className={`font-semibold text-sm ${
                                                            isActive ? 'text-white' : isLocked ? 'text-gray-400' : 'text-gray-900'
                                                        }`}>
                                                            {l.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="mt-6 pt-6 border-t space-y-3">
                                    {prevLesson && (
                                        <button
                                            onClick={() => router.visit(`/pelatihan/${course.slug}/lesson/${prevLesson.slug}`)}
                                            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                            Materi Sebelumnya
                                        </button>
                                    )}
                                    {nextLesson ? (
                                        <button
                                            onClick={() => router.visit(`/pelatihan/${course.slug}/lesson/${nextLesson.slug}`)}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all"
                                        >
                                            Materi Selanjutnya
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                handleSaveProgress();
                                                setTimeout(() => {
                                                    router.visit(`/pelatihan/${course.slug}`);
                                                }, 500);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 bg-[#dc213e] text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all"
                                        >
                                            <Award className="w-5 h-5" />
                                            Selesai & Klaim Sertifikat
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
