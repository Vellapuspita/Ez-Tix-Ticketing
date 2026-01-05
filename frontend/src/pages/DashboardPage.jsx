import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api/events";
const IMAGE_BASE_URL = "http://localhost:4000";

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ambil query dari navbar (?q=)
  const searchQ = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("q") || "").trim();
  }, [location.search]);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const formatRupiah = (price) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const upcomingResponse = await axios.get(BASE_URL + "/");
      setUpcomingEvents(upcomingResponse.data.events || []);

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

  // ✅ filter berdasarkan searchQ dari navbar
  const filteredUpcoming = useMemo(() => {
    const q = searchQ.toLowerCase();
    if (!q) return upcomingEvents;

    return upcomingEvents.filter((ev) => {
      const nama = (ev.namaEvent || "").toLowerCase();
      const lokasi = (ev.lokasi || "").toLowerCase();
      const penyelenggara = (ev.penyelenggara || "").toLowerCase();
      return nama.includes(q) || lokasi.includes(q) || penyelenggara.includes(q);
    });
  }, [upcomingEvents, searchQ]);

  const filteredRecommended = useMemo(() => {
    const q = searchQ.toLowerCase();
    if (!q) return recommendedEvents;

    return recommendedEvents.filter((ev) => {
      const nama = (ev.namaEvent || "").toLowerCase();
      const lokasi = (ev.lokasi || "").toLowerCase();
      const penyelenggara = (ev.penyelenggara || "").toLowerCase();
      return nama.includes(q) || lokasi.includes(q) || penyelenggara.includes(q);
    });
  }, [recommendedEvents, searchQ]);

  if (loading) return <div className="text-center py-20">Memuat acara...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 leading-snug">
        Nikmati pengalaman terbaik <br />
        mencari dan membeli tiket <span className="text-primary">acara favoritmu</span>
      </h1>

      {/* optional info */}
      {searchQ && (
        <p className="text-sm text-gray-600 mb-6">
          Hasil pencarian untuk: <span className="font-semibold">"{searchQ}"</span>
        </p>
      )}

      {/* GRID EVENT UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUpcoming.map((ev) => (
          <div key={ev._id} className="flex bg-[#FFF8E2] rounded-2xl shadow-md overflow-hidden">
            <div className="p-4 flex items-center">
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-white shrink-0">
                <img
                  src={ev.gambar ? `${IMAGE_BASE_URL}${ev.gambar}` : "placeholder.jpg"}
                  alt={ev.namaEvent}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 py-4 pr-4">
              <h3 className="text-lg font-semibold">{ev.namaEvent}</h3>

              <div className="mt-2 space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">location_on</span>
                  {ev.lokasi}
                </p>

                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">payments</span>
                  {formatRupiah(ev.hargaTiket)}
                </p>

                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">event</span>
                  {formatDate(ev.tanggal)}
                </p>

                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">schedule</span>
                  {ev.waktu}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center bg-[#F4A623] px-6">
              <button onClick={() => navigate(`/events/${ev._id}`)} className="font-semibold text-black whitespace-nowrap">
                Beli tiket
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUpcoming.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          {searchQ ? `Tidak ada event utama yang cocok dengan "${searchQ}".` : "Tidak ada acara yang akan datang saat ini."}
        </p>
      )}

      <h2 className="text-xl font-semibold mt-10 mb-4">Rekomendasi acara</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredRecommended.map((rec) => (
          <div
            key={rec._id}
            className="relative rounded-2xl shadow-lg overflow-hidden cursor-pointer"
            onClick={() => navigate(`/events/${rec._id}`)}
          >
            <img
              src={rec.gambar ? `${IMAGE_BASE_URL}${rec.gambar}` : "placeholder.jpg"}
              alt={rec.namaEvent}
              className="w-full h-56 object-cover"
            />

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

      {filteredRecommended.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          {searchQ ? `Tidak ada rekomendasi yang cocok dengan "${searchQ}".` : "Tidak ada rekomendasi acara saat ini."}
        </p>
      )}
    </div>
  );
}
