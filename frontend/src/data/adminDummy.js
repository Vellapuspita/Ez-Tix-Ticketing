export const dummyEvents = [
  {
    id: "ev1",
    title: "Seminar Nasional Blockchain",
    organizer: "Dharma Negara Alaya Denpasar",
    date: "27 September 2025",
    time: "09:00 WITA",
    price: 100000,
    quota: 100,
    sold: 40,
    visitors: 50,
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "ev2",
    title: "Ruang NADA",
    organizer: "Lapangan Niti Mandala Renon",
    date: "19 Oktober 2025",
    time: "19:00 WIB",
    price: 150000,
    quota: 200,
    sold: 100,
    visitors: 120,
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "ev3",
    title: "Stand-up Comedy",
    organizer: "Istana Taman Jepun, Denpasar",
    date: "12 Oktober 2025",
    time: "17:00 WITA",
    price: 50000,
    quota: 150,
    sold: 20,
    visitors: 25,
    image:
       "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
  },
];

export const dummyUsers = [
  { id: "u1", name: "Dacosta Wilson", email: "dacostawilson@gmail.com", role: "Customer" },
  { id: "u2", name: "Vella Puspita", email: "vellapuspita@gmail.com", role: "Customer" },
  { id: "u3", name: "Surya Permana", email: "suryapermana68@gmail.com", role: "Customer" },
  { id: "u4", name: "Florentina DTR", email: "florentinadtrn@gmail.com", role: "Customer" },
];

export const dummyCheckins = [
  { code: "12335646443", email: "dacostawilson@gmail.com", qty: 1, status: "Check-in Berhasil" },
  { code: "0565893342", email: "vellapuspita@gmail.com", qty: 2, status: "Check-in Berhasil" },
  { code: "0475457438", email: "suryapermana68@gmail.com", qty: 1, status: "Check-in Berhasil" },
  { code: "2234539437", email: "florentinadtrn@gmail.com", qty: 2, status: "Check-in Berhasil" },
];

export const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

export const totalRevenue = (events) =>
  events.reduce((acc, e) => acc + e.sold * e.price, 0);
