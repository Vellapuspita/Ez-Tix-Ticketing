export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F4DD]">
      <img src="image.png" alt="success" className="w-40 mb-6" />

      <h1 className="text-2xl font-bold mb-2">Pembayaran berhasil</h1>
      <p className="text-gray-600 mb-6">Terimakasih telah menggunakan layanan EzTix</p>

      {/* <button
        onClick={() => (window.location.href = "/tickets")}
        className="px-6 py-2 bg-[#F0A33F] text-black rounded-xl font-semibold"
      >
        Lihat tiket
      </button> */}
    </div>
  );
}
