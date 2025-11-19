<?php

namespace Database\Seeders;

use App\Models\Motif;
use Faker\Guesser\Name;
use Illuminate\Database\Seeder;

class MotifSeeder extends Seeder
{
    public function run(): void
    {
        $motifs = []
            // [
            //     'name' => 'Batik Parang Barong',
            //     'description' => 'Motif klasik dengan makna kekuatan dan keteguhan, biasa digunakan dalam upacara adat.',
            //     'category' => 'Tradisional',
            //     'location' => 'Yogyakarta',
            //     'image_url' => '/images/motifs/1.svg',
            //     'file_path' => '/images/motifs/1.svg',
            //     'colors' => ['#8B4513', '#D2691E', '#F4A460'],
            //     'is_featured' => true,
            // ],
            // [
            //     'name' => 'Batik Kawung Prabu',
            //     'description' => 'Simbolisasi kesempurnaan hidup dengan pola geometris yang harmonis dan elegan.',
            //     'category' => 'Tradisional',
            //     'location' => 'Solo',
            //     'image_url' => '/images/motifs/2.svg',
            //     'file_path' => '/images/motifs/2.svg',
            //     'colors' => ['#654321', '#A0522D', '#DEB887'],
            // ],
            // [
            //     'name' => 'Batik Mega Mendung',
            //     'description' => 'Motif awan yang melambangkan kesabaran dan ketenangan jiwa.',
            //     'category' => 'Nusantara',
            //     'location' => 'Cirebon',
            //     'image_url' => '/images/motifs/3.svg',
            //     'file_path' => '/images/motifs/3.svg',
            //     'colors' => ['#1E40AF', '#3B82F6', '#DBEAFE'],
            //     'is_featured' => true,
            // ],
            // [
            //     'name' => 'Batik Truntum Garuda',
            //     'description' => 'Motif yang melambangkan cinta kasih yang tumbuh kembali, cocok untuk acara sakral.',
            //     'category' => 'Tradisional',
            //     'location' => 'Yogyakarta',
            //     'image_url' => '/images/motifs/4.svg',
            //     'file_path' => '/images/motifs/4.svg',
            //     'colors' => ['#DC2626', '#F59E0B', '#FEF3C7'],
            // ],
            // [
            //     'name' => 'Batik Fractal Genesis',
            //     'description' => 'Perpaduan motif tradisional dengan pola fractal modern yang memukau.',
            //     'category' => 'Modern',
            //     'location' => 'Jakarta',
            //     'image_url' => '/images/motifs/5.svg',
            //     'file_path' => '/images/motifs/5.svg',
            //     'colors' => ['#7C3AED', '#A855F7', '#E0E7FF'],
            // ],
            // [
            //     'name' => 'Batik Sido Luhur',
            //     'description' => 'Motif yang melambangkan kehormatan dan kemuliaan hidup.',
            //     'category' => 'Tradisional',
            //     'location' => 'Solo',
            //     'image_url' => '/images/motifs/6.svg',
            //     'file_path' => '/images/motifs/6.svg',
            //     'colors' => ['#059669', '#10B981', '#D1FAE5'],
            // ],
            // [
            //     'name' => 'Batik Urban Jungle',
            //     'description' => 'Interpretasi modern dari motif flora dengan sentuhan kontemporer yang segar.',
            //     'category' => 'Kontemporer',
            //     'location' => 'Bandung',
            //     'image_url' => '/images/motifs/7.svg',
            //     'file_path' => '/images/motifs/7.svg',
            //     'colors' => ['#16A34A', '#22C55E', '#BBFBCE'],
            // ],
            // [
            //     'name' => 'Batik Pekalongan Coastal',
            //     'description' => 'Motif khas pesisir dengan warna-warna cerah yang mencerminkan kehidupan laut.',
            //     'category' => 'Nusantara',
            //     'location' => 'Pekalongan',
            //     'image_url' => '/images/motifs/8.svg',
            //     'file_path' => '/images/motifs/8.svg',
            //     'colors' => ['#0EA5E9', '#38BDF8', '#E0F2FE'],
            // ],
            // [
            //     'name' => 'Batik Modern Flora',
            //     'description' => 'Perpaduan motif flora dengan pola yang modern dan segar.',
            //     'category' => 'Kontemporer',
            //     'location' => 'Jakarta',
            //     'image_url' => '/images/motifs/9.svg',
            //     'file_path' => '/images/motifs/9.svg',
            //     'colors' => ['#F472B6', '#EC4899', '#FF7F9C'],
            // ],
            // [
            //     'name' => 'Batik Lereng',
            //     'description' => 'Motif yang terinspirasi dari lereng gunung dengan pola yang dinamis dan berlapis.',
            //     'category' => 'Tradisional',
            //     'location' => 'Malang',
            //     'image_url' => '/images/motifs/10.svg',
            //     'file_path' => '/images/motifs/10.svg',
            //     'colors' => ['#FBBF24', '#F59E0B', '#FEF3C7'],
            // ],
            // [
            //     'name' => 'Batik Ombak',
            //     'description' => 'Motif ombak yang melambangkan ketenangan dan kedamaian, cocok untuk pakaian santai.',
            //     'category' => 'Nusantara',
            //     'location' => 'Bali',
            //     'image_url' => '/images/motifs/11.svg',
            //     'file_path' => '/images/motifs/11.svg',
            //     'colors' => ['#2563EB', '#3B82F6', '#DBEAFE'],
            // ],
            // [
            //     'name' => 'Batik Geometris',
            //     'description' => 'Motif geometris yang modern dengan kombinasi warna yang berani.',
            //     'category' => 'Kontemporer',
            //     'location' => 'Jakarta',
            //     'image_url' => '/images/motifs/12.svg',
            //     'file_path' => '/images/motifs/12.svg',
            //     'colors' => ['#8B5CF6', '#A78BFA', '#E0D7FF'],
            // ],
            // [
            //     'name' => 'Batik Bunga Kamboja',
            //     'description' => 'Motif bunga kamboja yang melambangkan keindahan dan kesegaran, cocok untuk pakaian musim panas.',
            //     'category' => 'Nusantara',
            //     'location' => 'Bali',
            //     'image_url' => '/images/motifs/13.svg',
            //     'file_path' => '/images/motifs/13.svg',
            //     'colors' => ['#FBBF24', '#F59E0B', '#FEF3C7'],
            // ],
            // [
            //     'name' => 'Batik Anggrek',
            //     'description' => 'Motif anggrek yang elegan dan anggun, cocok untuk acara formal.',
            //     'category' => 'Tradisional',
            //     'location' => 'Jakarta',
            //     'image_url' => '/images/motifs/14.svg',
            //     'file_path' => '/images/motifs/14.svg',
            //     'colors' => ['#A78BFA', '#C4B5FD', '#EDE9FE'],
            // ],
            // [
            //     'name' => 'Batik Ombak Biru',
            //     'description' => 'Motif ombak dengan nuansa biru yang menenangkan, cocok untuk pakaian santai.',
            //     'category' => 'Nusantara',
            //     'location' => 'Bali',
            //     'image_url' => '/images/motifs/15.svg',
            //     'file_path' => '/images/motifs/15.svg',
            //     'colors' => ['#2563EB', '#3B82F6', '#DBEAFE'],
            // ],
            // [
            //     'name' => 'Batik Daun Tropis',
            //     'description' => 'Motif daun tropis yang segar dan ceria, cocok untuk pakaian musim panas.',
            //     'category' => 'Kontemporer',
            //     'location' => 'Jakarta',
            //     'image_url' => '/images/motifs/16.svg',
            //     'file_path' => '/images/motifs/16.svg',
            //     'colors' => ['#16A34A', '#22C55E', '#BBFBCE'],
            // ],
            // [
            //     'name' => 'Batik Kupu-Kupu',
            //     'description' => 'Motif kupu-kupu yang indah dan anggun, melambangkan keindahan dan transformasi.',
            //     'category' => 'Tradisional',
            //     'location' => 'Yogyakarta',
            //     'image_url' => '/images/motifs/17.svg',
            //     'file_path' => '/images/motifs/17.svg',
            //     'colors' => ['#F472B6', '#EC4899', '#FF7F9C'],
            // ],
            // [
            //     'name' => 'Batik Bunga Matahari',
            //     'description' => 'Motif bunga matahari yang ceria dan penuh semangat, cocok untuk pakaian santai.',
            //     'category' => 'Nusantara',
            //     'location' => 'Bali',
            //     'image_url' => '/images/motifs/18.svg',
            //     'file_path' => '/images/motifs/18.svg',
            //     'colors' => ['#FBBF24', '#F59E0B', '#FEF3C7'],
            // ],
            // [
            //     'name' => 'Batik Geometris Modern',
            //     'description' => 'Motif geometris yang modern dengan kombinasi warna yang berani.',
            //     'category' => 'Kontemporer',
            //     'location' => 'Jakarta',
            //     'image_url' => '/images/motifs/19.svg',
            //     'file_path' => '/images/motifs/19.svg',
            //     'colors' => ['#8B5CF6', '#A78BFA', '#E0D7FF'],
            // ],
            // [
            //     'name' => 'Batik Bunga Melati',
            //     'description' => 'Motif bunga melati yang harum dan anggun, melambangkan kesucian dan keindahan.',
            //     'category' => 'Tradisional',
            //     'location' => 'Yogyakarta',
            //     'image_url' => '/images/motifs/20.svg',
            //     'file_path' => '/images/motifs/20.svg',
            //     'colors' => ['#F472B6', '#EC4899', '#FF7F9C'],
            // ],
            // [
            //     'name' => 'Batik Ombak Hijau',
            //     'description' => 'Motif ombak dengan nuansa hijau yang menenangkan, cocok untuk pakaian santai.',
            //     'category' => 'Nusantara',
            //     'location' => 'Bali',
            //     'image_url' => '/images/motifs/21.svg',
            //     'file_path' => '/images/motifs/21.svg',
            //     'colors' => ['#16A34A', '#22C55E', '#BBFBCE'],
            // ],
            // [
            //     'name' => 'Batik Daun Hutan',
            //     'description' => 'Motif daun hutan yang segar dan alami, cocok untuk pakaian musim panas.',
            //     'category' => 'Kontemporer',
            //     'location' => 'Jakarta',
            //     'image_url' => '/images/motifs/22.svg',
            //     'file_path' => '/images/motifs/22.svg',
            //     'colors' => ['#1E3A8A', '#3B82F6', '#DBEAFE'],
            // ],
        [   
                'name' => 'Batik Sidomukti',
                'description' => '"Sido" berarti jadi atau terlaksana, dan "mukti" berarti mulia dan sejahtera. Jadi, motif ini mengandung harapan agar pemakainya mendapatkan kebahagiaan dan kemakmuran. ',
                'category' => 'Classic',
                'location' => 'Solo',
                'image_url' => '/images/motifs/sidomukti.svg',
                'file_path' => '/images/motifs/sidomukti.svg',
                'colors' => ['#1E3A8A', '#3B82F6', '#DBEAFE']
            ],
            [
                'name' => 'Batik Tujuh Rupa',
                'description' => 'Motif yang berasal dari Pekalongan ini melambangkan keberagaman hayati dan budaya di Indonesia, dengan berbagai elemen flora dan fauna yang digabungkan dalam satu desain.',
                'category' => 'Classic',
                'location' => 'Pekalongan',
                'image_url' => '/images/motifs/tujuh_rupa.svg',
                'file_path' => '/images/motifs/tujuh_rupa.svg',
                'colors' => ['#059669', '#10B981', '#D1FAE5']
            ],
            [
                'name' => 'Batik Singa Barong',
                'description' => 'Motif yang menggambarkan sosok singa barong sebagai simbol kekuatan dan keberanian, sering digunakan dalam upacara adat untuk melindungi dari roh jahat.',
                'category' => 'Spiritual',
                'location' => 'Bali',
                'image_url' => '/images/motifs/singa_barong.svg',
                'file_path' => '/images/motifs/singa_barong.svg',
                'colors' => ['#DC2626', '#F59E0B', '#FEF3C7']
            ],
            [
                'name' => 'Batik Sogan',
                'description' => 'Motif batik yang menggunakan warna coklat tua (sogan) sebagai warna dasar, melambangkan kesederhanaan dan keanggunan, sering dipakai dalam acara resmi dan upacara adat.',
                'category' => 'Traditional',
                'location' => 'Solo',
                'image_url' => '/images/motifs/sogan.svg',
                'file_path' => '/images/motifs/sogan.svg',
                'colors' => ['#8B4513', '#D2691E', '#F4A460']
            ],
            [
                'name' => 'Batik Lasem',
                'description' => 'Motif batik yang berasal dari Lasem, Jawa Tengah, dikenal dengan warna merah dan biru yang mencolok, melambangkan keberanian dan keindahan.',
                'category' => 'Cultural',
                'location' => 'Lasem',
                'image_url' => '/images/motifs/lasem.svg',
                'file_path' => '/images/motifs/lasem.svg',
                'colors' => ['#B91C1C', '#2563EB', '#DBEAFE']
            ],
            [
                'name' => 'Batik Sentani',
                'description' => 'Motif batik yang terinspirasi dari seni dan budaya masyarakat Sentani di Papua, menampilkan pola geometris dan simbol-simbol tradisional yang kaya makna.',
                'category' => 'Cultural',
                'location' => 'Papua',
                'image_url' => '/images/motifs/sentani.svg',
                'file_path' => '/images/motifs/sentani.svg',
                'colors' => ['#065F46', '#10B981', '#D1FAE5']   
            ],
            [
                'name' => 'Batik Ulamsari',
                'description' => 'Batik Ulamsari Mas menunjukkan macam-macam motif batik ini dengan gambar ikan dan udang yang mewakili mata pencaharian masyarakat Bali, yaitu nelayan. Motif batik Bali Ulamsari Mas bermakna kesejahteraan dan kemakmuran masyarakat yang hidup di daerah pesisir pantai.',
                'category' => 'Traditional',
                'location' => 'Bali',
                'image_url' => '/images/motifs/ulamsari.svg',
                'file_path' => '/images/motifs/ulamsari.svg',
                'colors' => ['#065F46', '#10B981', '#D1FAE5']
            ], 
            [
                'name' => 'Batik Keraton',
                'description' => 'Motif dari batik ini kental dengan nuansa bunga dan burung atau disebut juga satwa liar. Batik Keraton melambangkan kebijaksanaan, kharisma, dan kearifan raja-raja Jawa.',
                'category' => 'Floral',
                'location' => 'Yogyakarta',
                'image_url' => '/images/motifs/keraton.svg',
                'file_path' => '/images/motifs/keraton.svg',
                'colors' => ['#8B4513', '#D2691E', '#F4A460']
            ],
            [
                'name' => 'Batik Jagatan Pisang',
                'description' => 'Jagatan Pisang atau Batik Pisan merupakan macam-macam motif batik berupa pisang Bali. Batik ini biasa diberikan seorang kekasih pada kekasihnya yang akan berpergian jauh dengan maksud agar sang kekasih kembali lagi. Batik pisan melambangkan harapan, doa, dan keselamatan.',
                'category' => 'Symbolic',
                'location' => 'Bali',
                'image_url' => '/images/motifs/jagatan_pisang.svg',
                'file_path' => '/images/motifs/jagatan_pisang.svg',
                'colors' => ['#FBBF24', '#F59E0B', '#FEF3C7']   
            ], 
            [
                'name' => 'Batik Parang Kusumo',
                'description' => 'Batik asal Kota Solo ini merupakan macam-macam motif batik yang klasik, yaitu menyerupai ombak lautan. Di sini, ombak mempunyai sifat kuat yang selalu menghantam tebing dan karang di lautan.Macam-macam motif batik ini dapat menggambarkan analogi sebuah kehidupan yang harus dijalani dengan penuh udaha dan perjuangan.',
                'category' => 'Classic',
                'location' => 'Solo',
                'image_url' => '/images/motifs/parang_kusumo.svg',
                'file_path' => '/images/motifs/parang_kusumo.svg',
                'colors' => ['#1E3A8A', '#3B82F6', '#DBEAFE']
            ],
            [
                'name' => 'Batik Sekar Jagad',
                'description' => 'Motif batik yang melambangkan keindahan alam semesta dengan berbagai bunga dan tumbuhan yang bermekaran, mencerminkan keragaman hayati Indonesia.',
                'category' => 'Floral',
                'location' => 'Yogyakarta', 
                'image_url' => '/images/motifs/sekar_jagad.svg',
                'file_path' => '/images/motifs/sekar_jagad.svg',
                'colors' => ['#8B4513', '#D2691E', '#F4A460']
            ],
            [
                'name' => 'Batik Gentongan',
                'description' => 'Batik Madura ini cukup berbeda dengan macam-macam motif batik lainnya. Motif abstrak sederhana yang digunakan pada batik inilah yang membuatnya berbeda. Batik Gentongan pada mulanya diambil dari kata gentong yang berarti wadah dimana kain batik dicelupkan ke dalam warna.',
                'category' => 'Abstract',
                'location' => 'Madura',
                'image_url' => '/images/motifs/gentongan.svg',
                'file_path' => '/images/motifs/gentongan.svg',
                'colors' => ['#FBBF24', '#F59E0B', '#FEF3C7']   
            ],
            [
                'name' => 'Batik Garutan',
                'description' => 'Ciri khas macam-macam motif batik garutan adalah bentuk geometris dan flora fauna. Bentuk geometris umumnya mengarah ke garis diagonal dan bentuk kawung atau belah ketupat. Warnanya didominasi oleh warna krem dipadukan dengan warna-warna cerah.',
                'location' => 'Garut',
                'image_url' => '/images/motifs/garutan.svg',
                'file_path' => '/images/motifs/garutan.svg',
                'colors' => ['#654321', '#A0522D', '#DEB887'],
                'category' => 'Geometric',
            ],
            [
                'name' => 'Batik Tubo',
                'description' => 'Ciri khas dari macam-macam motif batik Tubo, Ternate ini adalah adanya cengkeh, pala, peta Maluku Utara, kelapa, ikan dan karang serta kehidupan yang ada di Indonesia bagian Timur. Tubo Ternate juga punya warna cerah seperti hijau, merah, orange, kuning dan sebagainya.',
                'category' => 'Cultural',
                'location' => 'Ternate',
                'image_url' => '/images/motifs/tubo.svg',
                'file_path' => '/images/motifs/tubo.svg',
                'colors' => ['#DC2626', '#F59E0B', '#FEF3C7']
            ],
            [
                'name' => 'Batik Priyangan',
                'description' => 'Motif batik yang berasal dari daerah Tasikmalaya ini menampilkan corak yang rapat, rapi, dan berkelas. Motif batik priyangan biasanya terinspirasi dari tumbuhan. Warna cerah macam-macam motif batik yang kalem memberi kesan kesederhanaan, terbuka, dan pluralis. ',
                'category' => 'Floral',
                'location' => 'Tasikmalaya',
                'image_url' => '/images/motifs/priyangan.svg',
                'file_path' => '/images/motifs/priyangan.svg',
                'colors' => ['#FF0000', '#FFA500', '#FFFF00']
            ]
        ];

        foreach ($motifs as $motif) {
            Motif::create($motif);
        }
    }
}