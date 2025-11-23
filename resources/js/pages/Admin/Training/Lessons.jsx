import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, 
    BookOpen, Video, Lightbulb, ClipboardCheck, GripVertical,
    Clock, FileText, Link as LinkIcon, Image as ImageIcon, X
} from 'lucide-react';

export default function AdminTrainingLessons({ course, lessons, availableMotifs }) {
    const [showModal, setShowModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [selectedMotifs, setSelectedMotifs] = useState([]);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        type: 'theory',
        video_url: '',
        canvas_data: null,
        duration: 10,
        order: lessons.length,
        is_published: true
    });

    const typeIcons = {
        theory: { icon: BookOpen, label: 'Teori', color: 'text-blue-600', bg: 'bg-blue-100' },
        practice: { icon: Lightbulb, label: 'Praktik', color: 'text-amber-600', bg: 'bg-amber-100' },
        quiz: { icon: ClipboardCheck, label: 'Kuis', color: 'text-green-600', bg: 'bg-green-100' }
    };

    const handleOpenModal = (lesson = null) => {
        if (lesson) {
            setEditingLesson(lesson);
            const canvasData = lesson.canvas_data || {};
            const motifIds = canvasData.available_motifs || [];
            setSelectedMotifs(motifIds);

            // Load quiz questions kalau tipe lesson adalah quiz
            if (lesson.type === 'quiz' && lesson.quiz_data && Array.isArray(lesson.quiz_data.questions)) {
                setQuizQuestions(lesson.quiz_data.questions);
            } else {
                setQuizQuestions([]);
            }

            setFormData({
                title: lesson.title,
                description: lesson.description || '',
                content: lesson.content || '',
                type: lesson.type,
                video_url: lesson.video_url || '',
                canvas_data: lesson.canvas_data,
                duration: lesson.duration || 10,
                order: lesson.order,
                is_published: lesson.is_published
            });
        } else {
            setEditingLesson(null);
            setSelectedMotifs([]);
            setQuizQuestions([]); // reset quiz saat tambah materi baru
            setFormData({
                title: '',
                description: '',
                content: '',
                type: 'theory',
                video_url: '',
                canvas_data: null,
                duration: 10,
                order: lessons.length,
                is_published: true
            });
        }
        setShowModal(true);
    };


    const toggleMotifSelection = (motifId) => {
        setSelectedMotifs(prev => {
            if (prev.includes(motifId)) {
                return prev.filter(id => id !== motifId);
            } else {
                return [...prev, motifId];
            }
        });
    };

    const addQuizQuestion = () => {
        setQuizQuestions(prev => [
            ...prev,
            {
                question: '',
                type: 'multiple_choice', // atau 'essay'
                options: ['', ''],       // default 2 opsi untuk pilihan ganda
                correct_answer: ''
            }
        ]);
    };

    const updateQuizQuestion = (index, field, value) => {
        const updated = [...quizQuestions];
        updated[index][field] = value;
        setQuizQuestions(updated);
    };

    const addOption = (qIndex) => {
        const updated = [...quizQuestions];
        updated[qIndex].options.push('');
        setQuizQuestions(updated);
    };

    const removeOption = (qIndex, optIndex) => {
        const updated = [...quizQuestions];
        updated[qIndex].options.splice(optIndex, 1);
        setQuizQuestions(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Build canvas_data dengan selected motifs untuk practice
        let canvasData = formData.canvas_data;

        if (formData.type === 'practice') {
            canvasData = {
                available_motifs: selectedMotifs,
                instructions: formData.content || ''
            };
        }

        // Build quiz_data untuk quiz
        let quizData = null;
        if (formData.type === 'quiz') {
            quizData = {
                questions: quizQuestions
            };
        }

        const submitData = {
            ...formData,
            canvas_data: canvasData,
            quiz_data: quizData
        };
        
        if (editingLesson) {
            router.put(`/admin-training/lessons/${editingLesson.id}`, submitData, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingLesson(null);
                    setSelectedMotifs([]);
                    setQuizQuestions([]);
                }
            });
        } else {
            router.post(`/admin-training/${course.id}/lessons`, submitData, {
                onSuccess: () => {
                    setShowModal(false);
                    setSelectedMotifs([]);
                    setQuizQuestions([]);
                }
            });
        }
    };


    const handleTogglePublish = (lesson) => {
        router.put(`/admin-training/lessons/${lesson.id}/toggle-publish`);
    };

    const handleDelete = (lesson) => {
        if (confirm(`Hapus lesson "${lesson.title}"?`)) {
            router.delete(`/admin-training/lessons/${lesson.id}`);
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.get('/admin-training')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Daftar Course
                    </button>
                    
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Kelola Materi
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="text-lg text-gray-600">
                                    {course.title}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    course.level === 'dasar' ? 'bg-green-100 text-green-700' :
                                    course.level === 'menengah' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {course.level_label}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Materi
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Materi</p>
                                <p className="text-3xl font-bold text-gray-800">{lessons.length}</p>
                            </div>
                            <BookOpen className="w-12 h-12 text-blue-600 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Published</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {lessons.filter(l => l.is_published).length}
                                </p>
                            </div>
                            <Eye className="w-12 h-12 text-green-600 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Draft</p>
                                <p className="text-3xl font-bold text-gray-600">
                                    {lessons.filter(l => !l.is_published).length}
                                </p>
                            </div>
                            <EyeOff className="w-12 h-12 text-gray-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Lessons List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {lessons.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {lessons.map((lesson, index) => {
                                const typeConfig = typeIcons[lesson.type];
                                const TypeIcon = typeConfig.icon;
                                
                                return (
                                    <div key={lesson.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            {/* Drag Handle */}
                                            <div className="flex-shrink-0 mt-2">
                                                <GripVertical className="w-5 h-5 text-gray-400" />
                                            </div>
                                            
                                            {/* Order Number */}
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <span className="text-lg font-bold text-gray-600">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            
                                            {/* Type Icon */}
                                            <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${typeConfig.bg} flex items-center justify-center`}>
                                                <TypeIcon className={`w-6 h-6 ${typeConfig.color}`} />
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                            {lesson.title}
                                                        </h3>
                                                        <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                                                            <span className={`px-2 py-1 rounded ${typeConfig.bg} ${typeConfig.color} font-medium`}>
                                                                {typeConfig.label}
                                                            </span>
                                                            {lesson.duration && (
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    {lesson.duration} menit
                                                                </span>
                                                            )}
                                                            {/* Quiz Info */}
                                                            {lesson.type === 'quiz' && lesson.quiz_data?.questions?.length > 0 && (
                                                                <span className="flex items-center gap-1 text-green-600">
                                                                    <ClipboardCheck className="w-4 h-4" />
                                                                    {lesson.quiz_data.questions.length} Pertanyaan
                                                                </span>
                                                            )}

                                                            {lesson.video_url && (
                                                                <span className="flex items-center gap-1">
                                                                    <Video className="w-4 h-4" />
                                                                    Video
                                                                </span>
                                                            )}
                                                            {lesson.type === 'practice' && lesson.canvas_data?.available_motifs?.length > 0 && (
                                                                <span className="flex items-center gap-1 text-purple-600">
                                                                    <ImageIcon className="w-4 h-4" />
                                                                    {lesson.canvas_data.available_motifs.length} Motif
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <button
                                                            onClick={() => handleTogglePublish(lesson)}
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                                                lesson.is_published
                                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {lesson.is_published ? (
                                                                <span className="flex items-center gap-1">
                                                                    <Eye className="w-3 h-3" />
                                                                    Published
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-1">
                                                                    <EyeOff className="w-3 h-3" />
                                                                    Draft
                                                                </span>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenModal(lesson)}
                                                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(lesson)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {lesson.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {lesson.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Belum ada materi
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Tambahkan materi pertama untuk course ini
                            </p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md inline-flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Tambah Materi
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingLesson ? 'Edit Materi' : 'Tambah Materi Baru'}
                            </h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Judul Materi *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Contoh: Pengenalan Motif Kawung"
                                    required
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tipe Materi *
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {Object.entries(typeIcons).map(([key, config]) => {
                                        const Icon = config.icon;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setFormData({...formData, type: key})}
                                                className={`p-4 rounded-lg border-2 transition-all ${
                                                    formData.type === key
                                                        ? `${config.bg} border-current ${config.color}`
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                                                    formData.type === key ? config.color : 'text-gray-400'
                                                }`} />
                                                <div className={`text-sm font-semibold ${
                                                    formData.type === key ? config.color : 'text-gray-600'
                                                }`}>
                                                    {config.label}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Deskripsi Singkat
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    rows="3"
                                    placeholder="Deskripsi singkat tentang materi ini..."
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Konten / Materi
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono text-sm"
                                    rows="8"
                                    placeholder="Tulis konten materi di sini..."
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    {formData.type === 'practice' 
                                        ? 'Konten ini akan menjadi instruksi/panduan untuk praktik di canvas editor'
                                        : 'Tulis konten materi pembelajaran di sini'
                                    }
                                </p>
                            </div>
                            {/* Quiz Builder - Only for Quiz type */}
                            {formData.type === 'quiz' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Daftar Pertanyaan Kuis
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addQuizQuestion}
                                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            + Tambah Pertanyaan
                                        </button>
                                    </div>

                                    {quizQuestions.length === 0 && (
                                        <p className="text-sm text-gray-500">
                                            Belum ada pertanyaan. Klik "Tambah Pertanyaan" untuk mulai membuat kuis.
                                        </p>
                                    )}

                                    {quizQuestions.map((q, index) => (
                                        <div key={index} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                                            <div className="flex justify-between items-start">
                                                <div className="font-semibold text-gray-800">
                                                    Pertanyaan {index + 1}
                                                </div>
                                            </div>

                                            {/* Pertanyaan */}
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700">
                                                    Teks Pertanyaan
                                                </label>
                                                <textarea
                                                    className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    value={q.question}
                                                    onChange={(e) => updateQuizQuestion(index, 'question', e.target.value)}
                                                    rows={3}
                                                    placeholder="Tulis pertanyaan di sini..."
                                                />
                                            </div>

                                            {/* Jenis Pertanyaan */}
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700">
                                                    Jenis Pertanyaan
                                                </label>
                                                <select
                                                    className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    value={q.type}
                                                    onChange={(e) => updateQuizQuestion(index, 'type', e.target.value)}
                                                >
                                                    <option value="multiple_choice">Pilihan Ganda</option>
                                                    <option value="essay">Uraian</option>
                                                </select>
                                            </div>

                                            {/* Jika pilihan ganda */}
                                            {q.type === 'multiple_choice' && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold text-gray-700">
                                                            Opsi Jawaban
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => addOption(index)}
                                                            className="px-3 py-1 text-xs bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                                                        >
                                                            + Tambah Opsi
                                                        </button>
                                                    </div>

                                                    {q.options.map((opt, optIdx) => (
                                                        <div key={optIdx} className="flex gap-2 items-center">
                                                            <input
                                                                type="text"
                                                                className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                value={opt}
                                                                onChange={(e) => {
                                                                    const updated = [...quizQuestions];
                                                                    updated[index].options[optIdx] = e.target.value;
                                                                    setQuizQuestions(updated);
                                                                }}
                                                                placeholder={`Opsi ${optIdx + 1}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(index, optIdx)}
                                                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {/* Kunci jawaban */}
                                                    <div>
                                                        <label className="text-sm font-semibold text-gray-700">
                                                            Kunci Jawaban
                                                        </label>
                                                        <select
                                                            className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            value={q.correct_answer}
                                                            onChange={(e) =>
                                                                updateQuizQuestion(index, 'correct_answer', e.target.value)
                                                            }
                                                        >
                                                            <option value="">-- Pilih Jawaban Benar --</option>
                                                            {q.options.map((opt, optIdx) => (
                                                                <option key={optIdx} value={opt}>
                                                                    {opt || `Opsi ${optIdx + 1}`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Jika uraian */}
                                            {q.type === 'essay' && (
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-700">
                                                        Kunci Jawaban (Opsional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        value={q.correct_answer}
                                                        onChange={(e) =>
                                                            updateQuizQuestion(index, 'correct_answer', e.target.value)
                                                        }
                                                        placeholder="Isi jika ingin memberikan jawaban contoh (boleh dikosongkan)"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Motif Selection - Only for Practice */}
                            {formData.type === 'practice' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Motif yang Tersedia untuk Praktik *
                                    </label>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Pilih motif-motif yang dapat digunakan user dalam lesson praktik ini
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                                        {availableMotifs && availableMotifs.length > 0 ? (
                                            availableMotifs.map((motif) => {
                                                const isSelected = selectedMotifs.includes(motif.id);
                                                return (
                                                    <button
                                                        key={motif.id}
                                                        type="button"
                                                        onClick={() => toggleMotifSelection(motif.id)}
                                                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                                                            isSelected
                                                                ? 'border-blue-500 ring-2 ring-blue-200'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="aspect-square bg-gray-100">
                                                            {motif.image_url ? (
                                                                <img
                                                                    src={motif.image_url}
                                                                    alt={motif.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <ImageIcon className="w-8 h-8 text-gray-300" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-2 bg-white">
                                                            <div className="text-xs font-medium text-gray-800 truncate">
                                                                {motif.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 truncate">
                                                                {motif.category}
                                                            </div>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full text-center py-8">
                                                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                                <p className="text-gray-500 text-sm">Belum ada motif tersedia</p>
                                                <p className="text-gray-400 text-xs mt-1">Tambahkan motif terlebih dahulu</p>
                                            </div>
                                        )}
                                    </div>
                                    {selectedMotifs.length > 0 && (
                                        <p className="mt-2 text-sm text-blue-600 font-medium">
                                            {selectedMotifs.length} motif dipilih
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Video URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Video URL (Opsional)
                                </label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="url"
                                        value={formData.video_url}
                                        onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>
                            </div>

                            {/* Duration & Order */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Durasi (menit)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Urutan
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Published */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-semibold text-gray-800">
                                        Publish Materi
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Materi akan langsung terlihat oleh user
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_published}
                                        onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingLesson(null);
                                    }}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md font-semibold"
                                >
                                    {editingLesson ? 'Simpan Perubahan' : 'Tambah Materi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
