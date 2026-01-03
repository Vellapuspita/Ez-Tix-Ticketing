// AdminStatsDetailPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { rupiah } from "../../data/adminDummy";

const BACKEND_BASE_URL = "http://localhost:4000";

// helper biar image /uploads/... bisa kebaca di frontend
const imgUrl = (path) => {
  if (!path) return "";
  if (typeof path !== "string") return "";
  if (path.startsWith("blob:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // kasus: "/uploads/xxx.jpg"
  return `${BACKEND_BASE_URL}${path}`;
};

const formatTanggal = (dateLike) => {
  if (!dateLike) return "-";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return String(dateLike);

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// kalau waktu dari backend bentuknya "2026-01-03T10:00:00.000Z" / Date, rapihin
const formatWaktu = (timeLike) => {
  if (!timeLike) return "-";
  // kalau sudah "HH:mm" / "HH:mm:ss"
  if (typeof timeLike === "string" && /^\d{2}:\d{2}/.test(timeLike)) return timeLike.slice(0, 5);

  const d = new Date(timeLike);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }
  return String(timeLike);
};

export default function AdminStatsDetailPage() {
  const { id } = useParams(); // eventId dari route: /admin/stats/:id
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAdminAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchDetail = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await api.get(`/stats/overview/${id}`, {
      headers: getAdminAuthHeaders(),
    });

    setOverview(res.data);
  } catch (err) {
    setError(err?.response?.data?.message || "Gagal memuat detail statistik event.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (!id) return;
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ===== derive data =====
  const ev = overview?.event || null;

  const sold = Number(overview?.totalTiketTerjual ?? 0);
  const revenue = Number(overview?.totalPendapatan ?? 0);
  const totalCustomer = Number(overview?.totalCustomer ?? 0);

  const capacityAwal = Number(overview?.kapasitasAwal ?? 0);
  const sisaTiket = Number(overview?.sisaTiket ?? 0);
  const percent = Number(overview?.persenTerjual ?? 0);

  // grafik versi lama: 2 titik (terjual vs tersisa)
  const remaining = Math.max(0, sisaTiket);

  if (loading) {
    return (
      <div className="w-full min-h-[240px] flex items-center justify-center">
        <p className="font-bold text-black">Memuat detail event...</p>
      </div>
    );
  }

  if (error || !ev) {
    return (
      <div className="w-full min-h-[240px] flex flex-col items-center justify-center gap-3">
        <p className="font-bold text-red-600">{error || "Event tidak ditemukan."}</p>
        <button onClick={fetchDetail} className="px-5 py-2 rounded-xl bg-black text-white font-bold">
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-[22px] sm:rounded-[28px] shadow-sm p-5 sm:p-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="w-full lg:w-[140px] h-[100px] rounded-xl overflow-hidden bg-white shrink-0 border border-black/10">
            <img src={imgUrl(ev.gambar)} alt={ev.namaEvent} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1">
            <p className="font-extrabold text-black text-lg">{ev.namaEvent}</p>

            <p className="text-sm text-black/70">{ev.penyelenggara || "-"}</p>
            <p className="text-sm text-black/70">{ev.lokasi || "-"}</p>

            <p className="text-sm text-green-700 font-extrabold mt-1">{rupiah(ev.hargaTiket || 0)}</p>

            <div className="mt-2 text-sm text-black/70 space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-icons text-[16px]">event</span>
                <span>{formatTanggal(ev.tanggal)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-[16px]">schedule</span>
                <span>{formatWaktu(ev.waktu)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/admin/stats/${id}/checkin`)}
            className="px-6 py-2 rounded-xl bg-[#F6B14A] text-black font-extrabold hover:bg-[#f0a63e]"
          >
            Hasil Check-in
          </button>
        </div>

        {/* STATS BOXES */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-bold text-black">Customer unik</p>
            <p className="text-2xl font-extrabold text-black">{totalCustomer}</p>

            <div className="mt-4">
              <p className="text-sm font-bold text-black">Tiket terjual</p>
              <p className="text-2xl font-extrabold text-black">{sold}</p>
              <p className="text-xs text-black/60">
                Kapasitas awal: {capacityAwal} • Sisa: {remaining}
              </p>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-bold text-black">Pendapatan</p>
            <p className="text-2xl font-extrabold text-black">{rupiah(revenue)}</p>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm flex items-center justify-center">
            <Gauge percent={percent} label="Terjual" value={`${sold}/${capacityAwal}`} />
          </div>
        </div>

        {/* ✅ GRAFIK MODEL LAMA (sesuai screenshot kamu) */}
        <div className="mt-5 bg-white border border-black/10 rounded-2xl p-5 shadow-sm">
          <p className="text-center font-extrabold text-black">Grafik Penjualan Tiket</p>
          <SimpleLine sold={sold} remaining={remaining} capacity={capacityAwal} />
        </div>

        {/* chart backend tetap ada untuk nanti (ga ditampilkan dulu) */}
        {/* <pre className="mt-4 text-xs bg-black/5 p-3 rounded-xl overflow-auto">
          {JSON.stringify(chart, null, 2)}
        </pre> */}
      </div>
    </div>
  );
}

function Gauge({ percent, label, value }) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const half = c / 2;
  const progress = (Math.max(0, Math.min(100, Number(percent) || 0)) / 100) * half;

  return (
    <div className="text-center">
      <svg width="180" height="110" viewBox="0 0 180 110">
        <path d="M30,90 A60,60 0 0 1 150,90" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="10" />
        <path
          d="M30,90 A60,60 0 0 1 150,90"
          fill="none"
          stroke="black"
          strokeWidth="10"
          strokeDasharray={`${progress} ${half}`}
          strokeLinecap="round"
        />
        <text x="90" y="75" textAnchor="middle" fontSize="22" fontWeight="800">
          {Number(percent) || 0}%
        </text>
      </svg>
      <p className="text-sm font-bold text-black -mt-1">{value}</p>
      <p className="text-xs text-black/70">{label}</p>
    </div>
  );
}

function SimpleLine({ sold, remaining }) {
  const soldNum = Number(sold) || 0;
  const remNum = Number(remaining) || 0;

  // ✅ bikin garis TURUN: kiri lebih besar, kanan lebih kecil
  const leftValue = remNum;   // tampil di "Tiket Terjual" (biar garis turun)
  const rightValue = soldNum; // tampil di "Tiket Tersisa"

  const max = Math.max(leftValue, rightValue, 1);

  const mapY = (val) => 20 + (1 - val / max) * 160; // 20..180
  const p1y = mapY(leftValue);
  const p2y = mapY(rightValue);

  // ✅ bikin angka grid dinamis
  const steps = 5; // 0..max jadi 5 garis
  const ticks = Array.from({ length: steps + 1 }, (_, i) =>
    Math.round((max * (steps - i)) / steps)
  );

  return (
    <div className="mt-3">
      <svg className="w-full" height="260" viewBox="0 0 520 260">
        {/* grid + label angka */}
        {ticks.map((t, i) => {
          const y = 20 + i * (160 / steps);
          return (
            <g key={i}>
              <line x1="60" y1={y} x2="500" y2={y} stroke="rgba(0,0,0,0.15)" strokeDasharray="4 4" />
              <text x="50" y={y + 4} fontSize="11" textAnchor="end" fill="rgba(0,0,0,0.7)">
                {t}
              </text>
            </g>
          );
        })}

        {/* axis */}
        <line x1="60" y1="180" x2="500" y2="180" stroke="rgba(0,0,0,0.35)" />
        <line x1="60" y1="20" x2="60" y2="180" stroke="rgba(0,0,0,0.35)" />

        {/* line */}
        <polyline points={`80,${p1y} 480,${p2y}`} fill="none" stroke="blue" strokeWidth="2" />
        <circle cx="80" cy={p1y} r="4" fill="blue" />
        <circle cx="480" cy={p2y} r="4" fill="blue" />

        {/* labels X */}
        <text x="80" y="210" textAnchor="middle" fontSize="12">
          Tiket Terjual
        </text>
        <text x="480" y="210" textAnchor="middle" fontSize="12">
          Tiket Tersisa
        </text>

        {/* label tengah bawah */}
        <text x="280" y="235" textAnchor="middle" fontSize="12">
          Status Tiket
        </text>

        {/* label Y */}
        <text x="18" y="115" transform="rotate(-90 18 115)" fontSize="12">
          Jumlah Tiket
        </text>
      </svg>
    </div>
  );
}
