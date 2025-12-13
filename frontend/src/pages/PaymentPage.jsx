import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import authAxios from "../utils/authAxios"; // <-- WAJIB: Axios instance with Token

const methods = ["Dana", "Gopay", "Mandiri", "BCA"];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { state } = useLocation(); // Data dari CheckoutPage
  
  // Ambil data dari state
  const { name, email, quantity, event: eventData } = state || {};

  // State Form
  const [method, setMethod] = useState("Dana");
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Safegaurd: Jika state hilang (misal user refresh)
  if (!eventData || !state) {
    return <div className="text-center py-20 text-red-500">
        Data pemesanan hilang. Mohon kembali ke halaman event.
        <button onClick={() => navigate('/')} className="mt-4 block mx-auto text-primary underline">Kembali ke Dashboard</button>
    </div>
  }
  
  // Data Ringkasan
  const totalHarga = quantity * eventData.hargaTiket;

  const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
  };
  

  // ===============================================================
  // HANDLE PAYMENT AND BUY TICKET
  // ===============================================================
  const handlePay = async (e) => {
    e.preventDefault();
    setError("");

    if (!account) {
      setError("Nomor akun wajib diisi");
      return;
    }
    
    // Konfirmasi final sebelum mengirim
    const confirmBuy = window.confirm(`Apakah Anda yakin ingin membeli ${quantity} tiket ${eventData.namaEvent} dengan total harga ${formatRupiah(totalHarga)}?`);
    if (!confirmBuy) return;


    try {
      setIsLoading(true);
      
      const payload = {
        eventId: eventData._id,
        jumlah: quantity,
        namaLengkap: name,
        email: email,
        paymentMethod: method, // Dana, Gopay, Mandiri, BCA
        nomorAkun: account,
        // Backend juga akan menggunakan req.user.id (dari JWT)
      };

      // Panggil API BUY TICKET: POST /api/tickets/buy (Membutuhkan Token)
      const response = await authAxios.post("/tickets/buy", payload);

      // Jika berhasil (Status 201 Created)
      navigate("/payment-success", { state: { ticket: response.data.ticket } });

    } catch (err) {
      console.error("Payment Error:", err.response?.data || err);
      const errorMessage = err.response?.data?.message || "Pembelian tiket gagal. Coba lagi.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 lg:p-8 grid lg:grid-cols-[2fr,1.3fr] gap-8">
      <div>
        <h1 className="text-xl font-semibold mb-1">Konfirmasi Pembayaran</h1>
        <p className="text-sm text-muted mb-4">
          Pilih metode pembayaran dan pastikan nomor akun sudah benar.
        </p>

        <div className="flex gap-3 mb-4 text-sm font-medium">
          <span className="px-3 py-1 rounded-full bg-body text-muted">
            Tiket
          </span>
          <span className="px-3 py-1 rounded-full bg-primary text-white">
            Lanjutkan pembayaran
          </span>
        </div>

        <form onSubmit={handlePay} className="space-y-4 max-w-md">
          <div className="space-y-1 text-sm">
            <label className="font-medium">Pilih Metode Pembayaran</label>
            <div className="flex flex-wrap gap-2">
              {methods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
                    method === m
                      ? "bg-primary text-white border-primary"
                      : "bg-body text-dark border-gray-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Nomor akun</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Masukkan nomor akun (misal: nomor HP untuk Dana/Gopay, atau nomor rekening)"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium"
              onClick={() => navigate(-1)}
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-full bg-primary text-white text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses Pesanan..." : "Buat Pesanan"}
            </button>
          </div>
        </form>
      </div>

      {/* Ringkasan tiket */}
      <aside className="bg-body rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Ringkasan tiketmu</h2>
        <p className="text-sm">{eventData.namaEvent}</p>
        <p className="text-sm text-muted">Pemesan: {state?.name}</p>
        <p className="text-sm text-muted">Email: {state?.email}</p>
        <div className="mt-2 text-sm">
          <p>Metode Pembayaran: {method}</p>
          <p>Jumlah Tiket: {quantity}</p>
          <hr className="my-2"/>
          <p className="font-semibold mt-1 text-xl">Total: <span className="text-primary">{formatRupiah(totalHarga)}</span></p>
        </div>
      </aside>
    </div>
  );
}