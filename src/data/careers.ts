import { Award, Globe2, BrainCircuit, GraduationCap, HeartPulse, Infinity as InfinityIcon } from "lucide-react";
import type { Role, Perk } from "@/data/extended-types";

export const ROLES: Role[] = [
  {
    id: "partner-track-strategy",
    title: "Jalur Partner — Strategi & Transformasi",
    enTitle: "Partner Track — Strategy & Transformation",
    team: "Strategi & Transformasi",
    location: "Jakarta",
    type: "Penuh Waktu",
    level: "Partner",
    description:
      "Kenaikan tercepat di firma. Anda akan memimpin penugasan sebagai Partner-in-Chief sejak bulan pertama, dilindungi bobot penuh 46 Dewan Pakar — dan dinilai dari hasil, bukan dari jam.",
    requirements: [
      "15+ tahun memimpin transformasi dengan dampak P&L terverifikasi",
      "Fasih berkonfrontasi di level dewan direksi — bukti di atas kenyamanan",
      "Satu rekam jejak langkah penciptaan pasar yang Anda rancang sendiri",
      "Jangkauan kerja multibahasa; kedudukan Jakarta dengan perjalanan global",
      "Referensi tak tercela sesuai protokol kerahasiaan firma",
    ],
  },
  {
    id: "principal-ai-data",
    title: "Principal — AI & Kecerdasan Data",
    enTitle: "Principal — AI & Data Intelligence",
    team: "Teknologi & AI",
    location: "Singapore",
    type: "Penuh Waktu",
    level: "Principal",
    description:
      "Berdiri di tengah kerja klien Dewan Artificial General Intelligence: audit alignment, sistem kecerdasan keputusan, dan deployment LLM yang selamat bersentuhan dengan regulator.",
    requirements: [
      "10+ tahun mengoperasikan sistem ML ke produksi skala besar",
      "Rigor mendalam dalam evaluasi, red-teaming, dan governance",
      "Pengalaman mendampingi CXO pada pergeseran model operasi AI-native",
      "Publikasi atau paten menjadi nilai tambah; paranoia akan risiko model itu wajib",
      "Berbasis Singapore atau Jakarta, penyerahan follow-the-sun",
    ],
  },
  {
    id: "engagement-manager-sovereign",
    title: "Manajer Penugasan — Penasihat Kebijakan Nasional",
    enTitle: "Engagement Manager — Sovereign Advisory",
    team: "Kedaulatan & Negara",
    location: "Jakarta",
    type: "Penuh Waktu",
    level: "Manajer",
    description:
      "Program seluruh-negara: arsitektur kebijakan, strukturasi PPP, logistik skala nasional. Anda akan mengoordinasikan dewan dari Food & Agriculture hingga Megacity Planning dalam satu mandat.",
    requirements: [
      "6+ tahun di strategi sektor publik, pembiayaan pembangunan, atau PPP",
      "Fasih Bahasa Indonesia dan Inggris; jejaring pemerintah daerah",
      "Anggun di bawah protokol — Anda akan memberi pengarahan kepada menteri sebelum sarapan",
      "Disiplin lapangan: program dihantarkan, bukan didekorasi slide",
      "Kesediaan tinggal di mana mandatnya berada",
    ],
  },
  {
    id: "senior-fellow-energy",
    title: "Senior Fellow — Energi & Fusi",
    enTitle: "Senior Fellow — Energy & Fusion",
    team: "Sains & Rekayasa",
    location: "Jakarta",
    type: "Penuh Waktu",
    level: "Fellow",
    description:
      "Menasihati pemerintah dan utilitas tentang akhir dari kecemasan baseload: pilot fusi, arsitektur grid, dan realokasi US$2,8T yang kini menggambar ulang arus modal.",
    requirements: [
      "PhD atau penguasaan setara dalam sistem energi, plasma, atau rekayasa grid",
      "Rekam jejak mengarahkan program modal energi sembilan digit",
      "Kemampuan menerjemahkan fisika ke fisika ruang direksi",
      "Pengalaman kawasan Asia Tenggara diutamakan; mandat global dijamin",
      "Nyaman menasihati menteri dan fisikawan dalam satu sore yang sama",
    ],
  },
  {
    id: "cyber-defense-architect",
    title: "Arsitek Pertahanan Siber",
    enTitle: "Cyber Defense Architect",
    team: "Teknologi & AI",
    location: "London",
    type: "Penuh Waktu",
    level: "Senior",
    description:
      "Membangun benteng yang membuat penyerang minta maaf. Anda akan merancang postur pertahanan kelas kedaulatan bagi institusi yang musuhnya tidak pernah tidur.",
    requirements: [
      "8+ tahun keamanan ofensif dan defensif skala enterprise atau negara",
      "Kepemilikan arsitektur lintas cloud, edge, dan estate legasi",
      "Pengalaman komando insiden — tenang adalah kondisi bawaan Anda",
      "Riwayat bersih untuk peninjauan kewenangan (clearance) dan forensik",
      "Berbasis London dengan perjalanan respons cepat",
    ],
  },
  {
    id: "design-director-brand",
    title: "Direktur Desain — Merek & Pengalaman",
    enTitle: "Design Director — Brand & Experience",
    team: "Growth & Merek",
    location: "Jakarta",
    type: "Penuh Waktu",
    level: "Direktur",
    description:
      "Memimpin garis depan estetika firma: imperium merek, pengalaman flagship, dan doktrin visual di balik permintaan yang datang dalam keadaan pre-sold.",
    requirements: [
      "12+ tahun mengarahkan identitas dan pengalaman untuk merek global",
      "Portofolio dengan minimal satu peluncuran pendefinisi kategori",
      "Penguasaan craft dari tipografi hingga desain spasial",
      "Mampu membela selera dengan data, dan membela data dengan selera",
      "Berbasis Jakarta; perjalanan sesi dewan lintas sepuluh hub",
    ],
  },
  {
    id: "talent-alchemist-campus",
    title: "Ahli Talenta — Kampus & Akademi",
    enTitle: "Talent Alchemist — Campus & Academy",
    team: "SDM & Budaya",
    location: "Jakarta",
    type: "Penuh Waktu",
    level: "Lead",
    description:
      "Menjalankan pipeline akademi bagi pikiran-pikiran paling tajam Asia Tenggara — dari scouting kampus hingga magang dewan. Anda membangun para polymath yang akan menjalankan abad berikutnya.",
    requirements: [
      "8+ tahun di pengembangan talenta, pendidikan eksekutif, atau kepemimpinan kampus",
      "Jejaring universitas dan ekosistem Asia Tenggara",
      "Insting desain kurikulum dan standar tanpa kompromi",
      "Bukti orang-orang yang Anda angkat kini menjalankan hal-hal penting",
      "Berbasis Jakarta dengan perjalanan akademi lintas sepuluh hub",
    ],
  },
  {
    id: "chief-of-staff-top",
    title: "Kepala Staf — Kantor Pimpinan Pusat",
    enTitle: "Chief of Staff — Office of the Chair",
    team: "Kantor Pimpinan Pusat",
    location: "Jakarta",
    type: "Penuh Waktu",
    level: "Kepala Staf",
    description:
      "Roda gigi firma. Anda akan menghimpun dewan-dewan, menegakkan hukum 48 jam, dan menjaga instrumen pimpinan tetap selaras sempurna. Diskresi adalah deskripsi pekerjaannya.",
    requirements: [
      "12+ tahun di peran kepala staf, strategi, atau diplomasi",
      "Fasih beroperasi lintas zona waktu, budaya, dan ego",
      "Presisi di bawah upacara — kantor pimpinan memiliki ritual yang berarti",
      "Multibahasa; bahasa Inggris mutlak, bahasa ketiga nilai tambah kuat",
      "Diskresi absolut, terverifikasi, dan seumur hidup",
    ],
  },
];

export const PERKS: Perk[] = [
  {
    icon: Award,
    title: "Kompensasi di luar kurva",
    text: "Gaji decile teratas, multiplier berbasis hasil, dan kemitraan yang mengompaun. Kami membayar putusan, bukan kehadiran.",
  },
  {
    icon: Globe2,
    title: "Sepuluh hub, satu paspor",
    text: "Bekerja dari salah satu sepuluh kedudukan GUNARA di dunia. Firmanya global; karier Anda juga.",
  },
  {
    icon: BrainCircuit,
    title: "Magang dewan pakar",
    text: "Duduk di dalam sesi bersama para guru yang membawa 150 tahun penguasaan terdistilasi di bidangnya. Akselerasi adalah bawaannya.",
  },
  {
    icon: GraduationCap,
    title: "Akademi GUNARA",
    text: "Kurikulum privat — strategi, sains, modal, kedaulatan — diajarkan langsung oleh dewan-dewan. Akses seumur hidup.",
  },
  {
    icon: HeartPulse,
    title: "Dividen longevity",
    text: "Kedokteran longevity concierge dari Dewan Longevity Medicine. Kami berniat membuat orang-orang kami bertahan lebih lama daripada industrinya.",
  },
  {
    icon: InfinityIcon,
    title: "Perpustakaan tak terbatas",
    text: "Arsip playbook, war-game, dan post-mortem lintas 46 dewan — memori kolektif 12.000+ penugasan, dibuka untuk Anda.",
  },
];
