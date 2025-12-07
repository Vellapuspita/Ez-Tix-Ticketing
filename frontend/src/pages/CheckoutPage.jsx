import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function CheckoutPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const event = {
    id: eventId,
    title: "Seminar Nasional Blockchain",
    price: "Rp. 100.000",
    date: "27 September 2025",
    time: "09:00 WITA",
    location: "Dharma Negara Alaya Denpasar",
  };

  const handleNext = (e) => {
    e.preventDefault();
    // TODO: validate + simpan ke global state / backend
    navigate(`/payment/${event.id}`, { state: { name, email } });
  };

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
          <div className="space-y-1">
            <label className="text-sm font-medium">Alamat email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Masukkan alamat email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <p>Nama tiket : {event.title}</p>
          <p>Nama lengkap : {name || "-"}</p>
          <p>Alamat email : {email || "-"}</p>
          <p>Harga tiket : {event.price}</p>
        </div>
        <hr className="my-2" />
        <div className="text-sm text-muted space-y-1">
          <p>{event.title}</p>
          <p>{event.location}</p>
          <p>
            {event.price} • {event.date} • {event.time}
          </p>
          <p>Jumlah: 1</p>
        </div>
      </aside>
    </div>
  );
}
