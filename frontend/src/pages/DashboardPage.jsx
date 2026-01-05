import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Gunakan axios biasa karena endpoint event ini public

// Hapus import dummy data: import { events, recommended } from "../data/events";

const BASE_URL = "http://localhost:4000/api/events";
const IMAGE_BASE_URL = "http://localhost:4000"; // Untuk mengambil gambar dari /uploads

export default function DashboardPage() {
  const navigate = useNavigate();

  // State untuk menyimpan data event dari API
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk format tanggal dan waktu
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  const formatRupiah = (price) => {
      // Harga di backend disimpan sebagai number, tampilkan sebagai Rupiah
      return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
      }).format(price);
  };
  

  // ===============================================================
  // FUNGSI AMBIL DATA EVENTS DARI BACKEND
  // ===============================================================
  const fetchEvents = async () => {
    try {
      setLoading(true);

      // 1. Ambil Event Utama (Upcoming events kecuali rekomendasi)
      // Endpoint: GET /api/events/
      const upcomingResponse = await axios.get(BASE_URL + "/"); 
      setUpcomingEvents(upcomingResponse.data.events || []);

      // 2. Ambil Event Rekomendasi
      // Endpoint: GET /api/events/recommendation
      const recommendedResponse = await axios.get(BASE_URL + "/recommendation"); 
      setRecommendedEvents(recommendedResponse.data || []);
      
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Gagal memuat acara. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Tampilan Loading atau Error
  if (loading) {
    return <div className="text-center py-20">Memuat acara...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div>
      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 leading-snug">
        Nikmati pengalaman terbaik <br />
        mencari dan membeli tiket{" "}
        <span className="text-primary">acara favoritmu</span>
      </h1>

      {/* GRID EVENT UTAMA (2×2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingEvents.map((ev) => (
          <div
            key={ev._id} // Gunakan _id dari MongoDB
            className="flex bg-[#FFF8E2] rounded-2xl shadow-md overflow-hidden"
          >
            {/* Poster kiri */}
            <div className="p-4 flex items-center">
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-white shrink-0">
                <img
                  src={ev.gambar ? `${IMAGE_BASE_URL}${ev.gambar}` : "placeholder.jpg"}
                  alt={ev.namaEvent}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>


            {/* Middle Details */}
            <div className="flex-1 py-4 pr-4">
              <h3 className="text-lg font-semibold">{ev.namaEvent}</h3>

              <div className="mt-2 space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">
                    location_on
                  </span>
                  {ev.lokasi}
                </p>

                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">
                    payments
                  </span>
                  {formatRupiah(ev.hargaTiket)} {/* Format harga */}
                </p>

                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">
                    event
                  </span>
                  {formatDate(ev.tanggal)} {/* Format tanggal */}
                </p>

                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">
                    schedule
                  </span>
                  {ev.waktu}
                </p>
              </div>
            </div>

            {/* Button kanan */}
            <div className="flex items-center justify-center bg-[#F4A623] px-6">
              <button
                onClick={() => navigate(`/events/${ev._id}`)} // Gunakan _id untuk navigasi
                className="font-semibold text-black whitespace-nowrap"
              >
                Beli tiket
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Jika tidak ada event utama */}
      {upcomingEvents.length === 0 && (
          <p className="text-center text-gray-500 mt-8">Tidak ada acara yang akan datang saat ini.</p>
      )}

      {/* Rekomendasi acara */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Rekomendasi acara</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedEvents.map((rec) => (
          <div
            key={rec._id} // Gunakan _id dari MongoDB
            className="relative rounded-2xl shadow-lg overflow-hidden cursor-pointer"
            onClick={() => navigate(`/events/${rec._id}`)}
          >
            <img
              src={rec.gambar ? `${IMAGE_BASE_URL}${rec.gambar}` : 'placeholder.jpg'}
              alt={rec.namaEvent}
              className="w-full h-56 object-cover"
            />

            {/* Overlay */}
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/85 to-transparent text-white">
              <h3 className="text-lg font-semibold">{rec.namaEvent}</h3>

              <div className="text-xs opacity-90 space-y-1 mt-1">
                <p>{rec.lokasi}</p>
                <p>{formatDate(rec.tanggal)}</p>
              </div>

              <button className="w-full bg-[#F4A623] text-black font-semibold py-2 rounded-xl mt-3">
                Beli tiket
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Jika tidak ada rekomendasi */}
      {recommendedEvents.length === 0 && (
          <p className="text-center text-gray-500 mt-8">Tidak ada rekomendasi acara saat ini.</p>
      )}
    </div>
  );
}