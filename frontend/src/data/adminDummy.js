export const dummyEvents = [
  {
    id: "ev1",
    namaEvent: "Seminar Nasional Blockchain",
    deskripsi:
      "Seminar nasional yang membahas teknologi blockchain, Web3, dan implementasinya di sektor publik dan industri.",
    tanggal: "2025-09-27",
    waktu: "09:00 WITA",
    lokasi: "Dharma Negara Alaya, Denpasar",
    penyelenggara: "Dharma Negara Alaya Denpasar",
    hargaTiket: 100000,
    kapasitas: 100,
    terjual: 40,
    pengunjung: 50,
    gambar:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ev2",
    namaEvent: "Ruang NADA",
    deskripsi:
      "Konser musik malam hari dengan konsep festival terbuka dan penampilan musisi lokal serta nasional.",
    tanggal: "2025-10-19",
    waktu: "19:00 WITA",
    lokasi: "Lapangan Niti Mandala Renon",
    penyelenggara: "Ruang Nada Production",
    hargaTiket: 150000,
    kapasitas: 200,
    terjual: 100,
    pengunjung: 120,
    gambar:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ev3",
    namaEvent: "Stand-up Comedy",
    deskripsi:
      "Pertunjukan stand-up comedy dengan komika nasional dan lokal Bali.",
    tanggal: "2025-10-12",
    waktu: "17:00 WITA",
    lokasi: "Istana Taman Jepun, Denpasar",
    penyelenggara: "Comedy ID Bali",
    hargaTiket: 50000,
    kapasitas: 150,
    terjual: 20,
    pengunjung: 25,
    gambar:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
  },
];

// =======================
// USERS
// =======================
export const dummyUsers = [
  { id: "u1", name: "Dacosta Wilson", email: "dacostawilson@gmail.com", role: "Customer" },
  { id: "u2", name: "Vella Puspita", email: "vellapuspita@gmail.com", role: "Customer" },
  { id: "u3", name: "Surya Permana", email: "suryapermana68@gmail.com", role: "Customer" },
  { id: "u4", name: "Florentina DTR", email: "florentinadtrn@gmail.com", role: "Customer" },
];

// =======================
// CHECKINS
// =======================
export const dummyCheckins = [
  { code: "12335646443", email: "dacostawilson@gmail.com", qty: 1, status: "Check-in Berhasil" },
  { code: "0565893342", email: "vellapuspita@gmail.com", qty: 2, status: "Check-in Berhasil" },
  { code: "0475457438", email: "suryapermana68@gmail.com", qty: 1, status: "Check-in Berhasil" },
  { code: "2234539437", email: "florentinadtrn@gmail.com", qty: 2, status: "Check-in Berhasil" },
];

// =======================
// HELPERS
// =======================
export const rupiah = (n = 0) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

export const totalRevenue = (events = []) =>
  events.reduce((acc, e) => acc + (e.hargaTiket || 0) * (e.terjual || 0), 0);
