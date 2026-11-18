// Semua judul, angka, dan topik di file ini adalah konten contoh untuk desain.
// Ganti dengan konten Cryptonite yang sebenarnya sebelum rilis.

export const SOCIALS = {
  instagram: "https://www.instagram.com/cryptoniteid/",
  facebook: "https://www.facebook.com/cryptoniteid",
  threads: "https://www.threads.net/@cryptoniteid",
};

export const M = (n: string) => `/media/${n}.jpg`;

// Sorotan di hero: hover/klik mengganti foto di belakang
export const SPOTLIGHT = [
  { tag: "Analisis", title: "Dominasi Bitcoin turun, altcoin mulai bernapas", img: "btc-screen" },
  { tag: "Berita", title: "Aturan baru OJK untuk bursa kripto lokal", img: "jakarta" },
  { tag: "Social News", title: "Token meme lokal viral dalam semalam", img: "hand-btc" },
  { tag: "Edukasi", title: "Membaca grafik candlestick dari nol", img: "candles" },
  { tag: "Analisis", title: "Ethereum setelah upgrade: siapa yang untung?", img: "eth" },
];

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

// Kartu liputan bergaya poster
export const STORIES = [
  { tag: "Analisis", date: "18 Nov 2026", title: "Bitcoin di atas 95 ribu: napas panjang atau jebakan?", img: "coins-chart", tone: "paper", read: "8 mnt" },
  { tag: "Berita", date: "18 Nov 2026", title: "Bursa lokal catat volume tertinggi tahun ini", img: "city-night", tone: "blue", read: "4 mnt" },
  { tag: "Social News", date: "17 Nov 2026", title: "Satu postingan, tiga jam, jutaan dolar", img: "phone-apps", tone: "black", read: "5 mnt" },
  { tag: "Edukasi", date: "17 Nov 2026", title: "Dompet dingin vs dompet panas", img: "btc-chip", tone: "paper", read: "6 mnt" },
  { tag: "Analisis", date: "16 Nov 2026", title: "Peta sektor: ke mana uang mengalir", img: "chart-dark", tone: "blue", read: "9 mnt" },
  { tag: "Berita", date: "15 Nov 2026", title: "Pajak kripto 2027: yang perlu disiapkan", img: "desk-dark", tone: "black", read: "5 mnt" },
];

export const WORDS = [
  ["Bitcoin", "Ethereum", "On-chain", "Airdrop", "Regulasi", "Halving", "Solana"],
  ["DeFi", "Meme", "Stablecoin", "Pajak", "Layer 2", "ETF", "Dompet", "NFT"],
];

export const PILLARS = [
  { key: "Edukasi", cadence: "Setiap hari", line: "Dari nol sampai paham. Dompet, keamanan, cara kerja blockchain, tanpa jargon.", img: "laptop-glow" },
  { key: "Analisis", cadence: "Setiap pekan", line: "Data on-chain dan arus modal, dengan asumsi yang ditulis terang.", img: "candles" },
  { key: "Berita", cadence: "Setiap jam", line: "Pasar global dan lokal, dipadatkan dengan konteks kenapa itu penting.", img: "jakarta" },
  { key: "Social News", cadence: "Real time", line: "Narasi lahir di timeline sebelum masuk grafik. Kami pisahkan sinyal dari kebisingan.", img: "community" },
];

export const RADAR = [
  { topic: "#ETFSolana", heat: 92, shift: "+38%" },
  { topic: "Airdrop musim ini", heat: 81, shift: "+21%" },
  { topic: "Token meme Indonesia", heat: 74, shift: "+54%" },
  { topic: "Regulasi OJK", heat: 63, shift: "+9%" },
  { topic: "Bitcoin 100K", heat: 58, shift: "-6%" },
];

export const LEVELS = {
  Pemula: ["Apa itu Bitcoin, sebenarnya", "Bursa vs dompet pribadi", "Aturan keamanan yang wajib", "Modal kecil, risiko terukur", "Mengenali penipuan"],
  Menengah: ["Membaca tokenomics", "DeFi tanpa panik", "Staking dan risikonya", "Mencatat pajak dengan rapi"],
  Lanjutan: ["Metrik on-chain inti", "Funding rate & open interest", "Likuiditas dan slippage", "Menilai risiko protokol", "Struktur pasar derivatif", "Membangun tesis sendiri"],
} as const;

export const POSTS = [
  { kind: "Carousel", cover: "5 tanda proyek abal-abal", img: "btc-keys" },
  { kind: "Reel", cover: "Halving dalam 60 detik", img: "hand-btc" },
  { kind: "Threads", cover: "Yang terjadi di balik pump semalam", img: "chart-dark" },
  { kind: "Carousel", cover: "Peta sektor bulan ini", img: "blocks" },
];
