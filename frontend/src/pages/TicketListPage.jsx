import { useEffect, useState } from "react";
import authAxios from "../utils/authAxios"; // Axios dengan token
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "http://localhost:4000";

export default function TicketListPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleDetail = (id) => {
    setOpenId(openId === id ? null : id);
  };
  
  const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
  };

  const formatDateParts = (dateString) => {
    const date = new Date(dateString);
    return {
        day: date.toLocaleDateString('id-ID', { day: 'numeric' }),
        month: date.toLocaleDateString('id-ID', { month: 'long' }).substring(0, 3), // Ambil 3 huruf awal
        year: date.toLocaleDateString('id-ID', { year: 'numeric' }),
    };
  };

  // ===============================================================
  // FUNGSI AMBIL SEMUA TIKET USER DARI BACKEND
  // ===============================================================
  const fetchMyTickets = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login'); // Redirect jika tidak login
        return;
    }

    try {
        setLoading(true);
        setError(null);
        
        // Endpoint: GET /api/tickets/my-tickets (Membutuhkan Token)
        const response = await authAxios.get("/tickets/my-tickets"); 
        
        // Data dari backend sudah diolah di controller (misal: statusAcara)
        setTickets(response.data.tickets || []);
        
    } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Gagal memuat daftar tiket Anda.");
         if (err.response && err.response.status === 401) {
             localStorage.removeItem('token');
             navigate('/login');
         }
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Memuat tiket Anda...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">Tiketku</h1>

      {tickets.length === 0 && (
        <p className="text-gray-500">Belum ada tiket yang dibeli.</p>
      )}

      {tickets.map((t) => {
        const event = t.event || {}; // Data event yang di-populate
        const dateParts = formatDateParts(event.tanggal);
        const imageUrl = event.gambar ? `${IMAGE_BASE_URL}${event.gambar}` : 'placeholder.jpg';
        
        return (
          <div
            key={t.ticketId}
            className="bg-[#F9FBEF] rounded-2xl shadow overflow-hidden p-4 flex gap-4"
          >
            {/* POSTER + DATE BOX */}
            <div className="w-36 flex flex-col gap-3">
              {/* Poster */}
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 shadow">
                <img
                  src={imageUrl}
                  alt={event.namaEvent}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Date */}
              <div className="bg-[#F3F6D9] shadow-inner rounded-lg p-3 leading-tight">
                <p className="text-xl font-bold">{dateParts.day}</p>
                <p className="text-xl font-bold">{dateParts.month}</p>
                <p className="text-xl font-bold">{dateParts.year}</p>

                <p className="text-sm text-gray-700 mt-2">{event.waktu}</p>
              </div>
            </div>

            {/* MIDDLE CONTENT */}
            <div className="flex-1 border-l pl-6">
              <h2 className="text-2xl font-bold">{event.namaEvent}</h2>
              <p className="text-sm text-gray-700">{event.lokasi}</p>

              <p className="text-green-600 font-bold text-lg mt-2">
                {formatRupiah(t.totalHarga)}
              </p>

              {/* Divider */}
              <hr className="my-3 border-gray-300" />

              {/* Top row: Detail + Status */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleDetail(t.ticketId)}
                  className="flex items-center gap-1 text-sm font-semibold"
                >
                  Detail
                  <span className="material-icons text-base">
                    {openId === t.ticketId ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {/* Status badge */}
                <span
                  className={`
                    px-4 py-1 text-sm font-semibold rounded-lg
                    ${
                      t.statusAcara === "Berlangsung"
                        ? "bg-[#F4A623] text-black"
                        : t.statusAcara === "Acara Mendatang"
                        ? "bg-orange-300 text-black"
                        : "bg-red-500 text-white"
                    }
                  `}
                >
                  {t.statusAcara}
                </span>
              </div>

              {/* DETAIL CONTENT */}
              {openId === t.ticketId && (
                <div className="mt-4 grid grid-cols-2 gap-y-1 text-sm">

                  <span className="text-gray-500">Nama Pemesan :</span>
                  <span className="font-medium">{t.namaPemesan}</span> {/* Ambil namaPemesan */}

                  <span className="text-gray-500">Email :</span>
                  <span className="font-medium">{t.emailPemesan}</span> {/* Ambil emailPemesan */}

                  <span className="text-gray-500">ID Tiket :</span>
                  <span className="font-medium">{t.ticketId}</span>

                  <span 
                    onClick={() => alert(`Tampilkan QR Code: ${t.qrCode}`)}
                    className="text-[#F4A623] font-semibold cursor-pointer"
                  >
                    QR Code tiket
                  </span>
                  <span />

                  <span className="text-gray-500">Tanggal pembayaran :</span>
                  <span className="font-medium">{t.paymentDateFormatted}</span> {/* Sudah diformat di backend */}

                  <span className="text-gray-500">Status pembayaran :</span>
                  <span className="text-green-600 font-semibold">
                    {t.paymentStatus}
                  </span>

                  <span className="text-gray-500">ID Pembayaran :</span>
                  <span className="font-medium">{t.paymentId}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}