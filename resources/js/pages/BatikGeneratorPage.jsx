import { Head, router } from '@inertiajs/react';
import UserLayout from '@/layouts/User/Layout';
import SEO from '@/components/SEO';
import { useState } from 'react';
import axios from 'axios';
import { Sparkles, Image as ImageIcon, Book, Save, Download, Grid3x3, Palette, Repeat, Zap, ChevronDown } from 'lucide-react';

export default function BatikGeneratorPage({ auth }) {
    const [prompt, setPrompt] = useState('');
    const [resultImage, setResultImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Pattern options
    const [patternType, setPatternType] = useState('seamless');
    const [repeatCount, setRepeatCount] = useState(0); // 0 = default (no repeat)
    const [colorScheme, setColorScheme] = useState('sogan');
    const [style, setStyle] = useState('klasik');

   const promptTemplates = [
    // 🌧️ Cirebon
    'motif mega mendung dengan gradasi biru dan abu lembut, menggambarkan ketenangan dan kesabaran, gaya batik Cirebon klasik',
    
    // 🌸 Yogyakarta
    'motif kawung berbentuk irisan buah aren yang simetris, warna sogan coklat dan putih, melambangkan kesucian dan keadilan',
    
    // 🔥 Lasem
    'motif burung hong dengan bunga peony berwarna merah terang, gaya batik Lasem yang berani dan megah',
    
    // 🌾 Pekalongan
    'motif bunga teratai dan kupu-kupu berwarna cerah, perpaduan nuansa pastel dan natural, gaya batik pesisir Pekalongan',
    
    // 🌊 Banyumas
    'motif parang rusak dengan latar gelap keemasan, garis diagonal kuat menggambarkan perjuangan dan keberanian, gaya batik Banyumasan',
    
    // 🕊️ Solo
    'motif truntum dengan titik-titik kecil berulang seperti bintang, melambangkan cinta yang tumbuh abadi, gaya batik Keraton Solo',
    
    // 🌿 Yogyakarta
    'motif sekar jagad yang memadukan bentuk peta dunia dengan ornamen bunga, penuh warna dan melambangkan keberagaman budaya Indonesia',
    
    // 🐉 Cirebon
    'motif naga barong dengan awan bergulung dan hiasan tumpal, perpaduan tradisi Tionghoa dan Cirebon klasik',
    
    // 🦚 Pekalongan
    'motif burung merak membuka ekor dengan bunga melati dan daun pakis, warna biru dan hijau lembut, gaya batik pesisir',
    
    // 🌺 Madura
    'motif bunga flamboyan dengan warna kontras merah dan hitam, gaya batik Madura yang ekspresif dan tegas',
    
    // 🌳 Lasem
    'motif pohon hayat dengan burung garuda kecil di dahan, warna merah dan emas, melambangkan kehidupan dan kekuatan',
    
    // 💮 Yogyakarta
    'motif nitik dengan pola titik-titik halus membentuk geometris, warna sogan lembut dan krem, menggambarkan kesabaran dan ketelitian',
    
    // 🌊 Pesisir Utara
    'motif ombak samudra dengan ikan dan terumbu karang berwarna turquoise dan biru laut, gaya batik pesisir modern',
    
    // 🕊️ Keraton
    'motif parang klitik dengan garis diagonal lembut berwarna coklat keemasan, menggambarkan kewibawaan dan ketenangan jiwa',
    
    // 🌼 Kontemporer
    'motif kombinasi kawung dan mega mendung dalam gaya kontemporer, perpaduan tradisi dan modernitas dengan palet warna hangat',
    
    // 🌾 Banyumas
    'motif lumbung padi dan daun pisang, warna tanah dan hijau tua, melambangkan kesuburan dan kesejahteraan, gaya batik Banyumas klasik',

    // 🐦 Garut
    'motif burung cendrawasih dengan bunga anggrek dan sulur daun, gaya batik Garutan yang elegan dan lembut',

    // 🌻 Modern Minimal
    'motif geometris ceplok terinspirasi kawung, disusun dengan warna pastel modern, gaya minimalis namun tetap tradisional',
    ];


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResultImage(null);
        setError('');

        if (!prompt) {
            setError('Deskripsi batik tidak boleh kosong.');
            setIsLoading(false);
            return;
        }

        // Map pilihan UI ke enumerasi API (seamless | single | repeat)
        const apiPatternType = patternType === 'seamless'
            ? 'seamless'
            : ['medalion','tumpal'].includes(patternType)
                ? 'single'
                : 'repeat'; // ceplok, lereng, nitik, isen, dll dianggap repeat

        try {
            const response = await axios.post('/api/batik-generator', {
                // Kirim prompt mentah (backend akan merangkai dengan style, warna, dll)
                prompt: prompt,
                pattern_type: apiPatternType,
                repeat_count: repeatCount,
                color_scheme: colorScheme,
                style: style,
            });

            console.log('✅ Response success:', response.data);

            // Backend mengembalikan image_url (file) + image_data (base64 inline)
            if (response.data.image_url) {
                setResultImage(response.data.image_url);
            } else if (response.data.image_data) {
                setResultImage(response.data.image_data);
            } else {
                throw new Error('Respons dari server tidak berisi data gambar.');
            }
        } catch (err) {
            console.error('❌ Submit Error:', err);
            if (err.response) {
                console.error('🧩 Error Data:', err.response.data);
                console.error('🧩 Status:', err.response.status);
                setError(
                    err.response.data.details ||
                    err.response.data.error ||
                    'Server error.'
                );
            } else if (err.request) {
                console.error('🛰 No response:', err.request);
                setError('Server tidak merespon.');
            } else {
                console.error('⚙️ Config Error:', err.message);
                setError('Kesalahan konfigurasi frontend.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAsDesign = () => {
        const designTitle = prompt.substring(0, 30); // Ambil judul dari prompt
        if (!resultImage) return;

        // Inertia akan menangani redirect secara otomatis
        router.post('/designs/ai', { title: designTitle, image_data: resultImage });
    };

    const handleDownload = () => {
        if (!resultImage) return;
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = `${prompt.substring(0, 20) || 'batik-ai'}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRandomizePrompt = () => {
        const randomIndex = Math.floor(Math.random() * promptTemplates.length);
        setPrompt(promptTemplates[randomIndex]);
    };


    return (
        <UserLayout title="AI Batik Generator">
            <SEO 
                title="AI Batik Generator"
                description="Generator motif batik otomatis dengan teknologi AI. Buat desain batik unik dalam hitungan detik dengan berbagai pilihan warna dan gaya tradisional Indonesia."
                keywords="AI batik, generator batik, desain batik AI, motif batik otomatis, batik sogan, batik lasem, batik mega mendung, batik modern"
            />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-[#BA682A] to-[#D2691E] rounded-xl">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">AI Batik Generator</h1>
                                <p className="text-sm text-gray-500">Buat motif batik unik dengan teknologi AI</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Panel: Form Input */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Main Input Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <ImageIcon className="w-5 h-5 text-[#BA682A]" />
                                    <h2 className="text-lg font-semibold text-gray-800">Deskripsi Motif</h2>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Contoh: seekor burung merak dengan ekor bunga teratai..."
                                            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-transparent transition-all resize-none text-sm"
                                            disabled={isLoading}
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Jelaskan detail motif yang Anda inginkan</p>
                                    </div>
                                    
                                    {/* Randomize Button */}
                                    <button
                                        type="button"
                                        onClick={handleRandomizePrompt}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-[#BA682A] text-[#BA682A] font-medium rounded-xl hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <span>Acak Prompt Batik</span>
                                    </button>
                                </div>
                            </div>

                            {/* Pattern Options Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Grid3x3 className="w-5 h-5 text-[#BA682A]" />
                                    <h2 className="text-lg font-semibold text-gray-800">Opsi Pola Batik</h2>
                                </div>
                                
                                <div className="space-y-4">
                                    {/* Repeat Count */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Repeat className="w-4 h-4" />
                                            Pengulangan Pola: {repeatCount === 0 ? 'Default (Tanpa Perulangan)' : `${repeatCount}x${repeatCount}`}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="4"
                                            value={repeatCount}
                                            onChange={(e) => setRepeatCount(parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#BA682A]"
                                            disabled={isLoading}
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Default</span>
                                            <span>1x1</span>
                                            <span>2x2</span>
                                            <span>3x3</span>
                                            <span>4x4</span>
                                        </div>
                                    </div>

                                    {/* Style */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gaya Batik
                                        </label>
                                        <select
                                            value={style}
                                            onChange={(e) => setStyle(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA682A] focus:border-transparent text-sm"
                                            disabled={isLoading}
                                        >
                                            <option value="klasik">Klasik Tradisional</option>
                                            <option value="modern">Modern Minimalis</option>
                                            <option value="kontemporer">Kontemporer</option>
                                            <option value="abstrak">Abstrak</option>
                                            <option value="geometris">Geometris</option>
                                        </select>
                                    </div>

                                    {/* Color Scheme */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Palette className="w-4 h-4" />
                                            Palet Warna Batik
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { 
                                                    value: 'sogan', 
                                                    label: 'Sogan Keraton', 
                                                    colors: ['#6E3B1E', '#D2A679', '#EADCC2'] 
                                                },
                                                { 
                                                    value: 'lasem', 
                                                    label: 'Lasem Merah', 
                                                    colors: ['#A61C20', '#F4C2C2', '#E9C46A'] 
                                                },
                                                { 
                                                    value: 'megamendung', 
                                                    label: 'Mega Mendung', 
                                                    colors: ['#1E3A8A', '#3B82F6', '#93C5FD'] 
                                                },
                                                { 
                                                    value: 'banyumasan', 
                                                    label: 'Banyumasan', 
                                                    colors: ['#3E2723', '#6D4C41', '#BCAAA4'] 
                                                },
                                                { 
                                                    value: 'pastel', 
                                                    label: 'Modern Pastel', 
                                                    colors: ['#FEE2E2', '#E0E7FF', '#D1FAE5'] 
                                                }
                                            ].map((scheme) => (
                                                <button
                                                    key={scheme.value}
                                                    type="button"
                                                    onClick={() => setColorScheme(scheme.value)}
                                                    className={`p-3 rounded-lg border-2 transition-all ${
                                                        colorScheme === scheme.value
                                                            ? 'border-[#BA682A] ring-2 ring-orange-200'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                    disabled={isLoading}
                                                >
                                                    <div className="flex gap-1 mb-2 h-6">
                                                        {scheme.colors.map((color, idx) => (
                                                            <div 
                                                                key={idx}
                                                                className="flex-1 rounded"
                                                                style={{ backgroundColor: color }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-700 leading-tight block">
                                                        {scheme.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Tips Card */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-orange-200">
                                <div className="flex items-start gap-3">
                                    <Book className="w-5 h-5 text-[#BA682A] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800 mb-2">Tips Membuat Motif</h3>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>• Gunakan deskripsi yang detail dan spesifik</li>
                                            <li>• Sebutkan elemen utama motif (flora, fauna, geometris)</li>
                                            <li>• Tentukan suasana atau tema yang diinginkan</li>
                                            <li>• Eksperimen dengan berbagai kombinasi pola</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Generate Button - Moved to Bottom */}
                            <button 
                                onClick={handleSubmit}
                                disabled={isLoading || !prompt} 
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Sedang Menggambar...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-6 h-6" />
                                        <span>Generate Batik</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Right Panel: Result Display */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Hasil Generate</h2>
                                        <p className="text-sm text-gray-500">Preview motif batik Anda</p>
                                    </div>
                                    
                                    {resultImage && !isLoading && (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleDownload} 
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Unduh
                                            </button>
                                            <button 
                                                onClick={handleSaveAsDesign} 
                                                className="flex items-center gap-2 px-4 py-2 bg-[#BA682A] text-white text-sm font-medium rounded-lg hover:bg-[#A0522D] transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                                Simpan & Edit
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Display Area */}
                                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                                    {isLoading && (
                                        <div className="text-center p-8">
                                            <div className="w-16 h-16 border-4 border-[#BA682A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                            <p className="font-semibold text-gray-800 mb-2">AI sedang bekerja...</p>
                                            <p className="text-sm text-gray-500">Proses ini memakan waktu 30-60 detik</p>
                                            <div className="mt-4 flex items-center justify-center gap-2">
                                                <div className="w-2 h-2 bg-[#BA682A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 bg-[#BA682A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 bg-[#BA682A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {error && (
                                        <div className="text-center p-8">
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <span className="text-3xl">⚠️</span>
                                            </div>
                                            <p className="text-red-600 font-semibold mb-2">Terjadi Kesalahan</p>
                                            <p className="text-sm text-gray-600">{error}</p>
                                        </div>
                                    )}
                                    
                                    {!isLoading && !error && resultImage && (
                                        <div className="w-full h-full p-4 relative">
                                            {/* Pattern Display with Repeat */}
                                            <div 
                                                className="w-full h-full rounded-xl overflow-hidden shadow-lg"
                                                style={{
                                                    backgroundImage: `url(${resultImage})`,
                                                    backgroundSize: repeatCount === 0 
                                                        ? 'cover' 
                                                        : patternType === 'centered' 
                                                        ? 'contain' 
                                                        : patternType === 'scattered'
                                                        ? '30%'
                                                        : `${100 / repeatCount}%`,
                                                    backgroundRepeat: repeatCount === 0 ? 'no-repeat' : patternType === 'centered' ? 'no-repeat' : 'repeat',
                                                    backgroundPosition: repeatCount === 0 ? 'center' : patternType === 'centered' ? 'center' : patternType === 'diagonal' ? 'top left' : 'top left',
                                                    transform: patternType === 'diagonal' && repeatCount > 0 ? 'rotate(0deg)' : 'none'
                                                }}
                                            >
                                                {/* Overlay for diagonal pattern effect */}
                                                {patternType === 'diagonal' && repeatCount > 0 && (
                                                    <div 
                                                        className="w-full h-full"
                                                        style={{
                                                            backgroundImage: `url(${resultImage})`,
                                                            backgroundSize: `${100 / repeatCount}%`,
                                                            backgroundRepeat: 'repeat',
                                                            transform: 'rotate(45deg) scale(1.5)',
                                                            transformOrigin: 'center'
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {!isLoading && !error && !resultImage && (
                                        <div className="text-center text-gray-400 p-8">
                                            <ImageIcon className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                            <p className="font-medium text-lg mb-2">Belum Ada Hasil</p>
                                            <p className="text-sm">Isi form di samping dan klik Generate untuk membuat motif batik</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pattern Info */}
                                {resultImage && !isLoading && (
                                    <div className="mt-6 grid grid-cols-3 gap-4">
                                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                                            <p className="text-xs text-gray-600 mb-1">Ukuran</p>
                                            <p className="text-sm font-semibold text-gray-800">{repeatCount === 0 ? 'Default' : `${repeatCount}x${repeatCount}`}</p>
                                        </div>
                                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                                            <p className="text-xs text-gray-600 mb-1">Gaya</p>
                                            <p className="text-sm font-semibold text-gray-800 capitalize">{style}</p>
                                        </div>
                                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                                            <p className="text-xs text-gray-600 mb-1">Warna</p>
                                            <p className="text-sm font-semibold text-gray-800 capitalize">{colorScheme}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}