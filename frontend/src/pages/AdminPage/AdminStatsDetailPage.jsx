import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyEvents, rupiah } from "../../data/adminDummy";

export default function AdminStatsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ev = useMemo(() => dummyEvents.find((e) => e.id === id) || dummyEvents[0], [id]);

  const revenue = ev.sold * ev.price;
  const percent = Math.min(100, Math.round((ev.sold / ev.quota) * 100));
  const remaining = Math.max(0, ev.quota - ev.sold);

  return (
    <div className="w-full">
      {/* Header card event (mirip figma) */}
      <div className="bg-white rounded-[22px] sm:rounded-[28px] shadow-sm p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <img src={ev.image} alt={ev.title} className="w-full lg:w-[140px] h-[100px] rounded-xl object-cover" />

          <div className="flex-1">
            <p className="font-extrabold text-black text-lg">{ev.title}</p>
            <p className="text-sm text-black/70">{ev.organizer}</p>
            <p className="text-sm text-green-700 font-extrabold mt-1">{rupiah(ev.price)}</p>

            <div className="mt-2 text-sm text-black/70 space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-icons text-[16px]">event</span>
                <span>{ev.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-[16px]">schedule</span>
                <span>{ev.time}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/admin/stats/${ev.id}/checkin`)}
            className="px-6 py-2 rounded-xl bg-[#F6B14A] text-black font-extrabold hover:bg-[#f0a63e]"
          >
            Hasil Check-in
          </button>
        </div>

        {/* Stats boxes row */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-bold text-black">Pesanan</p>
            <p className="text-2xl font-extrabold text-black">{ev.sold}</p>
            <p className="text-xs text-black/60">Meningkat 10% dari kemarin</p>

            <div className="mt-4">
              <p className="text-sm font-bold text-black">Total pengunjung</p>
              <p className="text-2xl font-extrabold text-black">{ev.visitors}</p>
              <p className="text-xs text-black/60">Meningkat 23,53% dari kemarin</p>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-bold text-black">Pendapatan</p>
            <p className="text-2xl font-extrabold text-black">{rupiah(revenue)}</p>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm flex items-center justify-center">
            <Gauge percent={percent} label="Tiket terjual" value={ev.sold} />
          </div>
        </div>

        {/* Chart */}
        <div className="mt-5 bg-white border border-black/10 rounded-2xl p-5 shadow-sm">
          <p className="text-center font-extrabold text-black">Grafik Penjualan Tiket</p>
          <SimpleLine sold={ev.sold} remaining={remaining} />
        </div>
      </div>
    </div>
  );
}

function Gauge({ percent, label, value }) {
  // semicircle gauge via SVG
  const r = 60;
  const c = 2 * Math.PI * r;
  const half = c / 2;
  const progress = (percent / 100) * half;

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
          {percent}%
        </text>
      </svg>
      <p className="text-sm font-bold text-black -mt-1">{value}</p>
      <p className="text-xs text-black/70">{label}</p>
    </div>
  );
}

function SimpleLine({ sold, remaining }) {
  // simple “line chart” look using SVG
  const max = Math.max(sold, remaining, 1);
  const p1y = 20 + (1 - sold / max) * 80;
  const p2y = 20 + (1 - remaining / max) * 80;

  return (
    <div className="mt-3">
      <svg className="w-full" height="220" viewBox="0 0 520 220">
        {/* grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="60" y1={20 + i * 40} x2="500" y2={20 + i * 40} stroke="rgba(0,0,0,0.08)" />
        ))}
        <line x1="60" y1="180" x2="500" y2="180" stroke="rgba(0,0,0,0.25)" />
        <line x1="60" y1="20" x2="60" y2="180" stroke="rgba(0,0,0,0.25)" />

        {/* line */}
        <polyline
          points={`80,${p1y} 480,${p2y}`}
          fill="none"
          stroke="blue"
          strokeWidth="2"
        />
        <circle cx="80" cy={p1y} r="4" />
        <circle cx="480" cy={p2y} r="4" />

        {/* labels */}
        <text x="80" y="205" textAnchor="middle" fontSize="12">
          Tiket Terjual
        </text>
        <text x="480" y="205" textAnchor="middle" fontSize="12">
          Tiket Tersisa
        </text>

        <text x="20" y="105" transform="rotate(-90 20 105)" fontSize="12">
          Jumlah Tiket
        </text>
      </svg>
    </div>
  );
}
