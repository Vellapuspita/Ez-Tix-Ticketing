import { useEffect, useRef, useState } from "react";

export default function AdminQRPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState("Siap"); // Siap | Mengakses kamera... | Aktif
  const [error, setError] = useState("");

  const stopCamera = () => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setStatus("Siap");
  };

  const startCamera = async () => {
    setError("");
    setStatus("Mengakses kamera...");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Browser tidak mendukung getUserMedia.");
      }

      // stop stream lama (kalau ada)
      stopCamera();

      // minta kamera (utamakan belakang di HP)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;

      // tunggu metadata biar siap
      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => resolve();
      });

      await videoRef.current.play();

      setIsScanning(true);
      setStatus("Aktif");
    } catch (err) {
      const name = err?.name || "";
      const msg =
        name === "NotAllowedError"
          ? "Izin kamera ditolak. Klik ikon kamera di address bar lalu pilih Allow."
          : name === "NotFoundError"
          ? "Kamera tidak ditemukan di perangkat ini."
          : name === "NotReadableError"
          ? "Kamera sedang dipakai aplikasi lain (Zoom/Meet/WhatsApp/OBS)."
          : err?.message || "Gagal mengakses kamera.";

      setError(msg);
      setStatus("Siap");
      setIsScanning(false);
    }
  };

  // cleanup saat pindah halaman
  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <p className="text-sm font-bold text-black mb-3">scan qr acara</p>

      <div className="bg-white rounded-[22px] shadow-sm p-6">
        <div className="rounded-2xl overflow-hidden border border-black/10">
          {/* Header */}
          <div className="bg-[#F6B14A] px-5 py-3 flex items-start justify-between gap-4">
            <div>
              <p className="font-extrabold text-black flex items-center gap-2">
                <span className="material-icons text-[18px]">qr_code_scanner</span>
                Scanner QR Code - Check-in
              </p>
              <p className="text-xs text-black/70">
                Posisikan QR Code di dalam frame untuk scan otomatis
              </p>
            </div>

            <span className="text-xs font-bold text-black bg-white/60 px-3 py-1 rounded-full">
              Status: {status}
            </span>
          </div>

          {/* Camera Area */}
          <div className="bg-[#222] h-[360px] sm:h-[420px] relative">
            {/* VIDEO: tampil hanya saat scanning (biar tampilan awal rapi) */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full ${
                isScanning ? "block" : "hidden"
              } object-contain`}
              playsInline
              muted
            />

            {/* Placeholder saat belum scanning */}
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/80 px-4">
                  <span className="material-icons text-[54px] text-white/70">
                    photo_camera
                  </span>
                  <p className="font-bold mt-2">Qr Scanner Siap</p>
                  <p className="text-sm text-white/70">
                    Klik tombol "Mulai Scan" untuk memulai
                  </p>

                  {error && (
                    <div className="mt-3 text-sm text-red-300 max-w-[560px]">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Frame scan */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[260px] h-[260px] rounded-3xl border-2 border-white/60" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={startCamera}
            disabled={status === "Mengakses kamera..."}
            className={`h-[46px] rounded-2xl font-bold flex items-center justify-center gap-2 text-black shadow-sm
              ${
                status === "Mengakses kamera..."
                  ? "bg-[#F6B14A]/60 cursor-not-allowed"
                  : "bg-[#F6B14A] hover:bg-[#f0a63e]"
              }`}
          >
            <span className="material-icons">photo_camera</span>
            Mulai Scan
          </button>

          <button
            onClick={stopCamera}
            className="h-[46px] rounded-2xl font-bold bg-[#E6E6E6] hover:bg-[#dcdcdc] text-black shadow-sm"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}
