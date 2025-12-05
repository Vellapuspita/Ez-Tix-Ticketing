// src/pages/EventDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { events } from "../data/events";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ev = events.find((e) => e.id === Number(id));

  if (!ev) {
    return <p>Acara tidak ditemukan.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="h-56 w-full bg-slate-300">
          <img src={ev.banner} alt={ev.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 space-y-3">
          <h1 className="text-2xl font-bold text-slate-800">{ev.title}</h1>
          <p className="text-sm text-slate-600">
            Bali, {ev.location} • {ev.date} • {ev.time}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-xs font-semibold text-orange-700">
              Tiket tersedia 100
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              Penyelenggara Bali Blockchain Center
            </span>
          </div>

          <div className="grid md:grid-cols-[2fr,1fr] gap-4 mt-4 items-start">
            <div>
              <h2 className="font-semibold mb-2">Deskripsi</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                Bali Blockchain Summit 2025 adalah sebuah forum internasional yang
                mempertemukan pemerintah, pelaku industri, akademisi, dan komunitas teknologi
                dalam satu panggung besar. Acara ini bertujuan untuk mengajak masyarakat luas
                melihat potensi blockchain lebih dari sekadar teknologi finansial dan menjadi
                fondasi masa depan digital yang aman, transparan, dan berkelanjutan.
              </p>
            </div>
            <div className="bg-[#FFF7E6] rounded-2xl p-4 flex flex-col items-stretch">
              <p className="text-xs text-slate-500">Mulai dari</p>
              <p className="text-xl font-bold text-slate-800 mb-3">
                Rp {ev.price.toLocaleString("id-ID")}
              </p>
              <Button onClick={() => navigate(`/events/${ev.id}/checkout`)}>
                Beli Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
