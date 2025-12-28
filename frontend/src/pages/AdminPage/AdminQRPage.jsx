import { useState } from "react";
import { Modal } from "../../components/admin/AdminUI";

export default function AdminQRPage() {
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");

  const start = () => {
    setScanning(true);
    setResult("");
    // dummy "scan"
    setTimeout(() => {
      setResult("QR terbaca: TICKET-12335646443");
      setScanning(false);
    }, 1200);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-[22px] sm:rounded-[28px] shadow-sm p-6">
        <p className="font-extrabold text-black text-lg">scan qr acara</p>

        <div className="mt-4 rounded-2xl overflow-hidden border border-black/10">
          <div className="bg-[#F6B14A] px-4 py-3">
            <p className="font-extrabold text-black flex items-center gap-2">
              <span className="material-icons">qr_code_scanner</span> Scanner QR Code - Check-in
            </p>
            <p className="text-xs text-black/70">Posisikan QR Code di dalam frame untuk scan otomatis</p>
          </div>

          <div className="bg-[#222] h-[320px] flex items-center justify-center">
            <div className="text-center text-white/80">
              <span className="material-icons text-[72px]">photo_camera</span>
              <p className="font-bold">Qr Scanner Siap</p>
              <p className="text-sm">Klik tombol "Mulai Scan" untuk memulai</p>
              {result && <p className="mt-3 font-extrabold text-white">{result}</p>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => {
              setOpen(true);
              start();
            }}
            className="flex-1 bg-[#F6B14A] hover:bg-[#f0a63e] text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <span className="material-icons">photo_camera</span>
            Mulai Scan
          </button>

          <button
            onClick={() => {
              setScanning(false);
              setResult("");
            }}
            className="flex-1 bg-black/10 hover:bg-black/15 text-black font-extrabold py-3 rounded-xl"
          >
            Batalkan
          </button>
        </div>
      </div>

      <Modal open={open} title="Scanner" onClose={() => setOpen(false)} widthClass="max-w-[740px]">
        <div className="rounded-2xl overflow-hidden border border-black/10">
          <div className="bg-[#F6B14A] px-4 py-3">
            <p className="font-extrabold text-black">Scanner QR Code - Check-in</p>
            <p className="text-xs text-black/70">Posisikan QR Code di dalam frame</p>
          </div>
          <div className="bg-[#222] h-[320px] flex items-center justify-center">
            <div className="text-center text-white/80">
              <span className="material-icons text-[72px]">photo_camera</span>
              <p className="font-bold">{scanning ? "Scanning..." : "Selesai"}</p>
              <p className="text-sm">{scanning ? "Tunggu sebentar" : result || "Belum ada hasil"}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3 justify-end">
          <button
            onClick={start}
            className="px-6 py-3 rounded-2xl bg-[#F6B14A] font-extrabold hover:bg-[#f0a63e]"
          >
            Mulai Scan
          </button>
          <button onClick={() => setOpen(false)} className="px-6 py-3 rounded-2xl bg-black/10 font-bold">
            Tutup
          </button>
        </div>
      </Modal>
    </div>
  );
}
