// src/pages/EventDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { events } from "../data/events";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ev = events.find((e) => e.id === Number(id));

  if (!ev) return <p>Acara tidak ditemukan.</p>;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl shadow-md overflow-hidden">
        {/* Banner */}
        <div className="h-64 bg-gray-200">
          <img
            src={ev.banner}
            alt={ev.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-extrabold text-[#222]">
            {ev.title}
          </h1>

          <div className="flex flex-wrap gap-3 text-sm text-gray-700">
            <span className="flex items-center gap-1">
              <span className="material-icons text-sm">location_on</span>
              {ev.location}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-icons text-sm">calendar_today</span>
              {ev.date}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-icons text-sm">access_time</span>
              {ev.time}
            </span>
          </div>

          <div className="grid md:grid-cols-[2fr,1fr] gap-6 items-start">
            {/* Deskripsi */}
            <div className="text-sm text-gray-700 leading-relaxed space-y-2">
              <p>
                {ev.description ||
                  "Acara ini menghadirkan berbagai pengalaman seru dengan penampilan musisi, pembicara, serta aktivitas menarik lainnya. Jangan lewatkan kesempatan untuk menjadi bagian dari momen spesial ini!"}
              </p>
              <p>
                Pastikan kamu sudah melakukan pembelian tiket dan datang lebih awal untuk
                menghindari antrean panjang.
              </p>
            </div>

            {/* Card harga + tombol */}
            <div className="bg-[#FFF7E6] rounded-2xl p-5 flex flex-col gap-3">
              <p className="text-xs text-gray-500">Harga mulai dari</p>
              <p className="text-2xl font-bold text-[#222]">
                Rp {ev.price.toLocaleString("id-ID")}
              </p>
              <button
                onClick={() => navigate(`/events/${ev.id}/checkout`)}
                className="mt-2 bg-[#F0A33F] text-black w-full py-2 rounded-md font-semibold shadow hover:bg-[#f3b455]"
              >
                Beli tiket sekarang
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Tiket terbatas. Satu akun hanya dapat membeli maksimal 4 tiket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
