
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
import HelpFaqItem from '@/components/HelpFaqItem';
import HelpCategoryCard from '@/components/HelpCategoryCard';

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
      color: 'text-[#A68B6D]',
      bg: 'bg-[#FAF5EF]'
    },
    {
      name: 'Layanan',
      icon: <Clock className="w-10 h-10" />,
      desc: 'Informasi mengenai layanan custom dan kunjungan galeri.',
      color: 'text-[#4E8070]',
      bg: 'bg-[#EBF2EF]'
    },
    {
      name: 'Konveksi',
      icon: <Package className="w-10 h-10" />,
      desc: 'Detail mengenai pesanan konveksi dan minimum order.',
      color: 'text-[#5F9079]',
      bg: 'bg-[#EFF6F2]'
    },
    {
      name: 'Kemitraan',
      icon: <Users className="w-10 h-10" />,
      desc: 'Syarat dan ketentuan menjadi mitra pemasok Larasena.',
      color: 'text-[#4E8070]',
      bg: 'bg-[#EBF2EF]'
    },
    {
      name: 'Pembayaran',
      icon: <CreditCard className="w-10 h-10" />,
      desc: 'Panduan metode pembayaran, cicilan, dan garansi.',
      color: 'text-[#B8A890]',
      bg: 'bg-[#FCF8F3]'
    },
    {
      name: 'Pengiriman',
      icon: <Truck className="w-10 h-10" />,
      desc: 'Opsi pengiriman domestik dan juga internasional.',
      color: 'text-[#4E8070]',
      bg: 'bg-[#EBF2EF]'
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
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#FAF8F4] via-[#F5F3ED] to-[#EFF0EB] border-b border-[#E8E5DC] pt-16 pb-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#4E8070]/10 border border-[#4E8070]/20">
              <HelpCircle className="w-4 h-4 text-[#4E8070]" />
              <span className="text-sm font-medium text-[#4E8070]">Pusat Dukungan Larasena</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[#3F6D5F] to-[#4E8070] bg-clip-text text-transparent">Pusat Bantuan</h1>
            <p className="text-[#5F8070] text-base mb-8 max-w-md mx-auto">Temukan jawaban atas pertanyaan Anda dan dapatkan panduan lengkap untuk pengalaman terbaik</p>

            <div className="relative max-w-md mx-auto flex items-center gap-2 bg-white border border-[#D9D5CC] rounded-lg px-4 py-3 shadow-sm">
              <Search className="w-5 h-5 text-[#A68B6D]" />
              <input
                type="text"
                placeholder="Cari bantuan..."
                className="w-full py-2 border-none focus:ring-0 text-base text-gray-800 placeholder-[#A9A69E] bg-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-[#A9A69E] hover:text-[#4E8070] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Section */}
        {!searchQuery && selectedCategory === 'Semua' && (
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-[#3F6D5F] to-[#4E8070] bg-clip-text text-transparent mb-8">Jelajahi Topik</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <HelpCategoryCard key={cat.name} cat={cat} onClick={setSelectedCategory} />
              ))}
            </div>
          </div>
        )}

        {/* FAQ List Section */}
        {(searchQuery || selectedCategory !== 'Semua') && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-[#3F6D5F] to-[#4E8070] bg-clip-text text-transparent">
                {searchQuery ? `Hasil: "${searchQuery}"` : selectedCategory}
              </h2>
              <button
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSearchQuery('');
                }}
                className="text-sm font-medium text-[#4E8070] hover:text-[#3F6D5F] transition-colors"
              >
                Kembali
              </button>
            </div>

            {filteredFaq.length === 0 ? (
              <div className="text-center py-12 bg-[#F5F3ED] rounded-lg border border-[#E8E5DC]">
                <HelpCircle className="w-10 h-10 text-[#7A9B8F] mx-auto mb-4" />
                <h3 className="font-semibold text-[#3F6D5F] mb-2">Tidak Ada Hasil</h3>
                <p className="text-[#4E8070] text-sm mb-4">Kami tidak menemukan jawaban untuk pencarian Anda.</p>
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-[#4E8070] text-white text-sm rounded-lg hover:bg-[#3F6D5F] transition-colors"
                >
                  Reset
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaq.map((faq) => (
                  <HelpFaqItem key={faq.id} faq={faq} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </UserLayout>
  );
}