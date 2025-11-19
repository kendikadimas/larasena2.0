import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    GraduationCap, Plus, Edit, Trash2, Eye, EyeOff, 
    BookOpen, Clock, List, Search, Filter 
} from 'lucide-react';

export default function AdminTrainingIndex({ courses }) {
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('all');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'dasar',
        duration_minutes: 60,
        thumbnail: null,
        certificate_file: null,
        is_published: true,
        order: 0
    });

    const levelColors = {
        'dasar': { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-500' },
        'menengah': { bg: 'bg-amber-100', text: 'text-amber-700', badge: 'bg-amber-500' },
        'lanjutan': { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-500' }
    };

    const handleOpenModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
            setFormData({
                title: course.title,
                description: course.description,
                level: course.level,
                duration_minutes: course.duration_minutes,
                thumbnail: null,
                certificate_file: null,
                is_published: course.is_published,
                order: course.order
            });
        } else {
            setEditingCourse(null);
            setFormData({
                title: '',
                description: '',
                level: 'dasar',
                duration_minutes: 60,
                thumbnail: null,
                certificate_file: null,
                is_published: true,
                order: 0
            });
        }
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        if (editingCourse) {
            router.post(`/admin-training/${editingCourse.id}`, {
                ...formData,
                _method: 'PUT'
            }, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    setEditingCourse(null);
                }
            });
        } else {
            router.post('/admin-training', formData, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                }
            });
        }
    };

    const handleTogglePublish = (course) => {
        router.put(`/admin-training/${course.id}/toggle-publish`);
    };

    const handleDelete = (course) => {
        if (confirm(`Hapus course "${course.title}"?`)) {
            router.delete(`/admin-training/${course.id}`);
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchLevel = filterLevel === 'all' || course.level === filterLevel;
        return matchSearch && matchLevel;
    });

    return (
        <AdminLayout title="Manajemen Pelatihan">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pelatihan</h1>
                        <p className="text-gray-600 mt-1">Kelola course pelatihan batik</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Course
                    </button>
                </div>

                {/* Info Panel */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-2">Cara Mengelola Pelatihan</h3>
                            <div className="text-sm text-gray-700 space-y-2">
                                <p><strong>1. Buat Course:</strong> Klik "Tambah Course", isi nama, deskripsi, level, dan durasi</p>
                                <p><strong>2. Kelola Materi:</strong> Klik tombol "Materi" pada course untuk menambah lesson (teori, praktik, atau kuis)</p>
                                <p><strong>3. Atur Konten:</strong> Setiap lesson bisa berisi teks, video, atau canvas data untuk praktik</p>
                                <p><strong>4. Publish:</strong> Toggle status untuk mempublikasikan atau draft course/lesson</p>
                                <p><strong>5. Sertifikat:</strong> Otomatis diberikan saat user menyelesaikan 100% lesson</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Course</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{courses.length}</p>
                            </div>
                            <GraduationCap className="w-12 h-12 text-[#BA682A] opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Published</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    {courses.filter(c => c.is_published).length}
                                </p>
                            </div>
                            <Eye className="w-12 h-12 text-green-500 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Draft</p>
                                <p className="text-3xl font-bold text-amber-600 mt-1">
                                    {courses.filter(c => !c.is_published).length}
                                </p>
                            </div>
                            <EyeOff className="w-12 h-12 text-amber-500 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Lessons</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">
                                    {courses.reduce((sum, c) => sum + (c.lessons_count || 0), 0)}
                                </p>
                            </div>
                            <BookOpen className="w-12 h-12 text-blue-500 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari course..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                            >
                                <option value="all">Semua Level</option>
                                <option value="dasar">Dasar</option>
                                <option value="menengah">Menengah</option>
                                <option value="lanjutan">Lanjutan</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Courses Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Level
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Lessons
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Duration
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCourses.map((course) => {
                                    const colors = levelColors[course.level];
                                    return (
                                        <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {course.thumbnail_url ? (
                                                            <img 
                                                                src={course.thumbnail_url} 
                                                                alt={course.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <GraduationCap className="w-8 h-8 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">
                                                            {course.title}
                                                        </div>
                                                        <div className="text-sm text-gray-600 line-clamp-1">
                                                            {course.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                                                    {course.level_label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <BookOpen className="w-4 h-4" />
                                                    <span className="font-medium">{course.lessons_count}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{course.duration_minutes} min</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleTogglePublish(course)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                                        course.is_published
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {course.is_published ? (
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
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => router.get(`/admin-training/${course.id}/lessons`)}
                                                        className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm flex items-center gap-1"
                                                        title="Kelola Materi"
                                                    >
                                                        <List className="w-4 h-4" />
                                                        <span>Materi</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenModal(course)}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="p-12 text-center">
                            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">Tidak ada course ditemukan</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingCourse ? 'Edit Course' : 'Tambah Course Baru'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Judul Course *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    placeholder="e.g. Batik Dasar - Pengenalan"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Deskripsi *
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    placeholder="Deskripsi singkat course..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Level *
                                    </label>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    >
                                        <option value="dasar">Dasar</option>
                                        <option value="menengah">Menengah</option>
                                        <option value="lanjutan">Lanjutan</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Durasi (menit)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.duration_minutes}
                                        onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Urutan
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.is_published ? '1' : '0'}
                                        onChange={(e) => setFormData({ ...formData, is_published: e.target.value === '1' })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                    >
                                        <option value="1">Published</option>
                                        <option value="0">Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Thumbnail
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                />
                                {editingCourse?.thumbnail_url && (
                                    <img 
                                        src={editingCourse.thumbnail_url} 
                                        alt="Current thumbnail"
                                        className="mt-2 w-32 h-32 object-cover rounded-lg"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    File Sertifikat <span className="text-gray-500 text-xs">(PDF/Image, max 10MB)</span>
                                </label>
                                <input
                                    type="file"
                                    accept="application/pdf,image/*"
                                    onChange={(e) => setFormData({ ...formData, certificate_file: e.target.files[0] })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent"
                                />
                                {editingCourse?.certificate_file_url && (
                                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-700">
                                            ✓ Sertifikat sudah diupload
                                        </p>
                                        <a 
                                            href={editingCourse.certificate_file_url} 
                                            target="_blank"
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            Lihat file sertifikat
                                        </a>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload template sertifikat yang akan diberikan ke user setelah menyelesaikan course ini
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    {editingCourse ? 'Update' : 'Tambah'} Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
