import UserLayout from '@/layouts/User/Layout';
import { Link, router, usePage } from '@inertiajs/react';
import {
  Plus,
  Grid3X3,
  List,
  Edit3,
  Download,
  Search,
  Trash2,
  Wand2,
  Paintbrush,
  X,
  Upload
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Dashboard({ designs = [] }) {
  const { auth } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(0);
  const [showCanvasModal, setShowCanvasModal] = useState(false);
  const [customSize, setCustomSize] = useState({ width: 800, height: 600 });
  const [fabOpen, setFabOpen] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [publishData, setPublishData] = useState({ title: '', philosophy: '' });
  const [publishLoading, setPublishLoading] = useState(false);
  const user = auth.user;

  const filterItems = ['Semua', 'Terbaru', 'Favorit', 'Draft'];

  const canvasPresets = [
    { label: '1:1 (800×800)', width: 800, height: 800 },
    { label: '3:4 (900×1200)', width: 900, height: 1200 },
    { label: '4:3 (1200×900)', width: 1200, height: 900 },
    { label: '16:9 (1600×900)', width: 1600, height: 900 },
  ];

 
  const filteredDesigns = useMemo(() => {
    let list = designs.filter(d => (d.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
    switch (activeFilter) {
      case 1: 
        list = [...list].sort((a, b) =>
          new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)
        );
        break;
      case 2: 
        list = list.filter(d => d.is_favorite === true || d.favorite === true || d.favorite === 1);
        break;
      case 3: 
        list = list.filter(d => d.status === 'draft' || d.is_draft === true || d.draft === true);
        break;
      default: break;
    }
    return list;
  }, [designs, searchTerm, activeFilter]);

  const handleDelete = (designId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus desain ini?')) {
      router.delete(`/designs/${designId}`, {
        onSuccess: () => alert('Desain berhasil dihapus'),
        onError: () => alert('Gagal menghapus desain')
      });
    }
  };

  const handleDownload = (design) => {
    if (design.image_url) {
      const link = document.createElement('a');
      link.href = design.image_url;
      link.download = `${design.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openEditor = (width, height) => {
    setShowCanvasModal(false);
    router.visit(`/editor?width=${width}&height=${height}`);
  };

  const handlePublishClick = (design) => {
    setSelectedDesign(design);
    setPublishData({ title: design.title || '', philosophy: '' });
    setShowPublishModal(true);
  };

  const handlePublishSubmit = () => {
    if (!publishData.title.trim() || !publishData.philosophy.trim()) {
      alert('Mohon isi nama motif dan filosofi');
      return;
    }

    setPublishLoading(true);

    // Convert design image to blob and upload
    const formData = new FormData();
    formData.append('title', publishData.title);
    formData.append('philosophy', publishData.philosophy);
    formData.append('design_id', selectedDesign.id);
    
    // Add design_data as JSON string
    const designData = {
      design_id: selectedDesign.id,
      title: selectedDesign.title,
      original_path: selectedDesign.image_url
    };
    formData.append('design_data', JSON.stringify(designData));
    
    // Fetch image and convert to file
    fetch(selectedDesign.image_url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${selectedDesign.title}.png`, { type: 'image/png' });
        formData.append('image', file);

        router.post('/motif/publish', formData, {
          onSuccess: () => {
            setShowPublishModal(false);
            setPublishLoading(false);
            setPublishData({ title: '', philosophy: '' });
            alert('Motif berhasil disubmit untuk review!');
          },
          onError: (errors) => {
            setPublishLoading(false);
            console.error(errors);
            alert('Gagal submit motif. Silakan coba lagi.');
          }
        });
      })
      .catch(err => {
        setPublishLoading(false);
        console.error(err);
        alert('Gagal mengambil gambar. Silakan coba lagi.');
      });
  };

  return (
    <UserLayout title="Batik Saya">
   
      <div className="flex justify-between items-start mb-6">
        <div className="max-w-full">
          <p className="text-gray-600 text-base sm:text-lg font-regular mb-2 leading-relaxed">
            Hi, <span className="text-[#BA682A] font-semibold">{user.name}</span>! Selamat datang kembali.
            <br className="hidden sm:block" />
            Kamu sudah membuat:{' '}
            <span className="text-[#BA682A] font-semibold">
              {filteredDesigns.length} desain
            </span>
          </p>
        </div>

     
        <div className="hidden md:flex gap-4">
          <button
            onClick={() => setShowCanvasModal(true)}
            className="relative overflow-hidden rounded-2xl p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group h-16 w-48"
            style={{
              background: 'linear-gradient(135deg, #D2691E 0%, #A0522D 100%)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="relative z-10 h-full flex items-center justify-between">
              <h3 className="font-semibold text-md">Buat Batik</h3>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform group-hover:scale-110"
                style={{ background: 'rgba(255, 255, 255, 0.25)' }}
              >
                <Plus className="w-4 h-4" />
              </div>
            </div>
          </button>

          <Link
            href="/batik-generator"
            className="relative overflow-hidden rounded-2xl p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group h-16 w-48 block"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.25)'
            }}
          >
            <div className="relative z-10 h-full flex items-center justify-between">
              <h3 className="font-semibold text-md">Generate AI</h3>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform group-hover:scale-110"
                style={{ background: 'rgba(255, 255, 255, 0.25)' }}
              >
                <img src="/images/icons/ai.svg" alt="AI Icon" className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between gap-6 mb-6">
        <div className="flex gap-2">
          {filterItems.map((filter, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                index === activeFilter
                  ? 'bg-[#D2691E] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari desain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#D2691E] focus:border-transparent w-64"
            />
          </div>

          <div className="flex bg-white border border-gray-200 rounded-lg p-1">
            <button className="p-2 rounded-md bg-[#D2691E] text-white">
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden mb-6 space-y-3">
    
        <div className="flex gap-2 overflow-x-auto px-1 -mx-1">
          {filterItems.map((filter, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(index)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                index === activeFilter
                  ? 'bg-[#D2691E] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari desain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#D2691E] focus:border-transparent"
          />
        </div>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDesigns.length > 0 ? (
          filteredDesigns.map((design) => (
            <div
              key={design.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={design.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={design.title}
                  className="w-full h-48 object-contain bg-gray-50"
                />

                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium">
                    {design.canvas_width || 800} × {design.canvas_height || 600}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                    {new Date(design.updated_at).toLocaleDateString('id-ID')}
                  </span>
                  
                  {design.published_status && (
                    <span className={`backdrop-blur-sm text-xs px-2 py-1 rounded-md font-medium ${
                      design.published_status === 'approved' 
                        ? 'bg-green-500/90 text-white' 
                        : design.published_status === 'pending'
                        ? 'bg-yellow-500/90 text-white'
                        : 'bg-red-500/90 text-white'
                    }`}>
                      {design.published_status === 'approved' ? '✓ Terpublish' : 
                       design.published_status === 'pending' ? '⏳ Menunggu' : 
                       '✗ Ditolak'}
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex gap-2">
                    <Link
                      href={`/designs/${design.id}`}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handlePublishClick(design)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-amber-500 hover:text-white transition-colors"
                      title="Publish ke Galeri"
                    >
                      <Upload className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDownload(design)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-[#D2691E] hover:text-white transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(design.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-red-500 hover:text-white transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm flex-1 group-hover:text-[#D2691E] transition-colors">
                    {design.title}
                  </h3>
                  {design.published_status && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                      design.published_status === 'approved' 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : design.published_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                      {design.published_status === 'approved' ? '✓ Published' : 
                       design.published_status === 'pending' ? '⏳ Pending' : 
                       '✗ Rejected'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Terakhir diubah · {new Date(design.updated_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada desain</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Tidak ditemukan desain yang sesuai dengan pencarian' : 'Mulai buat desain batik pertama Anda'}
            </p>
            <button
              onClick={() => setShowCanvasModal(true)}
              className="inline-flex items-center px-4 py-2 bg-[#D2691E] hover:bg-[#A0522D] text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Desain Baru
            </button>
          </div>
        )}
      </div>

   
      <div className="md:hidden">
        {fabOpen && (
          <button
            aria-label="Close FAB overlay"
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40"
            onClick={() => setFabOpen(false)}
          />
        )}

        <div className="fixed right-4 bottom-24 z-50 flex flex-col items-end gap-3 pointer-events-none">
          {fabOpen && (
            <>
              <button
                onClick={() => {
                  setFabOpen(false);
                  router.visit('/batik-generator');
                }}
                className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg bg-white text-gray-800 hover:bg-gray-50 transition"
              >
                <span className="text-sm font-medium">Generate AI</span>
                <Wand2 className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={() => {
                  setFabOpen(false);
                  setShowCanvasModal(true);
                }}
                className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg bg-white text-gray-800 hover:bg-gray-50 transition"
              >
                <span className="text-sm font-medium">Buat Batik</span>
                <Paintbrush className="w-4 h-4 text-amber-600" />
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setFabOpen((s) => !s)}
          aria-label="Buka tindakan cepat"
          className="fixed right-4 bottom-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-transform active:scale-95"
          style={{
            background: fabOpen
              ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)'
              : 'linear-gradient(135deg, #D2691E 0%, #A0522D 100%)',
          }}
        >
          {fabOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </div>

   
      {showCanvasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Pilih Ukuran Canvas</h2>
            <p className="text-sm text-gray-600">Pilih ukuran canvas untuk desain batik Anda</p>

            <div className="space-y-2">
              {canvasPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => openEditor(preset.width, preset.height)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-[#D2691E] hover:bg-[#FFF7ED] transition-all text-left group"
                >
                  <span className="font-medium text-gray-800 group-hover:text-[#D2691E]">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2 font-medium">Ukuran Custom (px)</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min={200}
                  max={3000}
                  value={customSize.width}
                  onChange={(e) =>
                    setCustomSize((prev) => ({ ...prev, width: Number(e.target.value) }))
                  }
                  className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-[#D2691E] focus:outline-none"
                  placeholder="Lebar"
                />
                <input
                  type="number"
                  min={200}
                  max={3000}
                  value={customSize.height}
                  onChange={(e) =>
                    setCustomSize((prev) => ({ ...prev, height: Number(e.target.value) }))
                  }
                  className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-[#D2691E] focus:outline-none"
                  placeholder="Tinggi"
                />
              </div>
              <button
                onClick={() => openEditor(customSize.width, customSize.height)}
                className="mt-3 w-full px-4 py-2 bg-[#D2691E] text-white rounded-lg hover:bg-[#A0522D] transition font-medium"
              >
                Gunakan ukuran custom
              </button>
            </div>

            <button
              onClick={() => setShowCanvasModal(false)}
              className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && selectedDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Publish Motif ke Galeri</h2>
              <p className="text-amber-50 text-sm mt-1">Bagikan karya batik Anda dengan komunitas</p>
            </div>

            <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Preview Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preview Motif</label>
                <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <img
                    src={selectedDesign.image_url}
                    alt={selectedDesign.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Motif *
                </label>
                <input
                  type="text"
                  value={publishData.title}
                  onChange={(e) => setPublishData({ ...publishData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Contoh: Batik Parang Kombinasi Modern"
                  maxLength={255}
                />
              </div>

              {/* Philosophy Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filosofi Motif *
                </label>
                <textarea
                  value={publishData.philosophy}
                  onChange={(e) => setPublishData({ ...publishData, philosophy: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                  rows={4}
                  placeholder="Ceritakan makna dan filosofi di balik motif batik Anda..."
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {publishData.philosophy.length}/1000 karakter
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="text-amber-600 mt-0.5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-900 text-sm mb-1">Proses Review</h4>
                    <p className="text-amber-800 text-xs leading-relaxed">
                      Motif yang Anda submit akan direview oleh admin. Jika disetujui, motif akan tampil di galeri publik dan Anda akan mendapatkan badge!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowPublishModal(false);
                  setPublishData({ title: '', philosophy: '' });
                }}
                disabled={publishLoading}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handlePublishSubmit}
                disabled={publishLoading || !publishData.title.trim() || !publishData.philosophy.trim()}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishLoading ? 'Mengirim...' : 'Submit untuk Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
