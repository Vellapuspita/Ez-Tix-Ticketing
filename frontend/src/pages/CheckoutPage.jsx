// src/pages/CheckoutPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { events } from "../data/events";

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ev = events.find((e) => e.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  if (!ev) return <p>Acara tidak ditemukan.</p>;

  const handleNext = () => {
    if (!name || !emailValid) return;
    navigate(`/payment/${ev.id}`, {
      state: { name, email, quantity },
    });
  };

  return (
    <div className="bg-[#f3f3f3] min-h-screen px-6 py-8">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#FCD663] flex items-center justify-center shadow-md"
        >
          <span className="material-icons">arrow_back</span>
        </button>

        <div>
          <h1 className="text-2xl font-extrabold">Konfirmasi pemesanan</h1>
          <p className="text-sm text-gray-600">
            Pastikan data di formulir ini benar.
          </p>
        </div>
      </div>

      {/* TIKET */}
      <div className="bg-[#F4F4DD] rounded-2xl shadow-md flex p-4 mb-6">
        <div className="w-40 bg-white rounded-xl overflow-hidden shadow flex flex-col items-center p-2">
          <img src={ev.banner} className="w-full h-20 object-cover rounded-md" />

          <p className="mt-2 font-bold text-lg">{ev.date.split(" ")[0]}</p>
          <p className="text-sm">{ev.date.split(" ")[1]}</p>
          <p className="text-xs text-gray-500">{ev.time}</p>
        </div>

        <div className="flex-1 px-6 py-2">
          <h2 className="text-xl font-extrabold">{ev.title}</h2>
          <p className="text-gray-600 text-sm">{ev.location}</p>
          <p className="text-green-600 text-xl font-bold mt-2">
            Rp {ev.price.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex items-center px-6 gap-4">
          <span className="font-medium">Jumlah</span>
          <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-xl shadow-sm">
            <button
              disabled={quantity <= 1}
              onClick={() => setQuantity(quantity - 1)}
            >
              −
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-bold mb-3">Formulir</h3>

        <div className="space-y-4">

          <div>
            <label className="text-sm font-medium">Nama lengkap</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  { setEmail(e.target.value); setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)); }
                }
                placeholder="Masukkan email"
                className="w-full border rounded-xl px-4 py-3 pr-10"
              />
              {emailValid && (
                <span className="material-icons absolute right-3 top-3 text-green-600">
                  check
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!name || !emailValid}
        className="w-full bg-[#F0A33F] text-black py-3 rounded-xl mt-6"
      >
        Lanjutkan pembayaran
      </button>

    </div>
  );
}
