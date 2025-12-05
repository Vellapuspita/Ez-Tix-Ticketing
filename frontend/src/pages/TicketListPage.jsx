// src/pages/TicketListPage.jsx
import QRCode from "react-qr-code";

export default function TicketListPage() {
  const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");

  if (!tickets.length) {
    return <p className="text-sm text-slate-600">Belum ada tiket. Yuk beli tiket dulu!</p>;
  }

  const latest = tickets[tickets.length - 1];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Tiketku</h2>

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-6">
        {/* TICKET LIST */}
        <div className="space-y-3">
          {tickets.map((t) => (
            <div
              key={t.ticketId}
              className="bg-white rounded-2xl shadow p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">{t.eventTitle}</p>
                <p className="text-xs text-slate-500">{t.location}</p>
                <p className="text-xs text-slate-500">
                  {t.date} • {t.time}
                </p>
                <p className="text-sm font-semibold mt-1">
                  Rp {t.price.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ID tiket : {t.ticketId} • Status pembayaran : {t.status}
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>Peserta : {t.name}</p>
                <p>Email : {t.email}</p>
              </div>
            </div>
          ))}
        </div>

        {/* QR CODE DETAIL */}
        <div className="bg-white rounded-2xl shadow p-5 space-y-4 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-800">QR Code tiket</h3>
          <QRCode
            value={latest.ticketId}
            size={160}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
          <div className="text-xs text-center text-slate-600 space-y-1">
            <p>ID Pembayaran : {latest.paymentId}</p>
            <p>
              Atas Nama: <span className="font-semibold">{latest.name}</span>
            </p>
            <p>{latest.eventTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
