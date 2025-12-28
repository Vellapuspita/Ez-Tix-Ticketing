import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyCheckins, dummyEvents } from "../../data/adminDummy";
import { Pagination } from "../../components/admin/AdminUI";

export default function AdminCheckinPage() {
  const { id } = useParams();
  const ev = useMemo(() => dummyEvents.find((e) => e.id === id) || dummyEvents[0], [id]);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return dummyCheckins;
    return dummyCheckins.filter((r) => r.code.includes(s) || r.email.toLowerCase().includes(s));
  }, [q]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full">
      <div className="bg-white rounded-[22px] sm:rounded-[28px] shadow-sm p-5 sm:p-6">
        <p className="font-extrabold text-black text-lg mb-3">Hasil Check-in</p>
        <p className="text-sm text-black/70 mb-4">{ev.title}</p>

        <div className="w-full lg:w-[420px] bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-2 border border-black/10">
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

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-black/60">
                <th className="py-3 pr-4">Nomor / Kode tiket</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Jum.Tiket</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r, idx) => (
                <tr key={idx} className="border-t border-black/10">
                  <td className="py-4 pr-4 font-semibold text-black">{r.code}</td>
                  <td className="py-4 pr-4 text-black">{r.email}</td>
                  <td className="py-4 pr-4 text-black">{r.qty}</td>
                  <td className="py-4 pr-4 font-bold text-green-700">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 h-[58px] border border-blue-500 rounded-md" />
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
