export const SOCIALS = {
  instagram: "https://www.instagram.com/cryptoniteid/",
  facebook: "https://www.facebook.com/cryptoniteid",
  threads: "https://www.threads.net/@cryptoniteid",
};

// Placeholder harga — dipakai bila API publik tidak bisa dijangkau.
export const FALLBACK_COINS = [
  { id: "bitcoin", sym: "BTC", price: 97420, chg: 2.4 },
  { id: "ethereum", sym: "ETH", price: 3612, chg: 1.1 },
  { id: "solana", sym: "SOL", price: 214.3, chg: -1.8 },
  { id: "binancecoin", sym: "BNB", price: 702.5, chg: 0.6 },
  { id: "ripple", sym: "XRP", price: 2.31, chg: 4.9 },
  { id: "dogecoin", sym: "DOGE", price: 0.392, chg: -2.7 },
  { id: "cardano", sym: "ADA", price: 1.04, chg: 0.3 },
  { id: "toncoin", sym: "TON", price: 5.62, chg: -0.9 },
];

export const FEATURED = {
  tag: "Analisis",
  title: "Kenapa dominasi Bitcoin turun padahal harganya naik?",
  dek: "Altcoin diam-diam menarik arus modal. Kami bedah angkanya, siapa yang diuntungkan, dan apa yang perlu dipantau pekan ini.",
  time: "8 menit baca",
};

export const HEADLINES = [
  { tag: "Berita", title: "Regulasi aset kripto di bawah OJK: apa yang berubah untuk investor ritel", time: "2 jam lalu" },
  { tag: "Social News", title: "Satu postingan, tiga jam, token meme baru tembus jutaan dolar. Siapa di baliknya?", time: "3 jam lalu" },
  { tag: "Edukasi", title: "Cara membaca whitepaper tanpa harus jadi programmer", time: "5 jam lalu" },
  { tag: "Berita", title: "Bursa lokal catat volume harian tertinggi sejak awal tahun", time: "Kemarin" },
  { tag: "Analisis", title: "ETH vs SOL: dua cerita ekosistem yang bertolak belakang", time: "Kemarin" },
];

export const PILLARS = [
  {
    key: "Edukasi",
    line: "Dari nol sampai paham.",
    body: "Panduan bertahap tentang dompet, keamanan, cara kerja blockchain, hingga risiko yang jarang dibahas. Tanpa jargon yang bikin menyerah.",
    items: ["Dompet & keamanan", "Cara kerja blockchain", "Mengenali penipuan", "Pajak kripto di Indonesia"],
    bg: "#0050f0", fg: "#ffffff",
  },
  {
    key: "Analisis",
    line: "Angka, bukan sekadar opini.",
    body: "Data on-chain, arus modal, dan konteks makro dirangkum jadi pandangan yang bisa diuji. Kami tulis asumsinya, bukan cuma kesimpulannya.",
    items: ["On-chain mingguan", "Peta sektor", "Siklus pasar", "Studi proyek"],
    bg: "#000000", fg: "#f5f5f2",
  },
  {
    key: "Berita",
    line: "Cepat, ringkas, jelas.",
    body: "Kabar penting dari pasar global dan lokal, dipadatkan dalam hitungan menit. Yang perlu Anda tahu, dengan konteks mengapa itu penting.",
    items: ["Pasar harian", "Regulasi", "Bursa & listing", "Peretasan & insiden"],
    bg: "#f5f5f2", fg: "#000000",
  },
  {
    key: "Social News",
    line: "Apa yang sedang ramai.",
    body: "Narasi lahir di timeline sebelum masuk grafik. Kami memantau percakapan di Instagram, Threads, dan X lalu memilah mana sinyal, mana kebisingan.",
    items: ["Radar tren", "Tokoh & komunitas", "Meme yang bergerak", "Cek fakta"],
    bg: "#ffffff", fg: "#000000",
  },
];

export const RADAR = [
  { topic: "#ETFSolana", heat: 92, shift: "+38%" },
  { topic: "Airdrop musim ini", heat: 81, shift: "+21%" },
  { topic: "Token meme Indonesia", heat: 74, shift: "+54%" },
  { topic: "Regulasi OJK", heat: 63, shift: "+9%" },
  { topic: "Bitcoin 100K", heat: 58, shift: "-6%" },
  { topic: "Dompet ketipu", heat: 41, shift: "+3%" },
];

export const LEVELS = {
  Pemula: {
    blurb: "Baru dengar kripto? Mulai dari fondasi yang benar sebelum menaruh rupiah pertama.",
    lessons: ["Apa itu Bitcoin, sebenarnya", "Bursa vs dompet pribadi", "Aturan keamanan yang wajib", "Modal kecil, risiko terukur"],
  },
  Menengah: {
    blurb: "Sudah punya aset? Saatnya paham mengapa harga bergerak dan bagaimana mengelola portofolio.",
    lessons: ["Membaca tokenomics", "DeFi tanpa panik", "Staking dan risikonya", "Mencatat pajak dengan rapi"],
  },
  Lanjutan: {
    blurb: "Untuk yang ingin membedah data sendiri: on-chain, derivatif, dan struktur pasar.",
    lessons: ["Metrik on-chain inti", "Funding rate & open interest", "Likuiditas dan slippage", "Menilai risiko protokol"],
  },
} as const;

export const FEED = [
  { kind: "Carousel", title: "5 tanda proyek kripto abal-abal", likes: "12,4 rb", hue: "#0050f0" },
  { kind: "Reel", title: "Halving dijelaskan dalam 60 detik", likes: "48,1 rb", hue: "#000000" },
  { kind: "Carousel", title: "Peta sektor kripto bulan ini", likes: "9,7 rb", hue: "#f5f5f2" },
  { kind: "Threads", title: "Yang sebenarnya terjadi di balik pump semalam", likes: "6,2 rb", hue: "#ffffff" },
  { kind: "Reel", title: "Dompet dingin vs panas", likes: "21,8 rb", hue: "#0050f0" },
];
