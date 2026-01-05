import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api/events";
const IMAGE_BASE_URL = "http://localhost:4000"; // server BE (static /uploads)

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // Helper: URL gambar aman
  // =========================
  const resolveImageUrl = (img) => {
    if (!img) return "";
    const s = String(img).trim();

    // kalau sudah full url
    if (/^https?:\/\//i.test(s)) return s;

    // rapikan path windows -> web
    const cleaned = s.replaceAll("\\", "/");

    // pastikan ada "/" di depan
    const withSlash = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;

    return `${IMAGE_BASE_URL}${withSlash}`;
  };

  // =========================
  // Format tanggal & rupiah
  // =========================
  const formatDate = (dateString, timeString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${formattedDate} • ${timeString}`;
  };

  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // =========================
  // Fetch detail event
  // =========================
  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      setError(null);

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
    if (id) fetchEventDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Memuat detail acara...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!event) {
    return (
      <div className="text-center py-20 text-red-500">Event tidak tersedia.</div>
    );
  }

  const ticketsLeft = Number(event.kapasitas ?? 0) - Number(event.terjual ?? 0);

  // banner
  const bannerUrl = resolveImageUrl(event.gambar);
  const bannerStyle = bannerUrl
    ? { backgroundImage: `url("${encodeURI(bannerUrl)}")` }
    : undefined;

  return (
    <div className="bg-card rounded-3xl shadow-card overflow-hidden">
      {/* BANNER */}
      <div
        className="h-48 md:h-64 bg-cover bg-center bg-gray-200"
        style={bannerStyle}
      />

      {/* CONTENT */}
      <div className="p-5 md:p-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">{event.namaEvent}</h1>
            <p className="text-sm text-muted">{event.lokasi}</p>
            <p className="text-sm text-muted">
              {formatDate(event.tanggal, event.waktu)}
            </p>
          </div>

          {/* pill tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-medium mt-2">
            <span className="px-3 py-1 rounded-full bg-primary text-white">
              Deskripsi
            </span>

            <span className="px-3 py-1 rounded-full bg-secondary text-dark">
              Tiket tersedia {ticketsLeft}
            </span>

            <span className="px-3 py-1 rounded-full bg-body text-dark">
              {event.penyelenggara}
            </span>
          </div>

          <section className="mt-4">
            <h2 className="font-semibold mb-1">Deskripsi</h2>
            <p className="text-sm text-muted leading-relaxed">
              {event.deskripsi}
            </p>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="md:w-64 bg-body rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <p className="text-sm text-muted">Mulai dari</p>
            <p className="text-2xl font-semibold text-primary">
              {formatRupiah(event.hargaTiket)}
            </p>
          </div>

          <button
            className="mt-4 w-full rounded-full bg-primary text-white py-2.5 font-semibold text-sm"
            onClick={() => navigate(`/checkout/${event._id}`)}
          >
            Beli Sekarang
          </button>
        </aside>
      </div>
    </div>
  );
}
