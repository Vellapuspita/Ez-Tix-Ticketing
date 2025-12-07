import { useEffect, useState } from "react";

export default function TicketListPage() {
  const [tickets, setTickets] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tickets")) || [];
    setTickets(saved);
  }, []);

  const toggleDetail = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-4"></h1>

      {tickets.length === 0 && (
        <p className="text-gray-500">Belum ada tiket yang dibeli.</p>
      )}

      {tickets.map((t) => (
        <div
          key={t.id}
          className="bg-[#F9FBEF] rounded-2xl shadow overflow-hidden p-4 flex gap-4"
        >
          {/* POSTER + DATE BOX */}
          <div className="w-36 flex flex-col gap-3">
            {/* Poster */}
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 shadow">
              <img
                src={t.eventImage}
                alt={t.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Date */}
            <div className="bg-[#F3F6D9] shadow-inner rounded-lg p-3 leading-tight">
              <p className="text-xl font-bold">{t.day}</p>
              <p className="text-xl font-bold">{t.month}</p>
              <p className="text-xl font-bold">{t.year}</p>

              <p className="text-sm text-gray-700 mt-2">{t.time}</p>
            </div>
          </div>

          {/* MIDDLE CONTENT */}
          <div className="flex-1 border-l pl-6">
            <h2 className="text-2xl font-bold">{t.title}</h2>
            <p className="text-sm text-gray-700">{t.location}</p>

            <p className="text-green-600 font-bold text-lg mt-2">
              Rp. {t.price}
            </p>

            {/* Divider */}
            <hr className="my-3 border-gray-300" />

            {/* Top row: Detail + Status */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleDetail(t.id)}
                className="flex items-center gap-1 text-sm font-semibold"
              >
                Detail
                <span className="material-icons text-base">
                  {openId === t.id ? "expand_less" : "expand_more"}
                </span>
              </button>

              {/* Status badge */}
              <span
                className={`
                  px-4 py-1 text-sm font-semibold rounded-lg
                  ${
                    t.eventStatus === "Berlangsung"
                      ? "bg-[#F4A623] text-black"
                      : t.eventStatus === "Akan Datang"
                      ? "bg-orange-300 text-black"
                      : "bg-red-500 text-white"
                  }
                `}
              >
                {t.eventStatus}
              </span>
            </div>

            {/* DETAIL CONTENT */}
            {openId === t.id && (
              <div className="mt-4 grid grid-cols-2 gap-y-1 text-sm">

                <span className="text-gray-500">Peserta :</span>
                <span className="font-medium">{t.userName}</span>

                <span className="text-gray-500">Email :</span>
                <span className="font-medium">{t.email}</span>

                <span className="text-gray-500">ID tiket :</span>
                <span className="font-medium">{t.ticketId}</span>

                <span className="text-[#F4A623] font-semibold cursor-pointer">
                  QR Code tiket
                </span>
                <span />

                <span className="text-gray-500">Tanggal pembayaran :</span>
                <span className="font-medium">{t.paymentDate}</span>

                <span className="text-gray-500">Status pembayaran :</span>
                <span className="text-green-600 font-semibold">
                  {t.paymentStatus}
                </span>

                <span className="text-gray-500">ID Pembayaran :</span>
                <span className="font-medium">{t.paymentId}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
