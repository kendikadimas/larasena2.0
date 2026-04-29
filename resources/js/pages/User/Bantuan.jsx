
import { useState } from 'react';
import UserLayout from '@/layouts/User/Layout';
import { 
  Search, 
  HelpCircle,
  X,
  Palette,
  Package,
  CreditCard,
  Truck,
  Clock,
  Sparkles,
  Settings,
  Users,
  ShoppingBag,
  FileText,
  Shield,
  Award
} from 'lucide-react';

export default function Bantuan() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const faqData = [
    {
      id: 1,
      category: 'Batik & Motif',
      icon: <Palette className="w-6 h-6" />,
      question: 'Apa perbedaan antara Batik Tulis, Cap, dan Printing?',
      answer: 'Batik Tulis dilukis tangan menggunakan canting dan malam, proses pembuatan sangat detail dan membutuhkan waktu lama sehingga harga lebih tinggi namun sangat eksklusif. Batik Cap menggunakan stempel tembaga dengan motif tertentu, lebih cepat dari tulis namun tetap berkualitas. Batik Printing dicetak menggunakan mesin dengan teknik sablon, paling terjangkau dan cocok untuk produksi massal.'
    },
    {
      id: 2,
      category: 'Batik & Motif',
      icon: <Sparkles className="w-6 h-6" />,
      question: 'Bagaimana cara merawat kain batik agar awet?',
      answer: 'Cuci batik dengan air dingin atau suam-suam kuku, gunakan deterjen khusus atau yang lembut tanpa pemutih. Hindari meremas terlalu kuat, cukup ditekan-tekan lembut. Jemur di tempat teduh, hindari sinar matahari langsung. Setrika dengan suhu rendah-sedang dan gunakan kain pelapis. Simpan di tempat kering dengan gantungan atau lipat rapi dengan tisu bebas asam.'
    },
    {
      id: 3,
      category: 'Batik & Motif',
      icon: <Award className="w-6 h-6" />,
      question: 'Motif batik mana yang cocok untuk acara formal?',
      answer: 'Untuk acara formal, pilih motif klasik seperti Parang (melambangkan kekuatan), Kawung (filosofi kesempurnaan), Truntum (kasih sayang abadi), atau Sido Mukti (kebahagiaan dan kemakmuran). Pilih warna yang tidak terlalu mencolok seperti coklat, navy, hitam, atau maroon. Hindari motif yang terlalu ramai atau warna-warna cerah seperti pink atau kuning.'
    },
    {
      id: 4,
      category: 'Pengiriman',
      icon: <Truck className="w-6 h-6" />,
      question: 'Apakah Larasena melayani pengiriman internasional?',
      answer: 'Ya, kami melayani pengiriman ke berbagai negara di Asia Tenggara, Australia, Amerika, dan Eropa. Biaya pengiriman bervariasi mulai dari Rp 150.000 untuk Asia Tenggara hingga Rp 500.000 untuk Eropa/Amerika. Waktu pengiriman 7-21 hari kerja tergantung destinasi. Semua pengiriman internasional menggunakan tracking number dan asuransi.'
    },
    {
      id: 5,
      category: 'Layanan',
      icon: <Clock className="w-6 h-6" />,
      question: 'Berapa lama waktu pembuatan batik custom?',
      answer: 'Waktu pembuatan bervariasi: Batik tulis custom 3-6 minggu (tergantung detail motif), Batik cap custom 1-3 minggu, Batik printing custom 5-10 hari kerja, Batik kombinasi tulis-cap 2-4 minggu. Untuk order mendadak tersedia layanan rush dengan biaya tambahan 30-50%. Kami akan memberikan update progress secara berkala.'
    },
    {
      id: 6,
      category: 'Kemitraan',
      icon: <Users className="w-6 h-6" />,
      question: 'Bagaimana cara menjadi mitra atau pemasok Larasena?',
      answer: 'Untuk menjadi mitra, Anda harus memenuhi kriteria: memiliki pengalaman minimal 2 tahun di bidang batik, kapasitas produksi minimal 100 pieces/bulan, kualitas konsisten, dan berkomitmen pada deadlines. Proses aplikasi meliputi pengajuan portofolio, sample testing, audit fasilitas, dan kontrak kemitraan. Benefit mitra termasuk training, bantuan marketing, dan pembayaran tepat waktu.'
    },
    {
      id: 7,
      category: 'Konveksi',
      icon: <Package className="w-6 h-6" />,
      question: 'Apa minimum order untuk layanan konveksi?',
      answer: 'Minimum order untuk konveksi: Batik printing 50 pcs per desain, Batik cap 30 pcs per desain, Batik tulis 10 pcs per desain. Untuk order 100+ pcs diskon 10%, 500+ pcs diskon 20%, 1000+ pcs diskon 30%. Tersedia paket komplit termasuk desain, cutting, sewing, finishing, packaging, dan label custom. Free ongkir untuk order 200+ pcs area Jawa.'
    },
    {
      id: 8,
      category: 'Konveksi',
      icon: <Settings className="w-6 h-6" />,
      question: 'Bisa menggunakan desain sendiri untuk konveksi?',
      answer: 'Ya, Anda bisa menggunakan desain sendiri. Format file yang diterima: AI, PSD, PDF, atau JPG/PNG resolusi tinggi (300 DPI minimum). Tim desainer kami akan review dan memberikan feedback untuk optimalisasi produksi. Jika diperlukan penyesuaian teknis, kami akan konsultasikan terlebih dahulu. Tersedia juga layanan digitalisasi desain manual dengan biaya tambahan Rp 50.000-200.000 per desain.'
    },
    {
      id: 9,
      category: 'Pembayaran',
      icon: <CreditCard className="w-6 h-6" />,
      question: 'Metode pembayaran apa saja yang diterima?',
      answer: 'Metode pembayaran yang tersedia: Transfer bank (BCA, Mandiri, BNI, BRI), Kartu kredit/debit (Visa, Mastercard), E-wallet (OVO, GoPay, Dana, ShopeePay, LinkAja), QRIS, Virtual account, dan COD (area tertentu). Untuk order 5+ juta tersedia cicilan 0% hingga 12 bulan. Pembayaran internasional melalui PayPal atau Wise. Down payment minimal 30% untuk custom order.'
    },
    {
      id: 10,
      category: 'Pembayaran',
      icon: <Shield className="w-6 h-6" />,
      question: 'Apakah ada garansi untuk produk batik?',
      answer: 'Ya, kami memberikan garansi komprehensif: Garansi kualitas 30 hari (jika ada cacat produksi), Garansi warna luntur 60 hari untuk batik tulis/cap, Garansi ukuran tidak sesuai dapat tukar dalam 14 hari, Return policy jika tidak sesuai ekspektasi dalam 7 hari (produk belum dipakai). Untuk custom order, revision unlimited hingga approved. Semua garansi dengan syarat dan ketentuan yang berlaku.'
    },
    {
      id: 11,
      category: 'Batik & Motif',
      icon: <FileText className="w-6 h-6" />,
      question: 'Bagaimana cara membedakan batik asli dan palsu?',
      answer: 'Ciri batik asli: motif tembus ke kedua sisi kain, warna tidak mudah luntur, tekstur kain berkualitas, jahitan rapi, memiliki sertifikat atau label resmi. Batik tulis asli memiliki garis-garis yang tidak sempurna karena dibuat tangan. Hindari batik dengan harga terlalu murah, motif hanya di satu sisi, atau warna yang terlalu mencolok tidak natural.'
    },
    {
      id: 12,
      category: 'Layanan',
      icon: <ShoppingBag className="w-6 h-6" />,
      question: 'Apakah bisa mengunjungi workshop atau galeri Larasena?',
      answer: 'Ya, kami memiliki showroom dan workshop di Yogyakarta yang buka untuk kunjungan. Jam operasional Senin-Sabtu 09:00-17:00, Minggu 10:00-15:00. Tersedia tour workshop gratis dengan guide, demo pembuatan batik, dan shopping area. Untuk rombongan 10+ orang mohon reservasi H-3. Lokasi di Jl. Malioboro No. 123, dekat dengan Tugu Yogyakarta.'
    }
  ];

  const categories = [
    { 
      name: 'Batik & Motif', 
      icon: <Palette className="w-10 h-10" />,
      desc: 'Pelajari filosofi, jenis, dan cara merawat kain batik.',
      color: 'text-[#BA682A]',
      bg: 'bg-orange-50'
    },
    { 
      name: 'Layanan', 
      icon: <Clock className="w-10 h-10" />,
      desc: 'Informasi mengenai layanan custom dan kunjungan galeri.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      name: 'Konveksi', 
      icon: <Package className="w-10 h-10" />,
      desc: 'Detail mengenai pesanan konveksi dan minimum order.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      name: 'Kemitraan', 
      icon: <Users className="w-10 h-10" />,
      desc: 'Syarat dan ketentuan menjadi mitra pemasok Larasena.',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      name: 'Pembayaran', 
      icon: <CreditCard className="w-10 h-10" />,
      desc: 'Panduan metode pembayaran, cicilan, dan garansi.',
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
    { 
      name: 'Pengiriman', 
      icon: <Truck className="w-10 h-10" />,
      desc: 'Opsi pengiriman domestik dan juga internasional.',
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    }
  ];

  const filteredFaq = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <UserLayout title="Bantuan">
      <div className="min-h-screen bg-[#FBF8F1]">
       
        {/* Discord-like Hero Section */}
        <div className="bg-[#1A332F] text-white pt-24 pb-32 relative overflow-hidden">
          {/* Subtle decorative background elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-20 w-48 h-48 bg-[#BA682A]/20 rounded-full blur-3xl"></div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 font-serif tracking-wide">Pusat Bantuan</h1>
            
            {/* Search Bar inside Hero */}
            <div className="relative max-w-2xl mx-auto shadow-2xl rounded-2xl bg-white p-2 flex items-center">
              <div className="pl-4 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Cari pertanyaan atau kata kunci..."
                className="w-full px-4 py-3 border-none focus:ring-0 text-lg text-gray-800 placeholder-gray-400 bg-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Section (Discord-style Cards) */}
        {!searchQuery && selectedCategory === 'Semua' && (
          <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-16">
            <div className="text-center mb-10 pt-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Butuh bantuan? Kami siap membantu.</h2>
              <p className="text-gray-600 text-lg">
                Pilih topik di bawah ini untuk menemukan jawaban yang Anda butuhkan.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1"
                >
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${cat.bg} ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${cat.color}`}>{cat.name}</h3>
                  <p className="text-gray-500">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAQ List Section */}
        {(searchQuery || selectedCategory !== 'Semua') && (
          <div className="max-w-4xl mx-auto px-4 pb-20 pt-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : `Topik: ${selectedCategory}`}
              </h2>
              <button 
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSearchQuery('');
                }}
                className="text-[#BA682A] font-medium hover:underline text-sm flex items-center gap-1"
              >
                Kembali ke Semua Topik
              </button>
            </div>

            {filteredFaq.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6">
                  <HelpCircle className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Tidak Ada Hasil</h3>
                <p className="text-gray-500 mb-6">Maaf, kami tidak dapat menemukan jawaban untuk pencarian Anda.</p>
                <button
                  onClick={clearSearch}
                  className="px-6 py-2.5 bg-[#1A332F] text-white rounded-xl hover:bg-[#0f201d] transition-colors font-medium"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaq.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#D9CCBF] transition-all hover:shadow-md flex gap-5 group"
                  >
                    <div className="hidden sm:flex flex-shrink-0 w-12 h-12 bg-[#FBF8F1] rounded-full items-center justify-center text-[#BA682A]">
                      {faq.icon}
                    </div>
                    <div>
                      <div className="mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#BA682A] transition-colors">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </UserLayout>
  );
}