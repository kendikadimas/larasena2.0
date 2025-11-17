
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
    { name: 'Semua', count: faqData.length },
    { name: 'Batik & Motif', count: faqData.filter(f => f.category === 'Batik & Motif').length },
    { name: 'Layanan', count: faqData.filter(f => f.category === 'Layanan').length },
    { name: 'Konveksi', count: faqData.filter(f => f.category === 'Konveksi').length },
    { name: 'Kemitraan', count: faqData.filter(f => f.category === 'Kemitraan').length },
    { name: 'Pembayaran', count: faqData.filter(f => f.category === 'Pembayaran').length },
    { name: 'Pengiriman', count: faqData.filter(f => f.category === 'Pengiriman').length }
  ];

  const filteredFaq = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
  };

  return (
    <UserLayout title="Bantuan">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30">
       
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#8B4513] to-[#BA682A] text-white py-20 mb-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan yang sering ditanyakan seputar Larasena
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg border p-8 mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Cari pertanyaan atau kata kunci..."
                className="w-full pl-14 pr-14 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BA682A] focus:border-[#BA682A] text-lg transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedCategory === category.name
                      ? 'bg-[#BA682A] text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  {category.name}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    selectedCategory === category.name 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Cards Grid */}
          {filteredFaq.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <HelpCircle className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-3">Tidak Ada Hasil</h3>
              <p className="text-gray-500 mb-6">
                Maaf, tidak ada pertanyaan yang sesuai dengan pencarian Anda
              </p>
              <button
                onClick={clearSearch}
                className="px-8 py-3 bg-[#BA682A] text-white rounded-xl hover:bg-[#9d5a24] transition-colors font-semibold"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFaq.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-[#BA682A]/30 group"
                >
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#BA682A]/10 to-amber-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-[#BA682A]">
                      {faq.icon}
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-[#BA682A]/10 text-[#BA682A] text-xs rounded-full font-semibold">
                      {faq.category}
                    </span>
                  </div>

                  {/* Question */}
                  <h3 className="text-lg font-bold text-gray-800 mb-3 leading-snug group-hover:text-[#BA682A] transition-colors">
                    {faq.question}
                  </h3>

                  {/* Answer */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}