import { useState, useEffect } from "react"; // <-- Import state dan effect
import { useNavigate } from "react-router-dom";
import axios from "axios"; // <-- Import Axios
// Hapus import dummy data: import { events } from "../data/events";

const BASE_URL = "http://localhost:4000/api/events";
const IMAGE_BASE_URL = "http://localhost:4000"; // Untuk mengambil gambar dari /uploads

export default function EventListPage() {
  const navigate = useNavigate();
  
  // State data
  const [eventsData, setEventsData] = useState([]); // <-- State untuk menyimpan data event
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State Filter/Sort
  const [sortBy, setSortBy] = useState("Tanggal");
  const [filterOpen, setFilterOpen] = useState(false);
  
  // ===============================================================
  // UTILITY FUNCTIONS
  // ===============================================================
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
        month: date.toLocaleDateString('id-ID', { month: 'long' }),
        year: date.toLocaleDateString('id-ID', { year: 'numeric' }),
    };
  };

  // ===============================================================
  // FUNGSI AMBIL SEMUA EVENT (Upcoming)
  // ===============================================================
  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Endpoint: GET /api/events/all
      // Ini memanggil controller getAllEventsForAcaraPage
      const response = await axios.get(`${BASE_URL}/all`); 
      setEventsData(response.data.events || []);
      
    } catch (err) {
      console.error("Error fetching all events:", err);
      setError("Gagal memuat daftar acara.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []); // Hanya panggil saat mount


  // ===============================================================
  // LOGIC SORTING (Dikerjakan di Frontend untuk sementara)
  // ===============================================================
  const sortedEvents = [...eventsData].sort((a, b) => {
    if (sortBy === "Tanggal") {
        return new Date(a.tanggal) - new Date(b.tanggal); // Urutkan dari tanggal terdekat
    }
    if (sortBy === "Lokasi") {
        return a.lokasi.localeCompare(b.lokasi);
    }
    return 0;
  });


  // Tampilan Loading atau Error
  if (loading) {
    return <div className="text-center py-20">Memuat semua acara...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }
  
  return (
    <div className="space-y-8">

      {/* ======================== */}
      {/* TITLE SECTION */}
      {/* ======================== */}
      <div className="flex justify-between items-start">
        <h1 className="text-[32px] font-bold leading-tight">
          Jelajahi berbagai konser <br />
          dan acara menarik disini
        </h1>

        {/* LOKASI SAAT INI */}
        <div className="text-right text-sm leading-tight">
          <p className="text-gray-700">Lokasi saat ini</p>
          <p className="flex items-center justify-end gap-1 font-semibold text-black">
            <span className="material-icons text-base">location_on</span>
            Bali
          </p>
        </div>
      </div>

      {/* ======================== */}
      {/* FILTER DROPDOWN — CENTER */}
      {/* ======================== */}
        <div className="flex justify-center mt-2 mb-6">

          {/* Label */}
          <span className="text-gray-700 font-medium mr-3">Urutkan</span>

          {/* Wrapper (relative) */}
          <div className="relative">

            {/* Button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="bg-[#F4A623] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow"
            >
              {sortBy}
              <span className="material-icons text-sm">expand_more</span>
            </button>

            {/* Dropdown */}
            {filterOpen && (
              <div className="absolute top-[45px] left-0 bg-[#F4A623] text-black rounded-lg shadow px-4 py-2 text-sm font-semibold z-20">

                <button
                  className="block w-full text-left"
                  onClick={() => {
                    setSortBy("Tanggal");
                    setFilterOpen(false);
                  }}
                >
                  Tanggal
                </button>

                <button
                  className="block w-full text-left mt-1"
                  onClick={() => {
                    setSortBy("Lokasi");
                    setFilterOpen(false);
                  }}
                >
                  Lokasi
                </button>

              </div>
            )}

          </div>
        </div>

      {/* ======================== */}
      {/* LIST EVENT */}
      {/* ======================== */}
      <div className="space-y-5">
        
        {sortedEvents.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Tidak ada acara yang akan datang.</p>
        ) : (
            sortedEvents.map((ev) => {
                const dateParts = formatDateParts(ev.tanggal);
                return (
                    <div
                        key={ev._id} // Gunakan _id dari MongoDB
                        className="grid grid-cols-[160px_1fr_140px] bg-white rounded-2xl shadow overflow-hidden"
                    >

                        {/* POSTER + DATE */}
                        <div className="flex gap-3 p-4">
                            <img
                                src={ev.gambar ? `${IMAGE_BASE_URL}${ev.gambar}` : 'placeholder.jpg'}
                                alt={ev.namaEvent}
                                className="w-24 h-24 object-cover rounded-xl"
                            />

                            <div className="flex flex-col justify-center leading-tight">
                                <p className="text-lg font-bold">{dateParts.day}</p>
                                <p className="text-lg font-bold">{dateParts.month.substring(0, 3)}</p> {/* Bulan disingkat */}
                                <p className="text-lg font-bold">{dateParts.year}</p>

                                <p className="text-sm text-gray-700 mt-1">{ev.waktu}</p>
                            </div>
                        </div>

                        {/* MIDDLE INFO */}
                        <div className="flex flex-col justify-center px-6 bg-[#F7F9E8]">
                            <h3 className="text-xl font-bold">{ev.namaEvent}</h3>
                            <p className="text-sm text-gray-600">{ev.lokasi}</p>
                            <p className="text-green-600 font-semibold mt-1">
                                {formatRupiah(ev.hargaTiket)}
                            </p>
                        </div>

                        {/* BUTTON */}
                        <div className="bg-[#F4A623] flex justify-center items-center">
                            <button
                                onClick={() => navigate(`/events/${ev._id}`)}
                                className="font-semibold text-black"
                            >
                                Beli tiket
                            </button>
                        </div>

                    </div>
                );
            })
        )}
      </div>
    </div>
  );
}