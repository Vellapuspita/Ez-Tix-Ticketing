import { useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-card px-10 py-12 max-w-md w-full text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-green-500 flex items-center justify-center">
          <span className="material-icons-outlined text-4xl text-green-500">
            check
          </span>
        </div>
        <h1 className="text-xl font-semibold mb-2">
          Pembayaran berhasil
        </h1>
        <p className="text-sm text-muted mb-6">
          Terimakasih telah menggunakan layanan EzTix
        </p>
        <button
          onClick={() => navigate("/tickets")}
          className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold"
        >
          Lihat tiket
        </button>
      </div>
    </div>
  );
}
