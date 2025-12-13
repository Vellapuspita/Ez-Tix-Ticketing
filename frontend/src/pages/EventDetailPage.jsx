import { useState, useEffect } from "react"; // <-- Import state dan effect
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // <-- Import Axios

const BASE_URL = "http://localhost:4000/api/events";
const IMAGE_BASE_URL = "http://localhost:4000"; // Untuk mengambil gambar dari /uploads

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk menyimpan data event yang diambil dari API
  const [event, setEvent] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk format tanggal dan waktu
  const formatDate = (dateString, timeString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return `${formattedDate} • ${timeString}`;
  };

  const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
  };

  // ===============================================================
  // FUNGSI AMBIL DETAIL EVENT BERDASARKAN ID
  // ===============================================================
  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      
      // Endpoint: GET /api/events/:id
      const response = await axios.get(`${BASE_URL}/${id}`); 
      setEvent(response.data.event);
      
    } catch (err) {
      console.error("Error fetching event detail:", err);
      if (err.response && err.response.status === 404) {
          setError("Event tidak ditemukan.");
      } else {
          setError("Gagal memuat detail acara.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventDetail();
    }
  }, [id]); // Panggil ulang jika ID di URL berubah

  // Tampilan Loading dan Error State
  if (loading) {
    return <div className="text-center py-20">Memuat detail acara...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }
  
  // Jika event null setelah loading (walaupun error ditangani, ini safeguard)
  if (!event) {
      return <div className="text-center py-20 text-red-500">Event tidak tersedia.</div>;
  }

  // Menghitung tiket yang tersisa (jika Anda memiliki field 'terjual' di model Event)
  const ticketsLeft = event.kapasitas - (event.terjual || 0);
  const bannerUrl = event.gambar ? `${IMAGE_BASE_URL}${event.gambar}` : 'placeholder.jpg';


  return (
    <div className="bg-card rounded-3xl shadow-card overflow-hidden">
      {/* banner */}
      <div 
        className="h-48 md:h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerUrl})` }} // Gunakan gambar event dari DB
      />
      
      {/* content */}
      <div className="p-5 md:p-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">
              {event.namaEvent} {/* Gunakan namaEvent */}
            </h1>
            <p className="text-sm text-muted">{event.lokasi}</p>
            <p className="text-sm text-muted">
                {formatDate(event.tanggal, event.waktu)} {/* Format tanggal dan waktu */}
            </p>
          </div>

          {/* pill tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-medium mt-2">
            <span className="px-3 py-1 rounded-full bg-primary text-white">
              Deskripsi
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary text-dark">
              Tiket tersedia {ticketsLeft} {/* Tiket yang tersisa */}
            </span>
            <span className="px-3 py-1 rounded-full bg-body text-dark">
              {event.penyelenggara} {/* Nama penyelenggara */}
            </span>
          </div>

          <section className="mt-4">
            <h2 className="font-semibold mb-1">Deskripsi</h2>
            <p className="text-sm text-muted leading-relaxed">
              {event.deskripsi}
            </p>
          </section>
        </div>

        {/* sidebar price */}
        <aside className="md:w-64 bg-body rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <p className="text-sm text-muted">Mulai dari</p>
            <p className="text-2xl font-semibold text-primary">
              {formatRupiah(event.hargaTiket)} {/* Format harga */}
            </p>
          </div>
          <button
            className="mt-4 w-full rounded-full bg-primary text-white py-2.5 font-semibold text-sm"
            onClick={() => navigate(`/checkout/${event._id}`)} // Gunakan _id yang sebenarnya
          >
            Beli Sekarang
          </button>
        </aside>
      </div>
    </div>
  );
}