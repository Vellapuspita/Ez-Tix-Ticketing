// src/pages/TicketListPage.jsx
import { useState } from "react";

export default function TicketListPage() {
  let tickets = [];

  try {
    const raw = localStorage.getItem("tickets");
    const parsed = raw ? JSON.parse(raw) : [];
    tickets = Array.isArray(parsed) ? parsed : [];
  } catch {
    tickets = [];
  }

  // Jika tidak ada tiket
  if (tickets.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-20 text-lg">
        Kamu belum memiliki tiket.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8E8] px-6 py-10">
      <h1 className="text-2xl font-extrabold mb-6">Tiketku</h1>

      <div className="space-y-6">
        {tickets.map((t, i) => (
          <TicketItem key={i} ticket={t} />
        ))}
      </div>
    </div>
  );
}

// ==========================
//   TICKET ITEM (FIGMA)
// ==========================
function TicketItem({ ticket }) {
  const [open, setOpen] = useState(false);

  const status = getEventStatus(ticket.date);

  return (
    <div className="bg-white rounded-3xl shadow-md p-5">
      <div className="flex">

        {/* POSTER */}
        <img
          src={ticket.banner}
          className="w-36 h-36 rounded-xl object-cover"
        />

        {/* DATE BOX */}
        <div className="w-32 flex flex-col items-center justify-center ml-3 bg-[#F8F8E8] rounded-xl py-3">
          <p className="text-[22px] font-extrabold leading-5">
            {ticket.date.split(" ")[0]}
          </p>
          <p className="text-[15px] font-semibold">
            {ticket.date.split(" ")[1]}
          </p>
          <p className="text-sm text-gray-500 mt-1">{ticket.time}</p>
        </div>

        {/* MAIN INFO */}
        <div className="flex-1 ml-6">
          <h2 className="text-xl font-extrabold">{ticket.eventTitle}</h2>
          <p className="text-gray-600">{ticket.location}</p>

          <p className="text-green-600 font-bold text-lg mt-2">
            Rp {ticket.price.toLocaleString("id-ID")}
          </p>

          <div className="flex justify-between items-center mt-3">

            {/* Detail Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="text-sm font-medium flex items-center gap-1"
            >
              Detail
              <span className="material-icons text-sm">
                {open ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* STATUS BADGE */}
            <span
              className={`px-3 py-1 text-xs rounded-lg font-semibold ${
                status === "Berlangsung"
                  ? "bg-green-500 text-white"
                  : status === "Akan Mendatang"
                  ? "bg-yellow-400 text-black"
                  : "bg-red-500 text-white"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* EXPAND DETAIL */}
      {open && (
        <div className="border-t mt-4 pt-3 grid grid-cols-2 gap-4 text-sm text-gray-700">

          {/* LEFT */}
          <div className="space-y-1">
            <p>
              <strong>Peserta :</strong> {ticket.name}
            </p>
            <p>
              <strong>Email :</strong> {ticket.email}
            </p>
            <p>
              <strong>ID Tiket :</strong> {ticket.ticketId}
            </p>

            <button className="text-[#E19A35] hover:underline text-sm">
              QR Code tiket
            </button>
          </div>

          {/* RIGHT */}
          <div className="space-y-1">
            <p>
              <strong>Tanggal pembayaran :</strong> {ticket.paymentDate ?? "-"}
            </p>
            <p>
              <strong>Status pembayaran :</strong> {ticket.status ?? "Berhasil"}
            </p>
            <p>
              <strong>ID Pembayaran :</strong> {ticket.paymentId ?? "-"}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}

// ==========================
//   EVENT STATUS (LOGIC)
// ==========================
function getEventStatus(dateString) {
  const today = new Date();
  const parts = dateString.split(" "); // ex: "19 Oktober 2025"
  if (parts.length < 2) return "Akan Mendatang";

  const day = Number(parts[0]);
  const month = convertMonth(parts[1]);
  const year = Number(parts[2] ?? 2025);

  const eventDate = new Date(year, month, day);

  if (eventDate.toDateString() === today.toDateString()) {
    return "Berlangsung";
  }
  if (eventDate > today) {
    return "Akan Mendatang";
  }
  return "Berakhir";
}

// Convert month name → number
function convertMonth(m) {
  const months = {
    Januari: 0,
    Februari: 1,
    Maret: 2,
    April: 3,
    Mei: 4,
    Juni: 5,
    Juli: 6,
    Agustus: 7,
    September: 8,
    Oktober: 9,
    November: 10,
    Desember: 11,
  };
  return months[m] ?? 0;
}
