import { useState, useRef, useCallback, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    Upload, FileArchive, FileJson, Image as ImageIcon,
    CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp,
    Info, Package, Trash2, Eye, EyeOff, FolderOpen
} from 'lucide-react';

// ─── Drag & Drop Zone ─────────────────────────────────────────────────────────
function DropZone({ accept, multiple = false, onFiles, label, sublabel, icon: Icon }) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        onFiles(files);
    }, [onFiles]);

    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        onFiles(files);
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
                relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                transition-all duration-200 group
                ${isDragging
                    ? 'border-[#BA682A] bg-orange-50 scale-[1.01]'
                    : 'border-gray-200 hover:border-[#BA682A] hover:bg-orange-50/30 bg-gray-50'
                }
            `}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
                className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
                <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
                    ${isDragging ? 'bg-[#BA682A] text-white' : 'bg-white text-[#BA682A] group-hover:bg-[#BA682A] group-hover:text-white border border-[#BA682A]/20'}
                `}>
                    <Icon className="w-7 h-7" />
                </div>
                <div>
                    <p className="font-semibold text-gray-800 text-sm">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>
                </div>
            </div>
        </div>
    );
}

// ─── File Preview Item ────────────────────────────────────────────────────────
function FilePreviewItem({ file, index, onRemove, onRename, onChangeCategory, categories }) {
    const [expanded, setExpanded] = useState(false);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState(
        file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    );
    const [category, setCategory] = useState(categories[0] || '');

    useEffect(() => {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    }, [file]);

    return (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 p-3">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    {preview
                        ? <img src={preview} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-300" />
                          </div>
                    }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                        title="Edit metadata"
                    >
                        {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    <button
                        onClick={() => onRemove(index)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition"
                        title="Hapus"
                    >
                        <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                </div>
            </div>
            {/* Expanded metadata editor */}
            {expanded && (
                <div className="px-3 pb-3 border-t border-gray-50 pt-3 flex gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); onRename(index, e.target.value); }}
                        placeholder="Nama motif"
                        className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BA682A]"
                    />
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); onChangeCategory(index, e.target.value); }}
                        placeholder="Kategori"
                        className="w-32 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BA682A]"
                        list="category-list"
                    />
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BulkImport({ stats }) {
    const [activeTab, setActiveTab] = useState('multifile'); // 'multifile' | 'zip' | 'json'
    const [files, setFiles] = useState([]); // untuk multifile
    const [fileMetadata, setFileMetadata] = useState({}); // { index: { name, category } }
    const [defaultCategory, setDefaultCategory] = useState('');
    const [defaultActive, setDefaultActive] = useState(true);
    const [zipFile, setZipFile] = useState(null);
    const [jsonFile, setJsonFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [flash, setFlash] = useState(null); // { type: 'success'|'error', message }

    const existingCategories = stats?.categories || [];
    const zipManifestTemplate = [
        { file: 'parang-diagonal.svg', name: 'Parang Diagonal', category: existingCategories[0] || 'Parang' },
        { file: 'kawung-basic.svg', name: 'Kawung Basic', category: existingCategories[1] || 'Kawung' },
        { file: 'mega-mendung.png', name: 'Mega Mendung', category: existingCategories[2] || 'Mega Mendung' },
    ];

    const downloadManifestTemplate = () => {
        const blob = new Blob([
            JSON.stringify(zipManifestTemplate, null, 2)
        ], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'manifest.template.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const selectedBatchSize = files.reduce((total, file) => total + file.size, 0);

    // ── File handlers ──────────────────────────────────────────────────────
    const handleMultiFiles = (newFiles) => {
        const allowed = newFiles.filter(f => /\.(svg|png|jpg|jpeg)$/i.test(f.name));

        setFiles(prev => {
            const existingNames = new Set(prev.map(file => file.name.toLowerCase()));
            const accepted = [];
            const skipped = [];

            allowed.forEach((file) => {
                const normalizedName = file.name.toLowerCase();

                if (existingNames.has(normalizedName) || accepted.some(item => item.name.toLowerCase() === normalizedName)) {
                    skipped.push(file.name);
                    return;
                }

                accepted.push(file);
            });

            if (skipped.length > 0) {
                setFlash({
                    type: 'error',
                    message: `${skipped.length} file duplikat dilewati: ${skipped.slice(0, 3).join(', ')}${skipped.length > 3 ? '...' : ''}`,
                });
            }

            return [...prev, ...accepted];
        });
    };

    const handleZipFile = (newFiles) => {
        if (newFiles[0] && /\.zip$/i.test(newFiles[0].name)) {
            setZipFile(newFiles[0]);
        }
    };

    const handleJsonFile = (newFiles) => {
        if (newFiles[0] && /\.json$/i.test(newFiles[0].name)) {
            setJsonFile(newFiles[0]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFileMetadata(prev => {
            const next = { ...prev };
            delete next[index];

            Object.keys(prev)
                .map(key => Number(key))
                .filter(key => Number.isInteger(key) && key > index)
                .sort((a, b) => a - b)
                .forEach((key) => {
                    next[key - 1] = prev[key];
                    delete next[key];
                });

            return next;
        });
    };

    const updateName = (index, name) => {
        setFileMetadata(prev => ({ ...prev, [index]: { ...prev[index], name } }));
    };

    const updateCategory = (index, category) => {
        setFileMetadata(prev => ({ ...prev, [index]: { ...prev[index], category } }));
    };

    // ── Submit handlers ────────────────────────────────────────────────────
    const submitMultifile = (e) => {
        e.preventDefault();
        if (files.length === 0) return;
        if (!defaultCategory.trim()) { setFlash({ type: 'error', message: 'Kategori default harus diisi.' }); return; }

        setIsSubmitting(true);

        // Build metadata JSON
        const metaObj = {};
        files.forEach((file, i) => {
            if (fileMetadata[i]) {
                metaObj[file.name] = fileMetadata[i];
            }
        });

        const formData = new FormData();
        files.forEach(f => formData.append('files[]', f));
        formData.append('default_category', defaultCategory);
        formData.append('default_active', defaultActive ? '1' : '0');
        if (Object.keys(metaObj).length > 0) {
            formData.append('metadata', JSON.stringify(metaObj));
        }
        formData.append('_token', document.querySelector('meta[name=csrf-token]')?.content || '');

        router.post('/admin-motifs/bulk/multifile', formData, {
            onSuccess: () => { setFiles([]); setFileMetadata({}); setIsSubmitting(false); },
            onError: (errors) => { setIsSubmitting(false); setFlash({ type: 'error', message: Object.values(errors)[0] }); },
        });
    };

    const submitZip = (e) => {
        e.preventDefault();
        if (!zipFile) return;
        if (!defaultCategory.trim()) { setFlash({ type: 'error', message: 'Kategori default harus diisi.' }); return; }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('zip_file', zipFile);
        formData.append('default_category', defaultCategory);
        formData.append('default_active', defaultActive ? '1' : '0');
        formData.append('_token', document.querySelector('meta[name=csrf-token]')?.content || '');

        router.post('/admin-motifs/bulk/zip', formData, {
            onSuccess: () => { setZipFile(null); setIsSubmitting(false); },
            onError: (errors) => { setIsSubmitting(false); setFlash({ type: 'error', message: Object.values(errors)[0] }); },
        });
    };

    const submitJson = (e) => {
        e.preventDefault();
        if (!jsonFile) return;
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('json_file', jsonFile);
        formData.append('_token', document.querySelector('meta[name=csrf-token]')?.content || '');

        router.post('/admin-motifs/bulk/json', formData, {
            onSuccess: () => { setJsonFile(null); setIsSubmitting(false); },
            onError: (errors) => { setIsSubmitting(false); setFlash({ type: 'error', message: Object.values(errors)[0] }); },
        });
    };

    const tabs = [
        { id: 'multifile', label: 'Multi-file Upload', icon: Upload, desc: 'Pilih banyak file sekaligus' },
        { id: 'zip',       label: 'ZIP Bundle',        icon: FileArchive, desc: 'Upload 1 ZIP, isi banyak' },
        { id: 'json',      label: 'JSON Manifest',     icon: FileJson, desc: 'Mapping file yang sudah ada' },
    ];

    return (
        <AdminLayout>
            <Head title="Bulk Import Motif" />

            <div className="p-8 max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#BA682A]/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-[#BA682A]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Bulk Import Motif</h1>
                            <p className="text-sm text-gray-500">Tambahkan banyak elemen canvas sekaligus</p>
                        </div>
                    </div>
                </div>

                {/* Flash message */}
                {flash && (
                    <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 text-sm font-medium ${
                        flash.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {flash.type === 'success'
                            ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            : <XCircle className="w-5 h-5 flex-shrink-0" />
                        }
                        {flash.message}
                        <button onClick={() => setFlash(null)} className="ml-auto text-current opacity-60 hover:opacity-100">✕</button>
                    </div>
                )}

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Total Elemen', value: stats.total, color: 'text-gray-800' },
                        { label: 'Aktif', value: stats.active, color: 'text-green-600' },
                        { label: 'Kategori', value: stats.categories.length, color: 'text-blue-600' },
                    ].map(s => (
                        <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                            <p className="text-xs text-gray-500">{s.label}</p>
                            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-full">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-white text-[#BA682A] shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Common settings */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4 text-[#BA682A]" />
                        Pengaturan Default
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                Kategori Default <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={defaultCategory}
                                onChange={e => setDefaultCategory(e.target.value)}
                                placeholder="cth: Parang, Kawung, Modern..."
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#BA682A]"
                                list="category-list"
                            />
                            <datalist id="category-list">
                                {existingCategories.map(c => <option key={c} value={c} />)}
                            </datalist>
                            <p className="text-xs text-gray-400 mt-1">Digunakan jika file tidak punya metadata sendiri</p>
                        </div>
                        <div className="sm:w-48">
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status Default</label>
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    onClick={() => setDefaultActive(true)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                                        defaultActive ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                                    }`}
                                >
                                    <Eye className="w-3.5 h-3.5" /> Aktif
                                </button>
                                <button
                                    onClick={() => setDefaultActive(false)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                                        !defaultActive ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-gray-50 border-gray-200 text-gray-400'
                                    }`}
                                >
                                    <EyeOff className="w-3.5 h-3.5" /> Draft
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── TAB: Multi-file ── */}
                {activeTab === 'multifile' && (
                    <form onSubmit={submitMultifile} className="space-y-4">
                        <DropZone
                            accept=".svg,.png,.jpg,.jpeg"
                            multiple
                            onFiles={handleMultiFiles}
                            label="Seret & lepas file SVG/PNG di sini"
                            sublabel="Atau klik untuk pilih banyak file — maks 100 file, 5MB per file"
                            icon={Upload}
                        />

                        {files.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            {files.length} file dipilih
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Total ukuran {(selectedBatchSize / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setFiles([]); setFileMetadata({}); }}
                                        className="text-xs text-red-500 hover:text-red-700 self-start sm:self-auto"
                                    >
                                        Hapus semua
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                                    {files.map((file, i) => (
                                        <FilePreviewItem
                                            key={i}
                                            file={file}
                                            index={i}
                                            onRemove={removeFile}
                                            onRename={updateName}
                                            onChangeCategory={updateCategory}
                                            categories={existingCategories}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={files.length === 0 || isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#BA682A] text-white rounded-xl font-medium text-sm hover:bg-[#A0522D] transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {isSubmitting ? 'Mengupload...' : `Upload ${files.length} File`}
                        </button>
                    </form>
                )}

                {/* ── TAB: ZIP Bundle ── */}
                {activeTab === 'zip' && (
                    <form onSubmit={submitZip} className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex gap-3">
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold mb-1">Struktur ZIP yang didukung:</p>
                                <code className="block bg-amber-100 rounded px-2 py-1 font-mono text-xs whitespace-pre">
{`motif-batch.zip/
  ├── manifest.json   ← opsional (nama & kategori per file)
  ├── parang-diagonal.svg
  ├── kawung-basic.png
  └── mega-mendung.svg`}
                                </code>
                                <p className="mt-2">Tanpa manifest.json, nama diambil otomatis dari nama file. Maks 50MB per ZIP.</p>
                                <button
                                    type="button"
                                    onClick={downloadManifestTemplate}
                                    className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 transition"
                                >
                                    <FileJson className="w-4 h-4" />
                                    Download template manifest
                                </button>
                            </div>
                        </div>

                        <DropZone
                            accept=".zip"
                            onFiles={handleZipFile}
                            label={zipFile ? `✅ ${zipFile.name}` : "Seret & lepas file ZIP di sini"}
                            sublabel={zipFile ? `${(zipFile.size / 1024 / 1024).toFixed(2)} MB` : "Atau klik untuk memilih file ZIP"}
                            icon={FileArchive}
                        />

                        <button
                            type="submit"
                            disabled={!zipFile || isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#BA682A] text-white rounded-xl font-medium text-sm hover:bg-[#A0522D] transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileArchive className="w-4 h-4" />}
                            {isSubmitting ? 'Memproses ZIP...' : 'Import dari ZIP'}
                        </button>
                    </form>
                )}

                {/* ── TAB: JSON Manifest ── */}
                {activeTab === 'json' && (
                    <form onSubmit={submitJson} className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 flex gap-3">
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold mb-1">Gunakan ini jika file sudah ada di server (via FTP/cPanel).</p>
                                <p>Format JSON:</p>
                                <code className="block bg-blue-100 rounded px-2 py-1 font-mono text-xs whitespace-pre mt-1">
{`[
  {
    "file_path": "motifs/admin/parang.svg",
    "name": "Parang Classic",
    "category": "Parang",
    "description": "Opsional"
  }
]`}
                                </code>
                            </div>
                        </div>

                        <DropZone
                            accept=".json"
                            onFiles={handleJsonFile}
                            label={jsonFile ? `✅ ${jsonFile.name}` : "Seret & lepas file JSON di sini"}
                            sublabel={jsonFile ? 'File dipilih' : "Atau klik untuk memilih file JSON"}
                            icon={FileJson}
                        />

                        <button
                            type="submit"
                            disabled={!jsonFile || isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#BA682A] text-white rounded-xl font-medium text-sm hover:bg-[#A0522D] transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileJson className="w-4 h-4" />}
                            {isSubmitting ? 'Memproses...' : 'Import dari JSON'}
                        </button>
                    </form>
                )}

                {/* Artisan command hint */}
                <div className="mt-8 bg-gray-900 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <FolderOpen className="w-4 h-4 text-gray-400" />
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Untuk Developer — Artisan Command</p>
                    </div>
                    <div className="space-y-2">
                        <code className="block text-xs text-green-400 font-mono">
                            # Import dari folder dengan preview dulu (dry-run):
                        </code>
                        <code className="block text-sm text-white font-mono bg-gray-800 rounded-lg px-4 py-2">
                            php artisan motifs:import /path/to/folder --category=Parang --dry-run
                        </code>
                        <code className="block text-xs text-green-400 font-mono mt-3">
                            # Import dan langsung aktifkan:
                        </code>
                        <code className="block text-sm text-white font-mono bg-gray-800 rounded-lg px-4 py-2">
                            php artisan motifs:import /path/to/folder --category=Kawung --active
                        </code>
                        <code className="block text-xs text-green-400 font-mono mt-3">
                            # Scan subfolder juga:
                        </code>
                        <code className="block text-sm text-white font-mono bg-gray-800 rounded-lg px-4 py-2">
                            php artisan motifs:import /path/to/folder --recursive --category=Modern --active
                        </code>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
