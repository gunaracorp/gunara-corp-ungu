import {
  Activity,
  Apple,
  Atom,
  Blocks,
  Bot,
  Brain,
  BrainCircuit,
  Building2,
  Calculator,
  CloudCog,
  Coins,
  Compass,
  Cpu,
  Crosshair,
  Crown,
  Database,
  DraftingCompass,
  Dna,
  Earth,
  Feather,
  Fingerprint,
  FlaskConical,
  Gauge,
  Gem,
  GraduationCap,
  Globe2,
  HandCoins,
  HeartPulse,
  Hourglass,
  Landmark,
  Leaf,
  Lightbulb,
  LineChart,
  Merge,
  Microscope,
  Orbit,
  Palette,
  Radar,
  Rocket,
  Scale,
  ScanEye,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Satellite,
  Sparkles,
  Telescope,
  TrendingUp,
  Trophy,
  Users,
  Waves,
  Wheat,
  Wind,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------- Tipe ---------------------------------- */

export type CouncilCategory =
  | "Strategi & Kepemimpinan"
  | "Teknologi & AI"
  | "Sains & Rekayasa"
  | "Keuangan & Risiko"
  | "Masyarakat & Tata Kelola"
  | "Kesehatan & Potensi Manusia";

export interface Council {
  name: string;
  blurb: string;
  category: CouncilCategory;
  icon: LucideIcon;
}

export interface Service {
  num: string;
  title: string;
  /** Render Inggris opsional dari nama praktik (situs bilingual) */
  enName?: string;
  desc: string;
  icon: LucideIcon;
  tags: string[];
}

export interface MethodStep {
  step: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}

export interface ComparisonRow {
  label: string;
  omni: string;
  mck: string;
  goo: string;
  uni: string;
}

export interface CaseStudy {
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
  title: string;
  desc: string;
  tag: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export interface StatItem {
  icon: LucideIcon;
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
  label: string;
  caption: string;
}

/* ----------------------------------- Nav ---------------------------------- */

export const NAV_LINKS = [
  { href: "#about", label: "Tentang" },
  { href: "#services", label: "Layanan" },
  { href: "#councils", label: "46 Dewan Pakar" },
  { href: "#method", label: "Metode" },
  { href: "#results", label: "Hasil" },
];

export const BENCHMARKS = [
  "McKinsey & Company",
  "Boston Consulting Group",
  "Bain & Company",
  "Google",
  "Deloitte",
  "Accenture",
  "PwC",
  "KPMG",
  "EY",
  "Oliver Wyman",
  "Kearney",
  "Roland Berger",
];

/* ---------------------------------- Statistik ------------------------------ */

export const STATS: StatItem[] = [
  {
    icon: Building2,
    value: 1524,
    prefix: "",
    suffix: "",
    decimals: 0,
    label: "Perusahaan Ditangani",
    caption: "Lokal & nasional · global & dalam negeri · daerah & pusat",
  },
  {
    icon: Users,
    value: 46,
    prefix: "",
    suffix: "",
    decimals: 0,
    label: "Dewan Pakar Jenius",
    caption: "Dihadirkan untuk setiap penugasan",
  },
  {
    icon: Hourglass,
    value: 150,
    prefix: "",
    suffix: "",
    decimals: 0,
    label: "Tahun Penguasaan per Dewan",
    caption: "Terdestilasi, bukan sekadar terakumulasi",
  },
  {
    icon: Globe2,
    value: 190,
    prefix: "",
    suffix: "",
    decimals: 0,
    label: "Negara Dilayani",
    caption: "Liputan follow-the-sun, 24/7/365",
  },
  {
    icon: Gauge,
    value: 99.97,
    prefix: "",
    suffix: "%",
    decimals: 2,
    label: "Tingkat Keberhasilan",
    caption: "Dari 12.000+ penugasan",
  },
];

/* ---------------------------------- Tentang -------------------------------- */

export const ABOUT_POINTS = [
  "Satu jawaban terpadu dari 46 disiplin — bukan 46 opini",
  "Cakupan hulu-hilir: tanpa handoff, tanpa celah, tanpa alasan",
  "Partner-in-Chief yang menyandang nama dan bertanggung jawab atas hasil Anda",
  "Fasih di setiap perangkat, setiap zona waktu, setiap skala ambisi",
];

export const ABOUT_CARDS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Brain,
    title: "Skala Kognitif",
    desc: "6.900 tahun gabungan merenungkan satu pertanyaan Anda.",
  },
  {
    icon: Zap,
    title: "Kecepatan",
    desc: "Terobosan pertama dalam 48 jam — setiap saat.",
  },
  {
    icon: Crosshair,
    title: "Presisi",
    desc: "99,97% keberhasilan dari 12.000+ penugasan.",
  },
  {
    icon: ShieldCheck,
    title: "Kedaulatan",
    desc: "Rahasia Anda tak pernah keluar dari kedaulatan Anda.",
  },
];

/* --------------------------------- Layanan --------------------------------- */

export const SERVICES: Service[] = [
  {
    num: "01",
    title: "Strategi & Transformasi",
    enName: "Strategy & Transformation",
    desc: "Arah yang berani, dieksekusi hingga desimal terakhir.",
    icon: Compass,
    tags: ["Visi", "Roadmap", "Jalur Nilai"],
  },
  {
    num: "02",
    title: "Kecerdasan AI & Data",
    enName: "AI & Data Intelligence",
    desc: "Dari data mentah menuju keputusan yang terasa seperti curang.",
    icon: BrainCircuit,
    tags: ["Sistem ML", "Analitik", "LLM Ops"],
  },
  {
    num: "03",
    title: "Teknologi & Rekayasa",
    enName: "Technology & Engineering",
    desc: "Arsitektur dari gagasan hingga hyperscale, setiap perangkat tercakup.",
    icon: Cpu,
    tags: ["Cloud", "Platform", "DevSecOps"],
  },
  {
    num: "04",
    title: "Keuangan & Kapital",
    enName: "Finance & Capital",
    desc: "Strategi kapital yang menggandakan diri saat Anda tidur.",
    icon: LineChart,
    tags: ["M&A", "Treasury", "Penggalangan Dana"],
  },
  {
    num: "05",
    title: "Operasional & Rantai Pasok",
    enName: "Operations & Supply Chain",
    desc: "Arus hulu ke hilir tanpa gesekan.",
    icon: Workflow,
    tags: ["Lean", "Logistik", "S&OP"],
  },
  {
    num: "06",
    title: "Manusia & Budaya",
    enName: "People & Culture",
    desc: "Tim yang melampaui legenda mereka sendiri.",
    icon: Users,
    tags: ["Desain Organisasi", "Talenta", "Kepemimpinan"],
  },
  {
    num: "07",
    title: "Keberlanjutan & ESG",
    enName: "Sustainability & ESG",
    desc: "Laba dengan nurani sebesar planet ini.",
    icon: Leaf,
    tags: ["Net-Zero", "Pelaporan", "Sirkularitas"],
  },
  {
    num: "08",
    title: "Hukum, Risiko & Kepatuhan",
    enName: "Legal, Risk & Compliance",
    desc: "Zirah dari kertas, setajam bilah.",
    icon: Scale,
    tags: ["Tata Kelola", "Kontrak", "Risiko"],
  },
  {
    num: "09",
    title: "Pertumbuhan, Merek & Pengalaman",
    enName: "Growth, Brand & Experience",
    desc: "Permintaan yang datang dalam keadaan sudah terjual.",
    icon: TrendingUp,
    tags: ["Merek", "GTM", "CX"],
  },
  {
    num: "10",
    title: "Inovasi & Venture",
    enName: "Innovation & Ventures",
    desc: "Bisnis baru diinkubasi bak embrio para raksasa.",
    icon: Lightbulb,
    tags: ["Venture", "R&D", "Scaling"],
  },
  {
    num: "11",
    title: "Krisis & Pemulihan",
    enName: "Crisis & Turnaround",
    desc: "Saat segalanya terbakar, kami tiba dalam keadaan basah.",
    icon: ShieldAlert,
    tags: ["Restrukturisasi", "Rencana 90 Hari"],
  },
  {
    num: "12",
    title: "Penasihat Sovereign & Negara",
    enName: "Sovereign & Nation Advisory",
    desc: "Program sekelas bangsa, dituntaskan dari hulu ke hilir.",
    icon: Landmark,
    tags: ["Kebijakan", "PPP", "Nation Branding"],
  },
];

/* ---------------------------------- Dewan ---------------------------------- */

export const COUNCIL_CATEGORIES: CouncilCategory[] = [
  "Strategi & Kepemimpinan",
  "Teknologi & AI",
  "Sains & Rekayasa",
  "Keuangan & Risiko",
  "Masyarakat & Tata Kelola",
  "Kesehatan & Potensi Manusia",
];

export const COUNCILS: Council[] = [
  // Strategi & Kepemimpinan (8)
  { name: "Quantum Strategy", blurb: "Mengadukan setiap langkah Anda di 10.000 masa depan paralel.", category: "Strategi & Kepemimpinan", icon: Compass },
  { name: "Organizational Alchemy", blurb: "Mengubah organisasi kacau menjadi mesin yang menggandakan dirinya sendiri.", category: "Strategi & Kepemimpinan", icon: FlaskConical },
  { name: "M&A & Consolidation", blurb: "Menuntaskan dan mengintegrasikan mega-merger sebelum makan siang.", category: "Strategi & Kepemimpinan", icon: Merge },
  { name: "Market Creation", blurb: "Merancang pasar yang Selasa kemarin belum ada.", category: "Strategi & Kepemimpinan", icon: Rocket },
  { name: "Crisis Command", blurb: "Menstabilkan kapal saat yang lain sibuk berebut kemudi.", category: "Strategi & Kepemimpinan", icon: ShieldAlert },
  { name: "Legacy & Succession", blurb: "Membangun dinasti yang berumur lebih panjang dari pendirinya.", category: "Strategi & Kepemimpinan", icon: Crown },
  { name: "Peak Performance", blurb: "Menyetel tim kepemimpinan bak atlet peraih gelar dunia.", category: "Strategi & Kepemimpinan", icon: Trophy },
  { name: "Future Foresight", blurb: "Membaca dekade berikutnya seperti orang lain membaca berita kemarin.", category: "Strategi & Kepemimpinan", icon: Telescope },
  // Teknologi & AI (8)
  { name: "Artificial General Intelligence", blurb: "Menyelaraskan kejeniusan mesin dengan ambisi manusia.", category: "Teknologi & AI", icon: BrainCircuit },
  { name: "Quantum Computing", blurb: "Mengompilasi masalah tersulit Anda ke dalam qubit.", category: "Teknologi & AI", icon: Atom },
  { name: "Cyber Defense", blurb: "Benteng yang membuat penyerang meminta maaf.", category: "Teknologi & AI", icon: ShieldCheck },
  { name: "Cloud & Edge Architecture", blurb: "Infrastruktur dari hyperscale hingga latensi denyut nadi.", category: "Teknologi & AI", icon: CloudCog },
  { name: "Robotics & Automation", blurb: "Mesin yang melakukan hal mustahil, berulang kali.", category: "Teknologi & AI", icon: Bot },
  { name: "Digital Trust & Blockchain", blurb: "Buku besar yang tak bisa dibantah siapa pun.", category: "Teknologi & AI", icon: Blocks },
  { name: "Data Intelligence", blurb: "Mengubah limbah data menjadi ramalan.", category: "Teknologi & AI", icon: Database },
  { name: "Immersive Realities", blurb: "Membangun dunia yang tersusun anggun di atas dunia ini.", category: "Teknologi & AI", icon: ScanEye },
  // Sains & Rekayasa (8)
  { name: "Advanced Materials", blurb: "Materi, dirancang ulang atom demi atom.", category: "Sains & Rekayasa", icon: Gem },
  { name: "Energy & Fusion", blurb: "Mengetumkan bintang untuk ruang direksi.", category: "Sains & Rekayasa", icon: Zap },
  { name: "Aerospace & Orbital", blurb: "Logistik di atas langit, sungguhan.", category: "Sains & Rekayasa", icon: Satellite },
  { name: "Biotechnology", blurb: "Memrogram kehidupan bak perangkat lunak.", category: "Sains & Rekayasa", icon: Dna },
  { name: "Nanotechnology", blurb: "Pabrik yang lebih kecil dari sel.", category: "Sains & Rekayasa", icon: Microscope },
  { name: "Climate Engineering", blurb: "Menyeimbangkan ulang termostat planet.", category: "Sains & Rekayasa", icon: Wind },
  { name: "Space Resources", blurb: "Menambang langit agar Bumi bisa beristirahat.", category: "Sains & Rekayasa", icon: Orbit },
  { name: "Deep Ocean Systems", blurb: "Memetakan dan menguasai perbatasan terakhir di bawah sana.", category: "Sains & Rekayasa", icon: Waves },
  // Keuangan & Risiko (7)
  { name: "Global Macro", blurb: "Menempatkan Anda di sisi yang benar dari pasang surut sejarah.", category: "Keuangan & Risiko", icon: Globe2 },
  { name: "Sovereign Wealth", blurb: "Mengelola neraca negara-negara.", category: "Keuangan & Risiko", icon: Landmark },
  { name: "Private Capital", blurb: "Menemukan 1% kesepakatan yang layak 99% perhatian.", category: "Keuangan & Risiko", icon: HandCoins },
  { name: "Actuarial Science", blurb: "Menghargai risiko ekor hari esok pada hari ini.", category: "Keuangan & Risiko", icon: Calculator },
  { name: "Forensic Audit", blurb: "Mengikuti uang menembus pintu terkunci.", category: "Keuangan & Risiko", icon: Fingerprint },
  { name: "Wealth Architecture", blurb: "Menggandakan kekayaan lintas generasi.", category: "Keuangan & Risiko", icon: Coins },
  { name: "Geopolitical Risk", blurb: "Membaca perbatasan sebelum berpindah.", category: "Keuangan & Risiko", icon: Crosshair },
  // Masyarakat & Tata Kelola (8)
  { name: "Geopolitics", blurb: "Bernegosiasi di setiap ibukota, dengan fasih.", category: "Masyarakat & Tata Kelola", icon: Earth },
  { name: "Constitutional Design", blurb: "Menyusun aturan yang dijalankan negara.", category: "Masyarakat & Tata Kelola", icon: Scale },
  { name: "Public Policy", blurb: "Mengubah mandat menjadi gerakan.", category: "Masyarakat & Tata Kelola", icon: ScrollText },
  { name: "Megacity Planning", blurb: "Merancang kota untuk miliaran manusia berikutnya.", category: "Masyarakat & Tata Kelola", icon: Building2 },
  { name: "Education Systems", blurb: "Membangun sekolah yang membangun masa depan.", category: "Masyarakat & Tata Kelola", icon: GraduationCap },
  { name: "Food & Agriculture", blurb: "Memberi makan miliaran manusia tanpa merusak planet.", category: "Masyarakat & Tata Kelola", icon: Wheat },
  { name: "Ethics & Philosophy", blurb: "Mengajukan pertanyaan sebelum menjadi krisis.", category: "Masyarakat & Tata Kelola", icon: Lightbulb },
  { name: "Culture & Anthropology", blurb: "Membaca sandi mengapa manusia melakukan apa yang mereka lakukan.", category: "Masyarakat & Tata Kelola", icon: Users },
  // Kesehatan & Potensi Manusia (7)
  { name: "Longevity Medicine", blurb: "Menambah dekade, lalu membuatnya berarti.", category: "Kesehatan & Potensi Manusia", icon: HeartPulse },
  { name: "Neuroscience", blurb: "Mengoptimalkan tiga pound yang menjalankan segalanya.", category: "Kesehatan & Potensi Manusia", icon: Brain },
  { name: "Precision Nutrition", blurb: "Makanan sebagai instrumen presisi.", category: "Kesehatan & Potensi Manusia", icon: Apple },
  { name: "Peak Psychology", blurb: "Zirah untuk pikiran di bawah beban maksimum.", category: "Kesehatan & Potensi Manusia", icon: Sparkles },
  { name: "Human Performance", blurb: "Meningkatkan sistem operasi tubuh.", category: "Kesehatan & Potensi Manusia", icon: Activity },
  { name: "Creative Intelligence", blurb: "Di tempat logika berakhir, kejeniusan dimulai.", category: "Kesehatan & Potensi Manusia", icon: Palette },
  { name: "Arts & Aesthetics", blurb: "Merancang keindahan ke dalam segala yang disentuhnya.", category: "Kesehatan & Potensi Manusia", icon: Feather },
];

/* --------------------------------- Metodologi ------------------------------ */

export const METHODOLOGY: MethodStep[] = [
  {
    step: "01",
    title: "Pemindaian Total",
    desc: "Kami menginterogasi tantangan Anda dari 46 arah sekaligus — data, sejarah, fisika, politik, psikologi. Tak ada yang lolos tanpa diperiksa.",
    icon: Radar,
  },
  {
    step: "02",
    title: "Sidang Dewan",
    desc: "Dewan-dewan yang relevan bersidang. Debat berlangsung tanpa ampun, ego dilarang masuk, dan hanya argumen terkuat yang selamat.",
    icon: Users,
  },
  {
    step: "03",
    title: "Transendensi",
    desc: "Kami menolak menu pilihan yang sudah terlihat, lalu merancang opsi yang tak mungkin dilihat pihak lain.",
    icon: Sparkles,
  },
  {
    step: "04",
    title: "Arsitektur",
    desc: "Jawaban berubah menjadi cetak biru: masukan hulu dipetakan ke eksekusi hilir, pemilik demi pemilik, metrik demi metrik.",
    icon: DraftingCompass,
  },
  {
    step: "05",
    title: "Asensi",
    desc: "Kami menanamkan, mengukur, dan menggandakan. Anda tidak menerima laporan — Anda menerima lintasan baru.",
    icon: Rocket,
  },
];

/* --------------------------------- Perbandingan ---------------------------- */

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Rerata penguasaan per penasihat",
    omni: "150 tahun",
    mck: "15 tahun",
    goo: "12 tahun",
    uni: "150 ÷ 46 silo",
  },
  {
    label: "Domain yang dikuasai hulu-hilir",
    omni: "Semua 46",
    mck: "Inti strategi",
    goo: "Inti teknologi",
    uni: "46, terfragmentasi",
  },
  {
    label: "Waktu menuju terobosan pertama",
    omni: "48 jam",
    mck: "6 minggu",
    goo: "—",
    uni: "6 bulan (penyelarasan)",
  },
  {
    label: "Tingkat keberhasilan rekam jejak",
    omni: "99,97%",
    mck: "82%",
    goo: "78%",
    uni: "91%",
  },
  {
    label: "Cakupan — hulu → hilir",
    omni: "Spektrum penuh",
    mck: "Hanya advisory",
    goo: "Fokus produk",
    uni: "Terkotak dalam silo",
  },
  {
    label: "Satu jawaban terpadu dan bertanggung jawab",
    omni: "Selalu",
    mck: "Roulette Partner",
    goo: "VAR & reseller",
    uni: "46 opini",
  },
  {
    label: "Ketersediaan",
    omni: "24/7/365",
    mck: "Jam kerja",
    goo: "Jam kerja",
    uni: "Tergantung kalender",
  },
];

/* ----------------------------------- Hasil --------------------------------- */

export const CASES: CaseStudy[] = [
  {
    value: 18.4,
    prefix: "+$",
    suffix: "B",
    decimals: 1,
    title: "Pemulihan Dana Sovereign",
    desc: "Merekonstruksi portofolio dana sovereign Teluk menjadi mesin pengganda abad ini.",
    tag: "Dana Sovereign",
  },
  {
    value: 340,
    prefix: "+",
    suffix: "%",
    decimals: 0,
    title: "Kebangkitan AI Fortune 100",
    desc: "Menerapkan model operasi AI-native di 11 divisi tepat dalam 90 hari.",
    tag: "Teknologi",
  },
  {
    value: 42,
    prefix: "",
    suffix: "M",
    decimals: 0,
    title: "Program Pangan Skala Nasional",
    desc: "Logistik hulu-hilir yang memberi makan 42 juta warga tanpa satu pun pemborosan.",
    tag: "Sektor Publik",
  },
  {
    value: 90,
    prefix: "",
    suffix: " days",
    decimals: 0,
    title: "Mega-Merger Telekomunikasi US$61 Miliar",
    desc: "Menuntaskan dan mengintegrasikan merger US$61 miliar — regulator terkesan, pesaing gemetar.",
    tag: "M&A",
  },
];

/* -------------------------------- Testimoni -------------------------------- */

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Kami meminta sebuah dek strategi. Kami menerima masa depan yang baru. Dewan direksi kami menyetujuinya dalam sebelas menit.",
    name: "Amara Chen",
    role: "CEO Grup, Helios Energy Group",
    initials: "AC",
  },
  {
    quote: "Dewan-dewan GUNARA menemukan US$2,3 miliar nilai tersembunyi di perusahaan yang kami kira sudah kami kenal. Merendahkan sekaligus mendebarkan.",
    name: "Rafael Okonkwo",
    role: "Managing Partner, Meridian Capital",
    initials: "RO",
  },
  {
    quote: "Tiga pemerintah, satu koridor, nol kebuntuan. Belum pernah saya melihat diplomasi bergerak secepat ini.",
    name: "Dr. Laila Haddad",
    role: "Sekretaris Jenderal, Trans-Continental Trade Alliance",
    initials: "LH",
  },
  {
    quote: "Para insinyur kami mengira '340% lebih cepat' itu salah ketik. Lalu mereka bertemu para Dewan.",
    name: "Jonas Weber",
    role: "CTO, TitanGrid Industries",
    initials: "JW",
  },
  {
    quote: "Mereka menjawab dalam 48 jam apa yang tak mampu dijawab empat firma konsultan dalam empat tahun.",
    name: "Putri Maheswari",
    role: "Ketua Umum, Nusantara Financial Holdings",
    initials: "PM",
  },
];

/* ------------------------------- Jangkauan global -------------------------- */

export const HUBS: { name: string; x: number; y: number }[] = [
  { name: "Jakarta", x: 72, y: 58 },
  { name: "Singapore", x: 70, y: 51 },
  { name: "Tokyo", x: 81, y: 34 },
  { name: "Seoul", x: 77, y: 31 },
  { name: "Sydney", x: 78, y: 72 },
  { name: "Dubai", x: 58, y: 38 },
  { name: "London", x: 44, y: 20 },
  { name: "Frankfurt", x: 49, y: 25 },
  { name: "New York", x: 20, y: 32 },
  { name: "San Francisco", x: 10, y: 30 },
];

/* ---------------------------------- Kontak --------------------------------- */

export const GUARANTEES: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Zap,
    title: "Wawasan pertama ≤ 48 jam",
    desc: "Bukan kickoff call. Terobosan nyata.",
  },
  {
    icon: ShieldCheck,
    title: "Kerahasiaan absolut",
    desc: "Ditegakkan kriptografis, kelas sovereign.",
  },
  {
    icon: Crown,
    title: "Partner-in-Chief bernama",
    desc: "Satu leher untuk dipertanggungjawabkan. Milik kami, dengan senang hati.",
  },
];

export const BUDGETS = ["< Rp1 miliar", "Rp1 – Rp10 miliar", "Rp10 – Rp100 miliar", "Rp100 miliar+", "Tak Ternilai"];

export const ORACLE_PROMPTS = [
  "Bagaimana melipatgandakan bisnisku 10x dalam 12 bulan?",
  "Haruskah kita menggalang modal sekarang atau menunggu?",
  "Rancang pemulihan 90 hari untuk timku",
];
