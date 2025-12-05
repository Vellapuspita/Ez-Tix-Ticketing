import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { events } from "../data/events";

const methods = ["Dana", "Gopay", "Mandiri", "BCA"];

export default function PaymentPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const ev = events.find((e) => e.id === Number(id));

  const name = state?.name || "";
  const email = state?.email || "";
  const quantity = state?.quantity || 1;

  const [method, setMethod] = useState("Dana");
  const [account, setAccount] = useState("");

  if (!ev) return <p>Acara tidak ditemukan.</p>;

  const handlePay = () => {
    if (!account) return;

    const ticket = {
      id: Math.random().toString(36).substring(2),
      event: ev.title,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      price: ev.price,
      name,
      email,
      quantity,
    };

    const exist = JSON.parse(localStorage.getItem("tickets") || "[]");
    localStorage.setItem("tickets", JSON.stringify([...exist, ticket]));

    navigate("/payment-success");
  };

  return (
    <div className="bg-white rounded-t-3xl shadow-md p-8 space-y-6">

      <h1 className="text-2xl font-bold text-center mb-4">Pilih Metode Pembayaran</h1>

      <div className="space-y-3">
        <p className="font-semibold">{ev.title}</p>
        <p className="text-gray-600">Rp {ev.price.toLocaleString("id-ID")}</p>
      </div>

      <p className="font-medium">Pilih metode pembayaran</p>
      <div className="flex gap-2 flex-wrap">
        {methods.map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`px-4 py-2 rounded-xl border ${
              method === m
                ? "bg-[#FFE37A] border-[#FFE37A] font-semibold"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Masukkan nomor akun</label>
        <input
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="Nomor akun"
          className="w-full border rounded-xl px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded-xl font-medium"
        >
          Batalkan
        </button>

        <button
          onClick={handlePay}
          className="w-1/2 bg-[#F0A33F] text-black py-2 rounded-xl font-semibold hover:bg-[#E69A33]"
        >
          Buat Pesanan
        </button>
      </div>
    </div>
  );
}
