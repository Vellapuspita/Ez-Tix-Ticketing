import { useMemo, useState } from "react";
import { dummyEvents, rupiah } from "../../data/adminDummy";
import { Pagination } from "../../components/admin/AdminUI";
import { useNavigate } from "react-router-dom";

export default function AdminStatsPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const events = dummyEvents;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return events;
    return events.filter((e) => e.title.toLowerCase().includes(s) || e.organizer.toLowerCase().includes(s));
  }, [events, q]);

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full">
      {/* Search bar (mirip figma) */}
      <div className="mb-5">
        <div className="w-full lg:w-[420px] bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-2">
          <span className="material-icons text-black/60">search</span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="w-full outline-none text-black placeholder:text-black/40"
            placeholder="search..."
          />
        </div>
      </div>

      {/* List panel */}
      <div className="bg-white rounded-[22px] sm:rounded-[28px] shadow-sm p-5 sm:p-8">
        <div className="space-y-4">
          {paged.map((ev) => (
            <div key={ev.id} className="bg-[#EEF0E3] rounded-2xl p-4 flex flex-col lg:flex-row gap-4">
              <img src={ev.image} alt={ev.title} className="w-full lg:w-[150px] h-[110px] rounded-xl object-cover" />

              <div className="flex-1">
                <p className="font-extrabold text-black">{ev.title}</p>
                <div className="mt-1 text-sm text-black/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-[16px]">location_on</span>
                    <span>{ev.organizer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-[16px]">event</span>
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-[16px]">confirmation_number</span>
                    <span>{ev.quota} Tiket Tersedia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-[16px]">schedule</span>
                    <span>{ev.time}</span>
                  </div>
                </div>
                <p className="mt-2 text-green-700 font-extrabold text-sm">{rupiah(ev.price)}</p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => navigate(`/admin/stats/${ev.id}`)}
                  className="px-6 py-2 rounded-xl bg-[#F6B14A] text-black font-extrabold hover:bg-[#f0a63e]"
                >
                  Cek detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
