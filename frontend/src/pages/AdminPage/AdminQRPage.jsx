// AdminQRPage.jsx
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import adminAxios from "../../utils/api";
// === AUDIO CONTEXT GLOBAL ===
let audioCtx = null;


export default function AdminQRPage() {
  const videoRef = useRef(null);

  // Inisialisasi AudioContext saat user klik tombol
const initAudio = () => {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
};

  const streamRef = useRef(null);

  const rafRef = useRef(null);
  const canvasRef = useRef(null);

  const isDecodingRef = useRef(false);
  const lastTicketIdRef = useRef("");
  const lastScanAtRef = useRef(0);

  const [isScanning, setIsScanning] = useState(false);

  // UI state
  const [status, setStatus] = useState("Siap"); // Siap | Mengakses kamera... | Aktif | Memproses...
  const [error, setError] = useState("");
  const [frameState, setFrameState] = useState("idle"); // idle | detected | success | error
  const [lastResult, setLastResult] = useState(null); // { ok, message, data }
  const [rawText, setRawText] = useState("");

  // =========================
  // Utils
  // =========================
const beep = (type = "success") => {
  try {
    if (!audioCtx) return;

    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    o.type = "sine";
    o.frequency.value = type === "success" ? 880 : 220;

    // ⬇️ Volume lebih besar untuk error
    g.gain.value = type === "success" ? 0.5 : 1.2;

    o.connect(g);
    g.connect(audioCtx.destination);

    o.start();
    o.stop(audioCtx.currentTime + 0.25);
  } catch (e) {
  console.warn(e);
}
}

  const stopLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    isDecodingRef.current = false;
  };

  const stopCamera = () => {
    stopLoop();

    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause?.();
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setStatus("Siap");
    setFrameState("idle");
  };

  const extractTicketId = (data) => {
    const raw = String(data || "").trim();
    if (!raw) return { raw, ticketId: "" };

    // contoh QR berisi URL
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      // ambil segmen terakhir path sebagai ID
      const clean = raw.split("?")[0].replace(/\/+$/, "");
      const parts = clean.split("/");
      return { raw, ticketId: parts[parts.length - 1] || "" };
    }

    // contoh QR berisi JSON {"ticketId":"..."}
    if (raw.startsWith("{") && raw.endsWith("}")) {
      try {
        const obj = JSON.parse(raw);
        if (obj?.ticketId) return { raw, ticketId: String(obj.ticketId).trim() };
      } catch {
        // ignore
      }
    }

    // default: asumsikan langsung ticketId
    return { raw, ticketId: raw };
  };

  // =========================
  // Decode loop
  // =========================
  const scanLoop = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // pastiin video sudah ready
    if (video.readyState < 2) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    // bikin canvas sekali
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    // ambil frame video
    const vw = video.videoWidth || 0;
    const vh = video.videoHeight || 0;
    if (!vw || !vh) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    // canvas size sesuai video
    canvas.width = vw;
    canvas.height = vh;
    ctx.drawImage(video, 0, 0, vw, vh);

    // crop area tengah biar lebih stabil
    const cropW = Math.floor(vw * 0.7);
    const cropH = Math.floor(vh * 0.7);
    const sx = Math.floor((vw - cropW) / 2);
    const sy = Math.floor((vh - cropH) / 2);

    const imageData = ctx.getImageData(sx, sy, cropW, cropH);

    const code = jsQR(imageData.data, cropW, cropH, {
      inversionAttempts: "attemptBoth",
    });

    if (code?.data) {
      const { raw, ticketId } = extractTicketId(code.data);
      setRawText(raw);

      // frame ketemu QR
      setFrameState("detected");

      // throttling + hindari scan berulang untuk QR sama
      const now = Date.now();
      const minGapMs = 1200;

      const sameAsLast = ticketId && ticketId === lastTicketIdRef.current;
      const tooFast = now - lastScanAtRef.current < minGapMs;

      // kalau decoding sedang proses, jangan tumpuk
      if (!ticketId || isDecodingRef.current || sameAsLast || tooFast) {
        rafRef.current = requestAnimationFrame(scanLoop);
        return;
      }

      // lock decode
      isDecodingRef.current = true;
      lastTicketIdRef.current = ticketId;
      lastScanAtRef.current = now;

      setStatus("Memproses...");

      try {
        const res = await adminAxios.post("/checkin/scan", { ticketId });

        setLastResult({
          ok: true,
          message: res?.data?.message || "Check-in berhasil",
          data: res?.data?.data || null,
        });

        setFrameState("success");
        beep("success");

        // setelah sukses, kasih jeda sedikit sebelum lanjut scan lagi
        setTimeout(() => {
          isDecodingRef.current = false;
          setStatus("Aktif");
          setFrameState("idle");
          rafRef.current = requestAnimationFrame(scanLoop);
        }, 900);

        return; // stop di sini karena kita restart loop di timeout
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          "Gagal check-in. QR valid tapi server menolak.";

        setLastResult({ ok: false, message: msg, data: err?.response?.data || null });
        setFrameState("error");
        beep("error");

        // unlock setelah jeda, biar bisa scan lagi (termasuk QR sama)
        setTimeout(() => {
          isDecodingRef.current = false;
          lastTicketIdRef.current = ""; // reset agar bisa scan QR yang sama ulang
          setStatus("Aktif");
          setFrameState("idle");
          rafRef.current = requestAnimationFrame(scanLoop);
        }, 1200);

        return;
      }
    }

    // tidak ada QR
    if (!isDecodingRef.current) setFrameState("idle");
    rafRef.current = requestAnimationFrame(scanLoop);
  };

  // =========================
  // Camera control
  // =========================
  const startCamera = async () => {
    initAudio();   // 🔊 aktifkan audio
    setError("");
    setLastResult(null);
    setRawText("");
    setStatus("Mengakses kamera...");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Browser tidak mendukung getUserMedia.");
      }

      stopCamera();

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

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => resolve();
      });

      await videoRef.current.play();

      setIsScanning(true);
      setStatus("Aktif");
      setFrameState("idle");

      // start loop
      stopLoop();
      rafRef.current = requestAnimationFrame(scanLoop);
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
      setFrameState("idle");
    }
  };

  // cleanup saat pindah halaman
  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frameBorder =
    frameState === "success"
      ? "border-green-400"
      : frameState === "error"
      ? "border-red-400"
      : frameState === "detected"
      ? "border-yellow-400"
      : "border-white/60";

  const frameGlow =
    frameState === "success"
      ? "shadow-[0_0_0_6px_rgba(34,197,94,0.20)]"
      : frameState === "error"
      ? "shadow-[0_0_0_6px_rgba(239,68,68,0.20)]"
      : frameState === "detected"
      ? "shadow-[0_0_0_6px_rgba(234,179,8,0.18)]"
      : "";

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
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full ${
                isScanning ? "block" : "hidden"
              } object-contain`}
              playsInline
              muted
            />

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
              <div
                className={`w-[260px] h-[260px] rounded-3xl border-2 ${frameBorder} ${frameGlow} transition-all duration-200`}
              />
            </div>

            {/* Result overlay */}
            {lastResult && (
              <div className="absolute left-4 right-4 bottom-4">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm border ${
                    lastResult.ok
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <p className="font-bold">
                    {lastResult.ok ? "Berhasil" : "Gagal"}: {lastResult.message}
                  </p>

                  {lastResult?.data?.ticketId && (
                    <p className="text-xs mt-1">
                      Ticket: <span className="font-mono">{String(lastResult.data.ticketId)}</span>
                    </p>
                  )}
                  {lastResult?.data?.email && (
                    <p className="text-xs">
                      Email: <span className="font-mono">{String(lastResult.data.email)}</span>
                    </p>
                  )}
                  {lastResult?.data?.checkInTime && (
                    <p className="text-xs">
                      Waktu:{" "}
                      <span className="font-mono">
                        {new Date(lastResult.data.checkInTime).toLocaleString("id-ID")}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Debug RAW QR (opsional, boleh hapus kalau sudah stabil) */}
        {rawText && (
          <div className="mt-4 rounded-2xl bg-black/5 border border-black/10 p-3">
            <p className="text-xs text-black/60 font-bold mb-1">RAW QR</p>
            <p className="text-xs font-mono break-all text-black">{rawText}</p>
          </div>
        )}

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
