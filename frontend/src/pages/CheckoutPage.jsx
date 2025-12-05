// src/pages/CheckoutPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { events } from "../data/events";

const paymentMethods = ["Dana", "Gopay", "Mandiri", "BCA"];

export default function CheckoutPage() {
  const { id } = useParams();
  const ev = events.find((e) => e.id === Number(id));
  const navigate = useNavigate();

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
    setError("");

    // Simulasi membuat tiket & ID pembayaran
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
    };

    const existing = JSON.parse(localStorage.getItem("tickets") || "[]");
    localStorage.setItem("tickets", JSON.stringify([...existing, ticket]));

    navigate("/tickets");
  };

  return (
    <div className="grid lg:grid-cols-[2fr,1.3fr] gap-6">
      {/* Formulir */}
      <div className="bg-white rounded-2xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold mb-2">Konfirmasi pemesanan</h2>
        <p className="text-xs text-slate-500">
          Pastikan data di formulir ini diisi dengan benar, karena e-tiket akan dikirim ke alamat
          email sesuai data yang Anda masukkan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            label="Nama lengkap"
            placeholder="Masukkan nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Alamat email"
            placeholder="Masukkan alamat email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Pilih Metode Pembayaran</label>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-4 py-2 text-xs rounded-full border ${
                    method === m
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-orange-50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Nomor akun"
            placeholder="Masukkan nomor akun"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            error={error}
          />

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Batalkan
            </button>
            <Button type="submit">Buat Pesanan</Button>
          </div>
        </form>
      </div>

      {/* Ringkasan */}
      <div className="bg-white rounded-2xl shadow p-5 space-y-3">
        <h3 className="text-lg font-semibold mb-2">Ringkasan tiketmu</h3>
        <div className="border rounded-2xl p-4 space-y-2 bg-[#FFF7E6]">
          <p className="text-sm font-semibold">{ev.title}</p>
          <p className="text-xs text-slate-600">{ev.location}</p>
          <p className="text-xs text-slate-600">
            {ev.date} • {ev.time}
          </p>
          <p className="text-sm font-semibold mt-1">
            Harga tiket : Rp {ev.price.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-slate-500 mt-2">Jumlah: 1</p>
        </div>
      </div>
    </div>
  );
}
