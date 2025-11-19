<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TrainingCourse;
use App\Models\TrainingLesson;
use Illuminate\Support\Str;

class TrainingSeeder extends Seeder
{
    public function run(): void
    {
        // Course 1: Dasar
        $courseDasar = TrainingCourse::create([
            'title' => 'Batik Dasar: Pengenalan dan Motif Sederhana',
            'slug' => 'batik-dasar-pengenalan',
            'description' => 'Pelajari dasar-dasar batik mulai dari sejarah, alat, hingga teknik membuat motif sederhana seperti kawung dan truntum.',
            'thumbnail' => null, // No thumbnail for now
            'level' => 'dasar',
            'is_published' => true
        ]);

        // Lessons for Dasar
        TrainingLesson::create([
            'training_course_id' => $courseDasar->id,
            'title' => 'Sejarah dan Filosofi Batik',
            'slug' => 'sejarah-filosofi-batik',
            'description' => 'Memahami sejarah batik Indonesia dan filosofi di balik motif-motif tradisional',
            'type' => 'theory',
            'content' => '<h2>Sejarah Batik Indonesia</h2>
<p>Batik adalah warisan budaya Indonesia yang telah diakui UNESCO sebagai Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi pada tahun 2009.</p>

<h3>Asal Usul Batik</h3>
<p>Kata "batik" berasal dari bahasa Jawa "amba" yang berarti menulis dan "titik". Batik adalah teknik pewarnaan kain dengan menggunakan malam (lilin) untuk menciptakan pola.</p>

<h3>Filosofi Motif Batik</h3>
<ul>
<li><strong>Kawung:</strong> Melambangkan kesucian dan umur panjang</li>
<li><strong>Parang:</strong> Simbol kekuatan dan keberanian</li>
<li><strong>Truntum:</strong> Melambangkan cinta yang tumbuh kembali</li>
</ul>

<h3>Perkembangan Batik Modern</h3>
<p>Saat ini batik berkembang tidak hanya sebagai pakaian tradisional, tetapi juga fashion modern, interior, dan seni kontemporer.</p>',
            'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            'order' => 1,
            'duration' => 15
        ]);

        TrainingLesson::create([
            'training_course_id' => $courseDasar->id,
            'title' => 'Alat dan Bahan Batik',
            'slug' => 'alat-bahan-batik',
            'description' => 'Mengenal berbagai alat dan bahan yang digunakan dalam membuat batik',
            'type' => 'theory',
            'content' => '<h2>Alat-alat Membatik</h2>

<h3>1. Canting</h3>
<p>Alat untuk menuliskan malam pada kain. Terdiri dari:</p>
<ul>
<li>Canting tulis (ujung kecil untuk detail)</li>
<li>Canting tembok (ujung besar untuk isian)</li>
</ul>

<h3>2. Wajan dan Kompor</h3>
<p>Untuk memanaskan dan mencairkan malam (lilin batik)</p>

<h3>3. Gawangan</h3>
<p>Untuk membentangkan kain saat proses membatik</p>

<h3>Bahan-bahan Batik</h3>
<ul>
<li><strong>Kain:</strong> Mori, sutra, katun</li>
<li><strong>Malam:</strong> Lilin batik dari campuran resin dan parafin</li>
<li><strong>Pewarna:</strong> Pewarna alami atau sintetis</li>
</ul>',
            'order' => 2,
            'duration' => 10
        ]);

        TrainingLesson::create([
            'training_course_id' => $courseDasar->id,
            'title' => 'Latihan Garis Dasar',
            'slug' => 'latihan-garis-dasar',
            'description' => 'Praktik membuat garis lurus dan lengkung sebagai fondasi motif batik',
            'type' => 'practice',
            'canvas_data' => json_encode([
                'tools' => ['brush', 'eraser'],
                'instructions' => 'Latihan membuat garis lurus horizontal, vertikal, dan garis lengkung. Gunakan grid sebagai panduan untuk menjaga ketepatan.',
                'canvas_size' => ['width' => 800, 'height' => 600],
                'background' => '#FFFFFF',
                'grid' => [
                    'enabled' => true,
                    'size' => 50,
                    'color' => '#CCCCCC'
                ]
            ]),
            'order' => 3,
            'duration' => 20
        ]);

        TrainingLesson::create([
            'training_course_id' => $courseDasar->id,
            'title' => 'Motif Kawung Sederhana',
            'slug' => 'motif-kawung-sederhana',
            'description' => 'Membuat motif kawung dengan pola lingkaran bersinggungan',
            'type' => 'practice',
            'canvas_data' => json_encode([
                'tools' => ['brush', 'eraser'],
                'instructions' => 'Gambarlah motif kawung dengan 4 lingkaran yang bersinggungan. Perhatikan proporsi dan simetri motif. Gunakan warna coklat tradisional.',
                'canvas_size' => ['width' => 800, 'height' => 600],
                'background' => '#FFF9E6',
                'grid' => [
                    'enabled' => true,
                    'size' => 100,
                    'color' => '#E0E0E0'
                ]
            ]),
            'order' => 4,
            'duration' => 30
        ]);

        // Course 2: Menengah
        $courseMenengah = TrainingCourse::create([
            'title' => 'Batik Menengah: Teknik Canting dan Pewarnaan',
            'slug' => 'batik-menengah-teknik-canting',
            'description' => 'Tingkatkan kemampuan dengan mempelajari teknik canting yang lebih kompleks dan pewarnaan batik tradisional.',
            'thumbnail' => null, // No thumbnail for now
            'level' => 'menengah',
            'is_published' => true
        ]);

        // Lessons for Menengah
        TrainingLesson::create([
            'training_course_id' => $courseMenengah->id,
            'title' => 'Teknik Canting Lanjutan',
            'slug' => 'teknik-canting-lanjutan',
            'description' => 'Menguasai teknik canting untuk membuat detail halus dan isian motif',
            'type' => 'theory',
            'content' => '<h2>Teknik Canting Lanjutan</h2>

<h3>1. Teknik Klowongan</h3>
<p>Membuat garis outline motif dengan canting tulis. Teknik ini membutuhkan ketelitian tinggi.</p>

<h3>2. Teknik Isen-isen</h3>
<p>Mengisi bagian dalam motif dengan ornamen kecil seperti cecek, sawut, dan sisik.</p>

<h3>Tips Menggunakan Canting:</h3>
<ul>
<li>Jaga suhu malam tetap stabil (tidak terlalu panas)</li>
<li>Pegang canting dengan posisi 45 derajat</li>
<li>Tarik canting dengan gerakan halus dan mantap</li>
<li>Jangan terburu-buru, fokus pada kualitas garis</li>
</ul>',
            'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            'order' => 1,
            'duration' => 20
        ]);

        TrainingLesson::create([
            'training_course_id' => $courseMenengah->id,
            'title' => 'Praktik Motif Parang',
            'slug' => 'praktik-motif-parang',
            'description' => 'Membuat motif parang dengan detail isen-isen',
            'type' => 'practice',
            'canvas_data' => json_encode([
                'tools' => ['brush', 'eraser'],
                'instructions' => 'Gambarlah motif parang dengan garis diagonal yang berulang. Tambahkan isen-isen (cecek dan sawut) pada bagian dalam motif.',
                'canvas_size' => ['width' => 1000, 'height' => 800],
                'background' => '#FFF9E6',
                'grid' => [
                    'enabled' => true,
                    'size' => 75,
                    'color' => '#D0D0D0'
                ]
            ]),
            'order' => 2,
            'duration' => 40
        ]);

        TrainingLesson::create([
            'training_course_id' => $courseMenengah->id,
            'title' => 'Pewarnaan Batik Tradisional',
            'slug' => 'pewarnaan-batik-tradisional',
            'description' => 'Teknik pewarnaan dengan pewarna alami dan sintetis',
            'type' => 'theory',
            'content' => '<h2>Teknik Pewarnaan Batik</h2>

<h3>Pewarna Alami</h3>
<ul>
<li><strong>Indigo:</strong> Biru dari tanaman tarum</li>
<li><strong>Soga:</strong> Coklat dari kulit kayu</li>
<li><strong>Jalawe:</strong> Merah dari akar mengkudu</li>
</ul>

<h3>Proses Pewarnaan</h3>
<ol>
<li><strong>Mordanting:</strong> Fiksasi kain dengan tawas</li>
<li><strong>Pencelupan:</strong> Masukkan kain ke pewarna</li>
<li><strong>Oksidasi:</strong> Jemur kain untuk reaksi warna</li>
<li><strong>Pelorodan:</strong> Rebus untuk angkat malam</li>
</ol>

<h3>Tips Pewarnaan:</h3>
<p>Lakukan pencelupan berulang untuk warna yang lebih pekat. Jaga suhu dan pH larutan pewarna tetap stabil.</p>',
            'order' => 3,
            'duration' => 25
        ]);

        // Course 3: Lanjutan
        $courseLanjutan = TrainingCourse::create([
            'title' => 'Batik Lanjutan: Inovasi dan Kreasi Modern',
            'slug' => 'batik-lanjutan-inovasi-modern',
            'description' => 'Eksplorasi teknik batik kontemporer dan kreasi motif original dengan menggabungkan tradisi dan inovasi modern.',
            'thumbnail' => null, // No thumbnail for now
            'level' => 'lanjutan',
            'is_published' => true
        ]);

        // Lessons for Lanjutan
        TrainingLesson::create([
            'training_course_id' => $courseLanjutan->id,
            'title' => 'Batik Kontemporer',
            'slug' => 'batik-kontemporer',
            'description' => 'Mengenal tren batik modern dan teknik eksperimental',
            'type' => 'theory',
            'content' => '<h2>Batik Kontemporer</h2>

<h3>Karakteristik Batik Modern</h3>
<ul>
<li>Motif abstrak dan geometris</li>
<li>Warna-warna bold dan berani</li>
<li>Kombinasi teknik tradisional dan digital</li>
<li>Aplikasi pada berbagai media (kaos, tas, sepatu)</li>
</ul>

<h3>Teknik Eksperimental</h3>
<ol>
<li><strong>Batik Celup Ikat:</strong> Kombinasi batik dan tie-dye</li>
<li><strong>Batik Printing:</strong> Sablon motif batik</li>
<li><strong>Batik Digital:</strong> Design digital + print</li>
<li><strong>Eco Print:</strong> Teknik ramah lingkungan</li>
</ol>

<h3>Inspirasi Desain</h3>
<p>Ambil inspirasi dari alam, arsitektur, musik, atau emosi. Batik modern memberikan kebebasan berekspresi tanpa meninggalkan nilai tradisi.</p>',
            'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            'order' => 1,
            'duration' => 30
        ]);

        TrainingLesson::create([
            'training_course_id' => $courseLanjutan->id,
            'title' => 'Kreasi Motif Original',
            'slug' => 'kreasi-motif-original',
            'description' => 'Menciptakan motif batik original dengan gaya personal',
            'type' => 'practice',
            'canvas_data' => json_encode([
                'tools' => ['brush', 'eraser'],
                'instructions' => 'Ciptakan motif batik original Anda sendiri! Bebas berekspresi dengan menggabungkan elemen tradisional dan modern. Tunjukkan kreativitas dan gaya personal Anda.',
                'canvas_size' => ['width' => 1200, 'height' => 900],
                'background' => '#FFFFFF',
                'grid' => [
                    'enabled' => false,
                    'size' => 100,
                    'color' => '#E0E0E0'
                ]
            ]),
            'order' => 2,
            'duration' => 60
        ]);

        TrainingLesson::create([
            'training_course_id' => $courseLanjutan->id,
            'title' => 'Batik untuk Fashion Modern',
            'slug' => 'batik-fashion-modern',
            'description' => 'Aplikasi batik pada fashion kontemporer',
            'type' => 'theory',
            'content' => '<h2>Batik dalam Fashion Modern</h2>

<h3>Tren Batik Fashion 2025</h3>
<ul>
<li><strong>Batik Minimalis:</strong> Motif sederhana dengan cutting modern</li>
<li><strong>Batik Street Style:</strong> Aplikasi pada jacket, hoodie, sneakers</li>
<li><strong>Batik Formal:</strong> Blazer, dress, dan suit dengan detail batik</li>
<li><strong>Batik Fusion:</strong> Kombinasi batik dengan kain lain</li>
</ul>

<h3>Tips Fashion Styling</h3>
<ol>
<li>Mix and match batik dengan denim untuk casual look</li>
<li>Pakai batik sebagai statement piece, bukan full set</li>
<li>Pilih warna batik yang sesuai dengan skin tone</li>
<li>Eksperimen dengan layering dan accessories</li>
</ol>

<h3>Brand Batik Modern Indonesia</h3>
<p>Banyak desainer muda Indonesia yang mengangkat batik dengan cara fresh dan kekinian. Jadilah bagian dari gerakan batik modern!</p>',
            'order' => 3,
            'duration' => 20
        ]);

        $this->command->info('Training courses and lessons seeded successfully!');
        $this->command->info('Created 3 courses (Dasar, Menengah, Lanjutan) with 10 lessons total.');
    }
}
