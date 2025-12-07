import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const methods = ["Dana", "Gopay", "Mandiri", "BCA"];

export default function PaymentPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [method, setMethod] = useState("Dana");
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");

  const event = {
    id: eventId,
    title: "Seminar Nasional Blockchain",
    price: "Rp. 100.000",
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!account) {
      setError("Nomor akun wajib diisi");
      return;
    }
    setError("");
    // TODO: kirim ke backend, kalau berhasil:
    navigate("/payment-success");
  };

  return (
    <div className="bg-card rounded-3xl shadow-card p-6 lg:p-8 grid lg:grid-cols-[2fr,1.3fr] gap-8">
      <div>
        <h1 className="text-xl font-semibold mb-1">Konfirmasi pemesanan</h1>
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
              placeholder="Masukkan nomor akun"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
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
              className="px-6 py-2 rounded-full bg-primary text-white text-sm font-semibold"
            >
              Buat Pesanan
            </button>
          </div>
        </form>
      </div>

      <aside className="bg-body rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Ringkasan tiketmu</h2>
        <p className="text-sm">{event.title}</p>
        <p className="text-sm text-muted">{state?.name}</p>
        <p className="text-sm text-muted">{state?.email}</p>
        <div className="mt-2 text-sm">
          <p>Metode: {method}</p>
          <p className="font-semibold mt-1">Total: {event.price}</p>
        </div>
      </aside>
    </div>
  );
}
