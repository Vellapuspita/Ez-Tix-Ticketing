import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react"; // <-- Import useEffect
import axios from "axios"; 

const EVENT_BASE_URL = "http://localhost:4000/api/events";

export default function CheckoutPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // State untuk form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1); // Tambahkan state untuk Jumlah Tiket

  // State Event Data dan Loading
  const [eventData, setEventData] = useState(null); // <-- Ganti event dummy
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ===============================================================
  // UTILITY FUNCTIONS
  // ===============================================================
  const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
  };
  
  // ===============================================================
  // A. FETCH EVENT DETAIL & PRE-FILL USER DATA
  // ===============================================================
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Pre-fill data user dari localStorage (Login)
      const storedUserName = localStorage.getItem('userName');
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Jika belum login, redirect ke login
        navigate('/login');
        return;
      }

      // Kita harus mengambil email dari /profile karena email tidak tersimpan di localStorage
      // Ini adalah panggilan API terproteksi, kita gunakan endpoint Get Profile
      const profileResponse = await axios.get('http://localhost:4000/api/auth/profile', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      const userEmail = profileResponse.data.user.email;
      
      // Set state form dengan data user
      setName(storedUserName || '');
      setEmail(userEmail || '');
      
      // 2. Fetch Detail Event
      const eventResponse = await axios.get(`${EVENT_BASE_URL}/${eventId}`);
      setEventData(eventResponse.data.event);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat detail event atau data profil.");
      setEventData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchData();
    }
  }, [eventId]); 

  // ===============================================================
  // B. HANDLE NEXT (KE PAYMENT PAGE)
  // ===============================================================
  const handleNext = (e) => {
    e.preventDefault();
    if (!name || !email || quantity <= 0 || quantity > (eventData.kapasitas - (eventData.terjual || 0))) {
        alert("Mohon isi semua data dengan benar dan periksa jumlah tiket.");
        return;
    }
    
    // Kirim data ke Payment Page via state navigation
    navigate(`/payment/${eventData._id}`, { 
        state: { 
            name, 
            email, 
            quantity,
            event: eventData // Kirim seluruh objek event
        } 
    });
  };
  
  // Tampilan Loading dan Error State
  if (loading) {
    return <div className="text-center py-20">Memuat data pemesanan...</div>;
  }
  
  if (error || !eventData) {
      return <div className="text-center py-20 text-red-500">{error || "Event tidak tersedia."}</div>;
  }

  // Data Event yang sudah pasti ada
  const ticketsLeft = eventData.kapasitas - (eventData.terjual || 0);
  const totalPrice = quantity * eventData.hargaTiket;


  return (
    <div className="bg-card rounded-3xl shadow-card p-6 lg:p-8 grid lg:grid-cols-[2fr,1.3fr] gap-8">
      <div>
        <h1 className="text-xl font-semibold mb-1">Konfirmasi pemesanan</h1>
        <p className="text-sm text-muted mb-4">
          Pastikan data di formulir ini diisi dengan benar, karena e-tiket akan
          dikirim ke alamat email sesuai data yang Anda masukkan.
        </p>

        <div className="flex gap-3 mb-4 text-sm font-medium">
          <span className="px-3 py-1 rounded-full bg-primary text-white">
            Tiket
          </span>
          <span className="px-3 py-1 rounded-full bg-body text-muted">
            Formulir
          </span>
        </div>

        <form onSubmit={handleNext} className="space-y-4 max-w-md">
            
            {/* Input Nama Lengkap (Pre-filled) */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Nama lengkap</label>
                <input
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Masukkan nama lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            
            {/* Input Alamat Email (Pre-filled) */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Alamat email</label>
                <input
                    type="email"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Masukkan alamat email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    readOnly // Email sebaiknya tidak diubah di sini
                />
            </div>
            
            {/* Input Jumlah Tiket */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Jumlah Tiket (Tersisa: {ticketsLeft})</label>
                <input
                    type="number"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Jumlah tiket yang ingin dibeli"
                    min="1"
                    max={ticketsLeft}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    required
                />
            </div>

            <button
              type="submit"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-primary text-white px-6 py-2.5 text-sm font-semibold"
            >
              Lanjutkan pembayaran
            </button>
        </form>
      </div>

      {/* Ringkasan tiket */}
      <aside className="bg-body rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-sm mb-1">Ringkasan tiketmu</h2>
        <div className="space-y-1 text-sm">
          <p>Nama tiket : {eventData.namaEvent}</p>
          <p>Nama lengkap : {name || "-"}</p>
          <p>Alamat email : {email || "-"}</p>
          <p>Harga per tiket : {formatRupiah(eventData.hargaTiket)}</p>
        </div>
        <hr className="my-2" />
        <div className="text-sm space-y-1">
          <p className="font-semibold">Detail Event:</p>
          <p>{eventData.lokasi}</p>
          <p>Tanggal: {new Date(eventData.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}</p>
          <p>Waktu: {eventData.waktu}</p>
          <p>Jumlah Tiket: {quantity}</p>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
            <span>Total Harga:</span>
            <span className="text-primary">{formatRupiah(totalPrice)}</span>
        </div>
      </aside>
    </div>
  );
}