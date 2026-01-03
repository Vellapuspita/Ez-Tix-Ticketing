import { useMemo, useState, useEffect } from "react";
import { Pagination } from "../../components/admin/AdminUI";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function AdminStatsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // Helper untuk format rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Helper untuk URL gambar backend
  const imgUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const base = (api.defaults.baseURL || "").replace("/api", "");
    return `${base}${path}`;
  };

  // Ambil data acara dari backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get("/events/all");
        setEvents(res.data?.events || []);
      } catch (err) {
        console.error("Gagal mengambil data statistik acara:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter pencarian berdasarkan Nama Event atau Penyelenggara
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return events;
    return events.filter(
      (e) =>
        (e.namaEvent || "").toLowerCase().includes(s) ||
        (e.penyelenggara || "").toLowerCase().includes(s)
    );
  }, [events, q]);

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <p className="p-10 text-center font-bold">Memuat data...</p>;

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="mb-5">
        <div className="w-full lg:w-[420px] bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-2 border border-black/5">
          <span className="material-icons text-black/60">search</span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="w-full outline-none text-black placeholder:text-black/40"
            placeholder="Cari acara statistik..."
          />
        </div>
      </div>

      {/* List panel */}
      <div className="bg-white rounded-[22px] sm:rounded-[28px] shadow-sm p-5 sm:p-8 border border-black/5">
        <div className="space-y-4">
          {paged.length === 0 ? (
            <div className="text-center py-10 text-gray-400">Tidak ada acara ditemukan.</div>
          ) : (
            paged.map((ev) => (
              <div key={ev._id} className="bg-[#EEF0E3] rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center">
                <img 
                  src={imgUrl(ev.gambar)} 
                  alt={ev.namaEvent} 
                  className="w-full lg:w-[150px] h-[110px] rounded-xl object-cover bg-white" 
                />

                <div className="flex-1">
                  <p className="font-extrabold text-black text-lg">{ev.namaEvent}</p>
                  <div className="mt-1 text-sm text-black/70 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[16px]">location_on</span>
                      <span>{ev.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[16px]">person</span>
                      <span>{ev.penyelenggara || "Penyelenggara"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[16px]">event</span>
                      <span>{new Date(ev.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[16px]">confirmation_number</span>
                      <span>{ev.kapasitas} Tiket Tersedia</span>
                    </div>
                  </div>
                  <p className="mt-2 text-green-700 font-extrabold text-sm">{formatRupiah(ev.hargaTiket)}</p>
                </div>

                <div className="flex items-center justify-end w-full lg:w-auto">
                  <button
                    onClick={() => navigate(`/admin/stats/${ev._id}`)}
                    className="w-full lg:w-auto px-6 py-2 rounded-xl bg-[#F6B14A] text-black font-extrabold hover:bg-[#f0a63e] transition-colors"
                  >
                    Cek detail
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}