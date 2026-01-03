import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api"; 
import { Toast, ConfirmDialog } from "../../components/admin/AdminUI";

export default function AdminEventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState({ open: false, text: "" });

  // Fungsi helper untuk format Rupiah agar tidak terlihat "10" saja
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events/all");
      setEvents(res.data?.events || []);
    } catch (err) {
      setError("Gagal mengambil daftar acara.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async () => {
    try {
      // Menggunakan adminToken sesuai standar login admin Anda
      const token = localStorage.getItem("token"); 
      await api.delete(`/events/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEvents(events.filter(ev => ev._id !== selectedId));
      setToast({ open: true, text: "Acara berhasil dihapus!" });
    } catch (err) {
      setToast({ open: true, text: "Gagal menghapus acara." });
    } finally {
      setOpenDelete(false);
    }
  };

  if (loading) return <p className="p-10 text-center font-bold text-black">Memuat daftar acara...</p>;

  return (
    <div className="p-6">
      <Toast open={toast.open} text={toast.text} onClose={() => setToast({ open: false, text: "" })} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-black">Kelola Acara</h2>
        <Link to="/admin/events/create" className="bg-[#F6B14A] text-black font-bold px-6 py-2 rounded-xl shadow-sm hover:bg-[#f0a63e] transition-all">
          Buat Acara Baru
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white p-5 border border-black/10 rounded-[22px] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-black mb-1 line-clamp-1">{event.namaEvent}</h3>
            <div className="space-y-1 mb-4">
              <p className="text-xs text-black/60 flex items-center gap-1">
                <span className="material-icons text-sm">event</span>
                {new Date(event.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-black/60 flex items-center gap-1">
                <span className="material-icons text-sm">location_on</span>
                {event.lokasi}
              </p>
              <p className="text-sm font-bold text-green-600">
                {formatRupiah(event.hargaTiket)}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link 
                to={`/admin/events/edit/${event._id}`} 
                className="flex-1 text-center bg-blue-600 text-white py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors"
              >
                Edit
              </Link>
              <button 
                onClick={() => { setSelectedId(event._id); setOpenDelete(true); }}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl font-bold text-xs hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[22px] border border-dashed border-gray-300">
          <p className="text-black/40">Belum ada acara yang dibuat.</p>
        </div>
      )}

      <ConfirmDialog
        open={openDelete}
        title="Konfirmasi Hapus"
        message="Acara yang dihapus tidak dapat dikembalikan. Lanjutkan?"
        onYes={handleDelete}
        onNo={() => setOpenDelete(false)}
      />
    </div>
  );
}