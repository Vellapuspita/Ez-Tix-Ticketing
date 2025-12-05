// src/pages/CheckoutPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { events } from "../data/events";

const paymentMethods = ["Dana", "Gopay", "Mandiri", "BCA"];

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ev = events.find((e) => e.id === Number(id));

  const [name, setName] = useState("Selina Maharani");
  const [email, setEmail] = useState("maharanisln123@gmail.com");
  const [method, setMethod] = useState("Dana");
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");

  if (!ev) return <p>Acara tidak ditemukan.</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!account) {
      setError("Nomor akun wajib diisi");
      return;
    }

    const ticketId = "12345678";
    const paymentId = "#EzTix20252709";

    const ticket = {
      ticketId,
      paymentId,
      eventId: ev.id,
      eventTitle: ev.title,
      name,
      email,
      price: ev.price,
      status: "Berhasil",
      date: ev.date,
      time: ev.time,
      location: ev.location,
      method,
    };

    const existing = JSON.parse(localStorage.getItem("tickets") || "[]");
    localStorage.setItem("tickets", JSON.stringify([...existing, ticket]));

    navigate("/tickets");
  };

  return (
    <div className="grid lg:grid-cols-[2fr,1.2fr] gap-6">
      {/* Form pemesanan */}
      <div className="bg-white rounded-3xl shadow-md p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-1">Konfirmasi pemesanan</h2>
        <p className="text-xs text-gray-500 mb-2">
          Pastikan data di formulir ini diisi dengan benar. E-tiket akan dikirim ke alamat email
          sesuai yang kamu masukkan.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama lengkap</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Alamat email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Pilih metode pembayaran</p>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-4 py-2 text-xs rounded-full border ${
                    method === m
                      ? "bg-[#F0A33F] text-black border-[#F0A33F]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"
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
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Masukkan nomor akun"
              className={`w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none ${
                error ? "border-red-400" : "border-gray-300"
              }`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold rounded-full bg-[#F0A33F] text-black shadow hover:bg-[#f3b455]"
            >
              Buat pesanan
            </button>
          </div>
        </form>
      </div>

      {/* Ringkasan tiket */}
      <div className="bg-white rounded-3xl shadow-md p-6 space-y-3">
        <h3 className="text-lg font-semibold mb-2">Ringkasan tiketmu</h3>
        <div className="bg-[#FFF7E6] rounded-2xl p-4 space-y-2">
          <p className="text-sm font-semibold">{ev.title}</p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <span className="material-icons text-sm">location_on</span> {ev.location}
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <span className="material-icons text-sm">calendar_today</span> {ev.date}
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <span className="material-icons text-sm">access_time</span> {ev.time}
          </p>
          <p className="text-sm font-semibold mt-1">
            Harga tiket : Rp {ev.price.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-gray-500 mt-2">Jumlah: 1 tiket</p>
        </div>
      </div>
    </div>
  );
}
