// src/pages/TicketListPage.jsx
import QRCode from "react-qr-code";

export default function TicketListPage() {
  const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");

  if (!tickets.length) {
    return (
      <p className="text-sm text-gray-600">
        Belum ada tiket. Silakan lakukan pembelian tiket terlebih dahulu.
      </p>
    );
  }

  const latest = tickets[tickets.length - 1];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#222] mb-2">Tiketku</h2>

      <div className="grid lg:grid-cols-[1.6fr,1fr] gap-6 items-start">
        {/* List tiket */}
        <div className="space-y-3">
          {tickets.map((t) => (
            <div
              key={t.ticketId}
              className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-semibold text-[#222]">{t.eventTitle}</p>
                <p className="text-xs text-gray-500">{t.location}</p>
                <p className="text-xs text-gray-500">
                  {t.date} • {t.time}
                </p>
                <p className="text-sm font-semibold mt-1">
                  Rp {t.price.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ID tiket : {t.ticketId} • Status : {t.status}
                </p>
              </div>
              <div className="text-xs text-gray-500 text-right">
                <p>Peserta : {t.name}</p>
                <p>Email : {t.email}</p>
                <p>Metode : {t.method}</p>
              </div>
            </div>
          ))}
        </div>

        {/* QR code terakhir */}
        <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center gap-4">
          <h3 className="text-sm font-semibold text-[#222]">
            QR Code tiket terakhir
          </h3>
          <div className="bg-white p-3 rounded-xl shadow-inner">
            <QRCode
              value={latest.ticketId}
              size={160}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
          <div className="text-xs text-center text-gray-600 space-y-1">
            <p>ID Pembayaran : {latest.paymentId}</p>
            <p>Atas Nama : {latest.name}</p>
            <p>{latest.eventTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
