import { useEffect, useState, useMemo } from "react";
import authAxios from "../utils/authAxios";
import { useNavigate, useLocation } from "react-router-dom";

const IMAGE_BASE_URL = "http://localhost:4000";

export default function TicketListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // ✅ ambil query ?q= dari URL (navbar search)
  // =========================
  const searchQ = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("q") || "").trim();
  }, [location.search]);

  const [tickets, setTickets] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE UNTUK MODAL QR ---
  const [selectedQR, setSelectedQR] = useState(null);

  const toggleDetail = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDateParts = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("id-ID", { day: "numeric" }),
      month: date.toLocaleDateString("id-ID", { month: "long" }).substring(0, 3),
      year: date.toLocaleDateString("id-ID", { year: "numeric" }),
    };
  };

  const fetchMyTickets = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await authAxios.get("/tickets/my-tickets");
      setTickets(response.data.tickets || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Gagal memuat daftar tiket Anda.");
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // ✅ FILTER TICKETS dari searchQ (navbar)
  // =========================
  const filteredTickets = useMemo(() => {
    const q = searchQ.toLowerCase();
    if (!q) return tickets;

    return tickets.filter((t) => {
      const event = t.event || {};

      const fields = [
        t.ticketId,
        t.namaPemesan,
        t.emailPemesan,
        t.paymentId,
        t.paymentStatus,
        t.statusAcara,

        event.namaEvent,
        event.lokasi,
        event.penyelenggara,
        event.waktu,
        // tanggal string (biar bisa dicari "2026" / "januari" kadang)
        event.tanggal ? String(event.tanggal) : "",
      ]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase());

      return fields.some((f) => f.includes(q));
    });
  }, [tickets, searchQ]);

  if (loading) return <div className="text-center py-20">Memuat tiket Anda...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-black">Tiketku</h1>

        {/* ✅ info hasil search */}
        {searchQ && (
          <p className="text-sm text-gray-600">
            Hasil pencarian untuk: <span className="font-semibold">"{searchQ}"</span>
          </p>
        )}
      </div>

      {/* Empty state */}
      {tickets.length === 0 && (
        <p className="text-gray-500 text-center py-10">Belum ada tiket yang dibeli.</p>
      )}

      {/* Empty state untuk hasil search */}
      {tickets.length > 0 && filteredTickets.length === 0 && (
        <p className="text-gray-500 text-center py-10">
          Tidak ada tiket yang cocok dengan <span className="font-semibold">"{searchQ}"</span>.
        </p>
      )}

      {/* List tickets */}
      {filteredTickets.map((t) => {
        const event = t.event || {};
        const dateParts = formatDateParts(event.tanggal);
        const imageUrl = event.gambar ? `${IMAGE_BASE_URL}${event.gambar}` : "placeholder.jpg";

        return (
          <div
            key={t.ticketId}
            className="bg-[#F9FBEF] rounded-2xl shadow overflow-hidden p-4 flex flex-col md:flex-row gap-4 border border-black/5"
          >
            {/* POSTER + DATE BOX */}
            <div className="w-full md:w-36 flex flex-row md:flex-col gap-3">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-200 shadow shrink-0">
                <img src={imageUrl} alt={event.namaEvent} className="w-full h-full object-cover" />
              </div>

              <div className="bg-[#F3F6D9] shadow-inner rounded-lg p-3 leading-tight flex-1 text-center md:text-left">
                <p className="text-xl font-bold">{dateParts.day}</p>
                <p className="text-xl font-bold">{dateParts.month}</p>
                <p className="text-xl font-bold">{dateParts.year}</p>
                <p className="text-sm text-gray-700 mt-2">{event.waktu}</p>
              </div>
            </div>

            {/* MIDDLE CONTENT */}
            <div className="flex-1 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
              <h2 className="text-2xl font-bold text-black">{event.namaEvent}</h2>
              <p className="text-sm text-gray-700">{event.lokasi}</p>
              <p className="text-green-600 font-bold text-lg mt-2">{formatRupiah(t.totalHarga)}</p>

              <hr className="my-3 border-gray-300" />

              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleDetail(t.ticketId)}
                  className="flex items-center gap-1 text-sm font-semibold text-black"
                >
                  Detail
                  <span className="material-icons text-base">
                    {openId === t.ticketId ? "expand_less" : "expand_more"}
                  </span>
                </button>

                <span
                  className={`px-4 py-1 text-sm font-semibold rounded-lg ${
                    t.statusAcara === "Berlangsung"
                      ? "bg-[#F4A623] text-black"
                      : t.statusAcara === "Acara Mendatang"
                      ? "bg-orange-300 text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {t.statusAcara}
                </span>
              </div>

              {/* DETAIL CONTENT */}
              {openId === t.ticketId && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm bg-white/50 p-4 rounded-xl">
                  <span className="text-gray-500">Nama Pemesan :</span>
                  <span className="font-medium text-black">{t.namaPemesan}</span>

                  <span className="text-gray-500">Email :</span>
                  <span className="font-medium text-black">{t.emailPemesan}</span>

                  <span className="text-gray-500">ID Tiket :</span>
                  <span className="font-medium text-black font-mono">{t.ticketId}</span>

                  {/* TOMBOL QR */}
                  <span
                    onClick={() => setSelectedQR(t.qrCode)}
                    className="text-[#F4A623] font-bold cursor-pointer hover:underline underline-offset-4 mt-2"
                  >
                    Tampilkan QR Code Tiket
                  </span>
                  <span />

                  <span className="text-gray-500 mt-2">Tanggal pembayaran :</span>
                  <span className="font-medium text-black mt-2">{t.paymentDateFormatted}</span>

                  <span className="text-gray-500">Status pembayaran :</span>
                  <span className="text-green-600 font-bold">{t.paymentStatus}</span>

                  <span className="text-gray-500">ID Pembayaran :</span>
                  <span className="font-medium text-black font-mono">{t.paymentId}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* MODAL QR */}
      {selectedQR && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-in-center">
            <h3 className="text-xl font-extrabold mb-4 text-black uppercase tracking-wider">
              Tiket E-Ticket
            </h3>

            <div className="bg-gray-50 p-6 rounded-2xl inline-block mb-6 border-4 border-dashed border-[#F4A623]">
              <img src={selectedQR} alt="QR Ticket" className="w-52 h-52 mx-auto" />
            </div>

            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Silakan tunjukkan kode QR ini kepada petugas di lokasi acara untuk proses{" "}
              <span className="font-bold text-black">check-in</span>.
            </p>

            <button
              onClick={() => setSelectedQR(null)}
              className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
