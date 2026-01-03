import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import authAxios from "../../utils/authAxios"; 
import { Pagination } from "../../components/admin/AdminUI";

export default function AdminCheckinPage() {
  const { id } = useParams(); 
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const pageSize = 10; // Sesuaikan dengan limit di backend

  // 1. Ambil Data dari API getCheckinListByEvent
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mengirim query params page, limit, dan search sesuai controller
        const response = await authAxios.get(`/checkin/event/${id}`, {
          params: {
            page: page,
            limit: pageSize,
            search: q
          }
        });
        
        // Controller mengembalikan struktur: { total, page, limit, data }
        setCheckins(response.data.data);
        setTotalData(response.data.total);
      } catch (err) {
        console.error("Gagal mengambil daftar check-in:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, page, q]); // Refresh jika ID, Halaman, atau Pencarian berubah

  const totalPages = Math.max(1, Math.ceil(totalData / pageSize));

  if (loading) return <div className="p-10 text-center">Memuat riwayat check-in...</div>;

  return (
    <div className="w-full">
      <div className="bg-white rounded-[22px] sm:rounded-[28px] shadow-sm p-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="font-extrabold text-black text-lg">Hasil Check-in</p>
            <p className="text-sm text-black/70">Daftar peserta yang sudah melakukan scan tiket</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-black/50">Total Hadir</p>
            <p className="text-xl font-bold text-green-600">{totalData}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full lg:w-[420px] bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-2 border border-black/10 mb-5">
          <span className="material-icons text-black/60">search</span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1); // Reset ke hal 1 saat mencari
            }}
            className="w-full outline-none text-black placeholder:text-black/40"
            placeholder="Cari email atau ID tiket..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-black/60">
                <th className="py-3 pr-4">ID Tiket</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Jumlah</th>
                <th className="py-3 pr-4">Waktu Check-in</th>
                <th className="py-3 pr-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {checkins.map((r) => (
                <tr key={r.ticketId} className="border-t border-black/10 hover:bg-gray-50">
                  <td className="py-4 pr-4 font-mono text-xs text-black">{r.ticketId}</td>
                  <td className="py-4 pr-4 text-black">{r.email}</td>
                  <td className="py-4 pr-4 text-black">{r.jumlah}</td>
                  <td className="py-4 pr-4 text-black text-xs">
                    {new Date(r.checkInTime).toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 text-center">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {checkins.length === 0 && (
            <div className="py-12 text-center">
              <span className="material-icons text-gray-300 text-5xl mb-2">assignment_late</span>
              <p className="text-gray-500">Belum ada peserta yang check-in untuk event ini.</p>
            </div>
          )}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}