import type { LegalDoc, FaqItem } from "@/data/extended-types";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: "privacy",
    title: "Kebijakan Privasi",
    updated: "1 December 2025",
    intro:
      "GUNARA CORPORATION ('GUNARA'), beralamat di Perumahan Arjamukti Kencana Raya Blok B7 No. 2, Leuwisari, Arjasari, Kab. Tasikmalaya, Jawa Barat, menghormati dan melindungi setiap data pribadi yang Anda percayakan. Kebijakan ini — disusun sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik sebagaimana telah diubah dengan Undang-Undang Nomor 19 Tahun 2016 (UU ITE), serta Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik (PP PSTE) — menjelaskan dengan bahasa lugas data apa yang kami kumpulkan, untuk apa, dan seberapa jauh kami menjaganya.",
    sections: [
      {
        heading: "Data yang Kami Kumpulkan",
        text: [
          "Ketika Anda menyampaikan penugasan melalui formulir kontak kami, kami mengumpulkan informasi yang Anda pilih untuk berikan: nama, surel (email), organisasi, skala penugasan, dan isi singkatnya. Ketika Anda berlangganan Oracle Dispatch, kami mengumpulkan alamat surel Anda. Itulah daftar lengkapnya.",
          "Kami tidak membeli, memperdagangkan, memperkaya, atau memanen data pribadi dari pihak ketiga. Dossier Anda adalah apa yang Anda tulis — tidak lebih.",
        ],
      },
      {
        heading: "Penggunaan Data",
        text: [
          "Brief kontak dibaca oleh Partner-in-Chief yang ditugaskan atas permintaan Anda dan oleh Kantor Pimpinan Pusat. Alamat langganan digunakan semata-mata untuk mengirimkan Oracle Dispatch. Kami tidak menjual, menyewakan, atau membagikan data pribadi kepada siapa pun, kapan pun — bukan demi uang, bukan demi budi, bukan demi antusiasme.",
          "Pemrosesan data pribadi didasarkan pada persetujuan Anda dan/atau pelaksanaan kewajiban perjanjian, sebagaimana diatur dalam Pasal 20 UU PDP. Anda dapat menarik persetujuan tersebut sewaktu-waktu melalui saluran yang kami sediakan.",
        ],
      },
      {
        heading: "Penyimpanan dan Keamanan",
        text: [
          "Catatan penugasan disimpan dalam repositori terenkripsi dengan kontrol akses kelas kedaulatan, di dalam sistem elektronik yang kami selenggarakan sesuai kewajiban PP PSTE. Akses dicatat (log), dijalankan dengan kontrol ganda, dan diaudit oleh praktik Forensic Audit kami.",
          "Brief dapat disimpan sebagai sejarah penugasan teranonimkan — tanpa identitas — untuk memperkuat memori kolektif firma. Retensi data tidak melebihi periode yang diperlukan sesuai maksud pemrosesan dan kewajiban hukum kami.",
        ],
      },
      {
        heading: "Hak Anda",
        text: [
          "Sesuai UU PDP, Anda berhak mengakses, menyalin, memperbaiki, membatasi pemrosesan, dan menghapus data pribadi Anda, serta mengajukan keberatan dan menuntut ganti rugi sesuai ketentuan yang berlaku. Ajukan permohonan dengan surel ke halo@topkonsultan.web.id atau surat resmi ke alamat kantor kami.",
          "Permohonan penghapusan kami laksanakan paling lambat 30 hari dan kami konfirmasikan secara tertulis; tanggapan awal atas setiap keluhan Anda wajib kami sampaikan dalam 3×24 jam.",
        ],
      },
      {
        heading: "Dasar Hukum dan Yurisdiksi",
        text: [
          "Kebijakan ini tunduk pada hukum Republik Indonesia. Sengketa diselesaikan terlebih dahulu melalui musyawarah, dan bila tidak tercapai, melalui Pengadilan Negeri Jakarta Selatan. Sampai hari ini, belum ada yang sampai ke sana.",
        ],
      },
    ],
  },
  {
    id: "terms",
    title: "Syarat & Ketentuan",
    updated: "1 December 2025",
    intro:
      "Perjanjian kerja antara Anda dan GUNARA CORPORATION ('GUNARA') dalam menggunakan situs dan layanan digital kami. Ringkas, jujur, dan mengikat secara lahir maupun batin.",
    sections: [
      {
        heading: "Hukum 48 Jam",
        text: [
          "Setiap brief yang disampaikan dengan benar menerima wawasan substantif pertama dalam 48 jam sejak kami mengakuinya. Ini bukan janji jawaban akhir; ini jaminan bahwa dewan telah berkumpul dan sesuatu yang benar sudah bergerak.",
          "Jika kami melewatkannya, fase diagnostik penugasan menjadi tanggungan kami. Dalam 12.000+ penugasan, kami telah melewatinya tiga kali. Kami mengingat ketiganya.",
        ],
      },
      {
        heading: "Status Situs Ini",
        text: [
          "Halaman publik — termasuk Oracle — menyediakan kecerdasan umum, bukan penugasan klien. Tidak ada materi di sini yang merupakan nasihat fidusiaria, hukum, medis, atau investasi hingga mandat ditandatangani kedua belah pihak secara resmi.",
          "Situs ini merupakan sistem elektronik yang kami selenggarakan dengan itikad baik sesuai UU ITE dan PP PSTE. Kami berhak membatasi atau menghentikan akses atas penyalahgunaan sesuai ketentuan peraturan perundang-undangan.",
        ],
      },
      {
        heading: "Penggunaan yang Diperbolehkan",
        text: [
          "Anda tidak diperkenankan menyelidiki, mengikis (scrape) secara masif, mengganggu, atau menyamar di hadapan situs ini maupun Oracle. Percobaan mengambil informasi klien yang bersifat rahasia akan dijawab oleh tim Cyber Defense kami — secara profesional, dan tuntas. Tindakan sebagaimana dimaksud Pasal 27–30 UU ITE dapat kami lanjutkan secara hukum.",
        ],
      },
      {
        heading: "Kekayaan Intelektual",
        text: [
          "Nama GUNARA, monogram Gerbang GUNARA, kanon 46 Dewan Pakar, serta seluruh insight yang kami terbitkan tetap menjadi milik GUNARA CORPORATION. Anda boleh mengutip dengan atribusi; Anda tidak boleh mengaku kecerdasan kami sebagai milik Anda.",
        ],
      },
      {
        heading: "Penugasan Resmi",
        text: [
          "Penugasan formal diatur oleh surat mandat terpisah yang ditandatangani oleh Partner-in-Chief dan pihak berwenang dari organisasi Anda. Apabila halaman ini dan surat mandat berbeda, surat mandat yang berlaku.",
        ],
      },
      {
        heading: "Penagihan & Pembayaran",
        text: [
          "Seluruh penawaran, invoice, dan penagihan biaya jasa diterbitkan atas nama Senior Konsultan, Tn. H. Gugun Gunara, MBA — satu pintu pertanggungjawaban penuh, tanpa perantara. Pembayaran hanya sah ke rekening yang tercantum pada invoice resmi yang diterbitkan langsung oleh beliau atau tim penagihan yang ditunjuk.",
          "Apabila Anda menerima permintaan pembayaran yang tidak sesuai ketentuan ini, hentikan transaksi dan konfirmasikan melalui WhatsApp resmi kami sebelum melanjutkan. GUNARA CORPORATION tidak bertanggung jawab atas pembayaran yang dilakukan di luar kanal resmi tersebut.",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "Kebijakan Cookie",
    updated: "1 December 2025",
    intro:
      "Kami berpegang pada doktrin dapur terang: cookie kami memberi makan kami, bukan pengiklan. Inilah menu lengkapnya.",
    sections: [
      {
        heading: "Kebenaran Utuh",
        text: [
          "Situs ini tidak memasang cookie iklan, pelacak lintas situs, skrip fingerprinting, maupun piksel pihak ketiga. Tidak ada yang perlu Anda tolak, karena tidak ada yang perlu ditolak.",
        ],
      },
      {
        heading: "Yang Mungkin Ada",
        text: [
          "Mekanisme sesi yang semata fungsional dapat digunakan untuk mengingat posisi gulir dan preferensi antarmuka Anda selama satu kunjungan. Ia lenyap ketika kunjungan berakhir. Peramban Anda juga menyimpan pilihan tema kami — di perangkat Anda, untuk kenyamanan Anda, tanpa kami baca.",
          "Sebagai sistem elektronik, kami menerapkan pengelolaan cookie ini sejalan dengan kewajiban perlindungan data pribadi menurut UU PDP dan prinsip kehati-hatian UU ITE.",
        ],
      },
      {
        heading: "Pertanyaan",
        text: [
          "Tulislah ke halo@topkonsultan.web.id atau kunjungi kami di Perumahan Arjamukti Kencana Raya Blok B7 No. 2, Leuwisari, Arjasari, Kab. Tasikmalaya, Jawa Barat. Kami menjawab dengan bahasa lugas, biasanya dalam satu hari kerja.",
        ],
      },
    ],
  },
];

export const FAQS: FaqItem[] = [
  {
    q: "Apa sebenarnya GUNARA CORPORATION?",
    a: "Satu firma, 46 Dewan Pakar — strategi, AI, energi, modal, kota, longevity, dan lainnya — masing-masing membawa 150 tahun penguasaan terdistilasi. Di tempat firma lain menyerahkan slide, kami menyerahkan lintasan: satu Partner-in-Chief, satu jawaban menyeluruh, dari strategi hulu hingga eksekusi hilir — termasuk Gerbang Perizinan dengan katalog 36 izin terlengkap di dunia.",
  },
  {
    q: "Bagaimana mungkin satu dewan memiliki 150 tahun pengalaman?",
    a: "Dewan tidak mengakumulasi — dewan mendistilasi. Setiap dewan adalah silsilah yang hidup: metode, war-game, post-mortem, dan penilaian yang diwariskan dari guru ke murid sejak GUNARA didirikan di Jakarta pada 2001. Anda dilayani para ahli hari ini yang membawa 150 tahun kerajinan matang — bukan ingatan satu orang.",
  },
  {
    q: "Apa itu wawasan pertama 48 jam?",
    a: "Sampaikan sebuah brief dan dewan yang relevan berkumpul dalam hitungan jam. Dalam 48 jam Anda menerima wawasan pertama yang substantif dan spesifik — arah terobosan yang sesungguhnya, bukan sekadar ucapan terima kasih. Jika terlewat, fase diagnostik menjadi tanggungan kami.",
  },
  {
    q: "Bagaimana skema harga bekerja?",
    a: "Penugasan menyesuaikan ambisi — dari sprint dewan yang terfokus hingga mandat kedaulatan multi-tahun. Sebagian besar klien memulai dari diagnostik berbiaya tetap yang berkonversi menjadi mandat. Bawa brief Anda; percakapan pertama dan wawasan 48 jam hanya menelan kejujuran.",
  },
  {
    q: "Seberapa serius Anda menjaga kerahasiaan?",
    a: "Apa yang dibicarakan di ruang dewan tidak pernah keluar dari sana. Enkripsi kelas kedaulatan, akses berkontrol ganda, dan budaya audit forensik. Kerahasiaan kami ditegakkan sejak brief pertama — raja dan republik bercerita kepada kami hal yang tidak mereka sampaikan kepada kabinetnya sendiri.",
  },
  {
    q: "Apakah Anda bekerja jarak jauh atau hanya tatap muka?",
    a: "Keduanya. Dewan berkumpul lintas sepuluh hub global — Jakarta, Singapore, Tokyo, Seoul, Sydney, Dubai, London, Frankfurt, New York, San Francisco — dengan liputan follow-the-sun, dan Oracle menjawab dari mana pun di Bumi. Ketika mandat layak dihidupkan dengan upacara, kami datang ke Anda.",
  },
  {
    q: "Industri apa saja yang Anda layani?",
    a: "Dua belas industri secara penuh — keuangan & fintech, teknologi & SaaS, energi, kesehatan, ritel & e-commerce, manufaktur, infrastruktur & kota, pemerintahan & publik, media & hiburan, logistik & transportasi, pangan & agri, antariksa & teknologi frontier — dengan 46 Dewan Pakar menjangkau setiap disiplin di antaranya.",
  },
  {
    q: "Bagaimana cara memulai?",
    a: "Sampaikan brief Anda melalui formulir penugasan, tulislah ke halo@topkonsultan.web.id, atau mintalah orientasi kepada Oracle. Seorang Partner-in-Chief merespons dalam 48 jam dengan wawasan pertama dan usulan penghimpunan dewan.",
  },
  {
    q: "Apa itu Oracle?",
    a: "Oracle adalah suara publik 46 Dewan Pakar — instrumen AI yang dijejali doktrin firma. Tanyakan apa pun untuk mencicipi penilaian yang menyeluruh. Untuk mandat, dewan penuh tetap berkumpul dengan cara klasik: tanpa ampun, dan secara personal.",
  },
  {
    q: "Saya ingin bergabung. Bagaimana caranya?",
    a: "Kunjungi halaman Karier untuk mandat yang terbuka — dari Jalur Partner hingga Kantor Pimpinan Pusat. Yang kami hargai: penguasaan terverifikasi, selera kebenaran di atas kenyamanan, dan disiplin untuk melayani satu jawaban.",
  },
];
