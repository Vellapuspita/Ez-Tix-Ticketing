import { useEffect, useMemo, useState } from "react";
import { rupiah } from "../../data/adminDummy";
import { ConfirmDialog, Modal, Pagination, Toast } from "../../components/admin/AdminUI";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import api from "../../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

    const imgUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    const base = (api.defaults.baseURL || "").replace("/api", "");
    return `${base}${path}`;
  };


  // ====== DATA ======
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);

  // ====== UI STATE ======
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState("create"); // create | edit
  const [selected, setSelected] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [toast, setToast] = useState({ open: false, text: "" });

  // loading/error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // saving/deleting state
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getAdminAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      // stats/global butuh admin token :contentReference[oaicite:7]{index=7}
      const statsReq = api.get("/stats/global", { headers: getAdminAuthHeaders() });

      // events/all public (untuk list acara) :contentReference[oaicite:8]{index=8}
      const eventsReq = api.get("/events/all");

      const [statsRes, eventsRes] = await Promise.all([statsReq, eventsReq]);

      setStats(statsRes.data);
      setEvents(eventsRes.data?.events || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Gagal memuat dashboard admin.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ✅ FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // 🔎 FILTER + PAGINATION
  // =========================
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return events;

    return events.filter((e) => {
      const name = (e.namaEvent || "").toLowerCase();
      const loc = (e.lokasi || "").toLowerCase();
      const org = (e.penyelenggara || "").toLowerCase();
      return name.includes(s) || loc.includes(s) || org.includes(s);
    });
  }, [events, q]);

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // =========================
  // ✅ HEADER STATS (REAL)
  // =========================
  const totalCustomer = stats?.totalCustomer || 0;
  const totalTicket = stats?.totalTiket || 0;
  const revenue = stats?.totalPendapatan || 0;

  // =========================
  // MODAL ACTIONS
  // =========================
  const openCreate = () => {
    setFormMode("create");
    setSelected(null);
    setOpenForm(true);
  };

  const openEdit = (ev) => {
    setFormMode("edit");
    setSelected(ev);
    setOpenForm(true);
  };

  const askDelete = (ev) => {
    setSelected(ev);
    setOpenDelete(true);
  };

  // =========================
  // ✅ CREATE / UPDATE via API
  // =========================
  const handleSave = async (payload) => {
    try {
      setSaving(true);

      // backend pakai upload.single("gambar") :contentReference[oaicite:9]{index=9}
      // dan kalau tidak upload file, bisa kirim "gambar" string :contentReference[oaicite:10]{index=10}
      const fd = new FormData();
      fd.append("namaEvent", payload.namaEvent || "");
      fd.append("deskripsi", payload.deskripsi || "");
      fd.append("tanggal", payload.tanggal || "");
      fd.append("waktu", payload.waktu || "");
      fd.append("lokasi", payload.lokasi || "");
      fd.append("penyelenggara", payload.penyelenggara || "");
      fd.append("kapasitas", String(payload.kapasitas ?? 0));
      fd.append("hargaTiket", String(payload.hargaTiket ?? 0));

      // kalau user pilih file -> kirim file
      if (payload.posterFile) {
        fd.append("gambar", payload.posterFile);
      } else if (payload.gambar) {
        // kalau tidak ada file, kirim url string "gambar"
        fd.append("gambar", payload.gambar);
      }

      const headers = {
  ...getAdminAuthHeaders(),
};


      if (formMode === "create") {
        // POST /events :contentReference[oaicite:11]{index=11}
        const res = await api.post("/events", fd, { headers });
        const created = res.data?.event;

        if (created) {
          setEvents((prev) => [created, ...prev]);
        } else {
          // fallback: refresh kalau response beda format
          await fetchDashboard();
        }

        setToast({ open: true, text: "Acara berhasil dibuat" });
      } else {
        const id = selected?._id;
        if (!id) throw new Error("ID event tidak ditemukan untuk edit.");

        // PUT /events/:id :contentReference[oaicite:12]{index=12}
        const res = await api.put(`/events/${id}`, fd, { headers });
        const updated = res.data?.event;

        if (updated) {
          setEvents((prev) => prev.map((e) => (e._id === id ? updated : e)));
        } else {
          await fetchDashboard();
        }

        setToast({ open: true, text: "Acara berhasil diperbarui" });
      }

      setOpenForm(false);

      // optional: refresh stats biar header ikut berubah kalau ada perubahan kapasitas/harga, dll.
      await fetchDashboard();
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        text: err?.response?.data?.message || err?.message || "Gagal menyimpan acara.",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // ✅ DELETE via API
  // =========================
  const handleDelete = async () => {
    try {
      setDeleting(true);

      const id = selected?._id;
      if (!id) throw new Error("ID event tidak ditemukan untuk hapus.");

      // DELETE /events/:id :contentReference[oaicite:13]{index=13}
      await api.delete(`/events/${id}`, { headers: getAdminAuthHeaders() });

      setEvents((prev) => prev.filter((e) => e._id !== id));
      setOpenDelete(false);
      setToast({ open: true, text: "Acara berhasil dihapus" });

      await fetchDashboard();
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        text: err?.response?.data?.message || err?.message || "Gagal menghapus acara.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <Toast open={toast.open} text={toast.text} onClose={() => setToast({ open: false, text: "" })} />

      {/* LOADING / ERROR */}
      {loading && (
        <div className="min-h-[240px] flex items-center justify-center">
          <p className="font-bold text-black">Memuat dashboard...</p>
        </div>
      )}

      {!loading && error && (
        <div className="min-h-[240px] flex flex-col items-center justify-center gap-3">
          <p className="font-bold text-red-600">{error}</p>
          <button
            onClick={fetchDashboard}
            className="px-5 py-2 rounded-xl bg-black text-white font-bold"
          >
            Coba lagi
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* STATS */}
          <div className="w-full bg-[#F6B14A] rounded-[22px] sm:rounded-[28px] px-5 sm:px-8 lg:px-10 py-6 sm:py-7 lg:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <span className="material-icons text-black text-[52px] sm:text-[60px]">group</span>
                <div>
                  <p className="text-sm text-black/80 font-semibold">Total Customer</p>
                  <p className="text-3xl font-extrabold text-black">{totalCustomer}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="material-icons text-black text-[52px] sm:text-[60px]">confirmation_number</span>
                <div>
                  <p className="text-sm text-black/80 font-semibold">Total Tiket</p>
                  <p className="text-3xl font-extrabold text-black">{totalTicket}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="material-icons text-black text-[52px] sm:text-[60px]">payments</span>
                <div>
                  <p className="text-sm text-black/80 font-semibold">Jumlah tiket terjual</p>
                  <p className="text-3xl font-extrabold text-black">{rupiah(revenue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="mt-6 sm:mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <button
              onClick={openCreate}
              className="bg-[#F6B14A] hover:bg-[#f0a63e] text-black font-bold px-5 sm:px-6 py-3 rounded-2xl shadow-sm flex items-center justify-center lg:justify-start gap-2 w-full lg:w-auto"
            >
              <span className="material-icons">add</span>
              Buat acara baru
            </button>

            <div className="w-full lg:w-[420px] bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-2">
              <span className="material-icons text-black/60">search</span>
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="w-full outline-none text-black placeholder:text-black/40"
                placeholder="search"
              />
            </div>
          </div>

          {/* LIST / EMPTY */}
          <div className="mt-5 sm:mt-6 bg-white rounded-[22px] sm:rounded-[28px] shadow-sm p-5 sm:p-8">
            {filtered.length === 0 ? (
              <div className="min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-extrabold text-black">Yuk buat acara pertama mu</p>
                  <p className="text-base sm:text-lg text-black/70">kelola tiket dengan mudah&nbsp; bersama EZ-TIX!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {paged.map((ev) => (
                  <div
                    key={ev._id}
                    className="bg-[#EEF0E3] rounded-2xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center"
                  >
                    {/* IMAGE */}
                    <div className="w-full lg:w-[150px] h-[110px] rounded-xl overflow-hidden bg-white shrink-0">
                      <img src={imgUrl(ev.gambar)} alt={ev.namaEvent} className="w-full h-full object-cover" />

                    </div>

                    <div className="flex-1">
                      <p className="font-extrabold text-black">{ev.namaEvent}</p>

                      <div className="mt-1 text-sm text-black/70 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-[16px]">location_on</span>
                          <span>{ev.lokasi}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="material-icons text-[16px]">person</span>
                          <span>{ev.penyelenggara || "-"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="material-icons text-[16px]">event</span>
                          <span>{formatTanggal(ev.tanggal)}</span>

                        </div>

                        <div className="flex items-center gap-2">
                          <span className="material-icons text-[16px]">confirmation_number</span>
                          <span>{ev.kapasitas} Tiket Tersedia</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="material-icons text-[16px]">schedule</span>
                          <span>{ev.waktu}</span>
                        </div>
                      </div>

                      <p className="mt-2 text-green-700 font-extrabold text-sm">{rupiah(ev.hargaTiket)}</p>
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(ev)}
                          className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 flex items-center gap-1"
                        >
                          <span className="material-icons text-[18px]">edit</span> Edit
                        </button>

                        <button
                          onClick={() => askDelete(ev)}
                          className="px-3 py-2 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 flex items-center gap-1"
                        >
                          <span className="material-icons text-[18px]">delete</span> Hapus acara
                        </button>
                      </div>

                      {/* QR */}
                      <div className="w-[90px] h-[90px] bg-white rounded-xl flex items-center justify-center shrink-0">
                        <div className="w-[74px] h-[74px] rounded-lg overflow-hidden bg-white grid place-items-center border border-black/10">
                          <QRCodeCanvas
                            value={`${window.location.origin}/events/${ev._id}`}
                            size={64}
                            includeMargin={false}
                            style={{ display: "block" }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/admin/stats/${ev._id}`)}
                        className="px-5 py-2 rounded-xl bg-[#F6B14A] text-black font-extrabold hover:bg-[#f0a63e]"
                      >
                        Cek detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />

          {/* FORM MODAL */}
          <EventFormModal
            open={openForm}
            mode={formMode}
            initial={selected}
            onClose={() => setOpenForm(false)}
            onSave={handleSave}
            saving={saving}
          />

          {/* DELETE CONFIRM */}
          <ConfirmDialog
            open={openDelete}
            title="Pop Up Pilihan"
            message={deleting ? "Menghapus..." : "Anda mau menghapus acara ini?"}
            onYes={handleDelete}
            onNo={() => (deleting ? null : setOpenDelete(false))}
          />
        </>
      )}
    </div>
  );
  
}

function EventFormModal({ open, mode, initial, onClose, onSave, saving }) {

    const imgUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    // ambil baseURL dari axios (http://localhost:4000)
    const base = (api.defaults.baseURL || "").replace("/api", "");
    return `${base}${path}`;
  };


  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(initial?.gambar || "");

  const [namaEvent, setNamaEvent] = useState(initial?.namaEvent || "");
  const [deskripsi, setDeskripsi] = useState(initial?.deskripsi || "");
  const [tanggal, setTanggal] = useState(initial?.tanggal || "");
  const [waktu, setWaktu] = useState(initial?.waktu || "");
  const [lokasi, setLokasi] = useState(initial?.lokasi || "");
  const [penyelenggara, setPenyelenggara] = useState(initial?.penyelenggara || "");
  const [kapasitas, setKapasitas] = useState(initial?.kapasitas || 0);
  const [hargaTiket, setHargaTiket] = useState(initial?.hargaTiket || 0);

  useEffect(() => {
    if (!open) return;

    setPosterFile(null);
    setPosterPreview(initial?.gambar || "");

    setNamaEvent(initial?.namaEvent || "");
    setDeskripsi(initial?.deskripsi || "");
    setTanggal(initial?.tanggal || "");
    setWaktu(initial?.waktu || "");
    setLokasi(initial?.lokasi || "");
    setPenyelenggara(initial?.penyelenggara || "");
    setKapasitas(initial?.kapasitas || 0);
    setHargaTiket(initial?.hargaTiket || 0);
  }, [open, initial]);

  const submit = (e) => {
    e.preventDefault();

    onSave({
      namaEvent,
      deskripsi,
      tanggal,
      waktu,
      lokasi,
      penyelenggara,
      kapasitas: Number(kapasitas),
      hargaTiket: Number(hargaTiket),
      // kalau tidak pilih file, tetap kirim gambar string (url) supaya backend bisa pakai req.body.gambar :contentReference[oaicite:14]{index=14}
      gambar:
        posterPreview ||
        initial?.gambar ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      posterFile,
    });
  };

  return (
    <Modal
      open={open}
      onClose={saving ? () => null : onClose}
      title={mode === "create" ? "Buat acara" : "Edit acara"}
      widthClass="max-w-[860px]"
    >
      <div className="max-h-[78vh] overflow-y-auto pr-1">
        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left upload box */}
          <div className="bg-[#F6F6F8] rounded-2xl px-4 pt-4 pb-3 flex flex-col gap-2 border border-black/10 self-start">
            <div className="w-full aspect-[4/3] max-h-[190px] rounded-xl bg-white border border-black/10 flex items-center justify-center overflow-hidden">
              {posterPreview ? (
                <img
  src={posterPreview?.startsWith("blob:") ? posterPreview : imgUrl(posterPreview)}
  alt="Poster preview"
  className="w-full h-full object-cover"
/>

              ) : (
                <div className="flex flex-col items-center gap-1 text-black/60">
                  <span className="material-icons text-[44px]">image</span>
                  <p className="font-semibold text-[12px]">Upload poster</p>
                </div>
              )}
            </div>

            <label className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-black/10 shadow-sm cursor-pointer hover:bg-black/5 text-xs font-semibold">
              <span className="material-icons text-[16px]">upload</span>
              Pilih file poster
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={saving}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (!f.type.startsWith("image/")) return;

                  if (posterPreview?.startsWith("blob:")) URL.revokeObjectURL(posterPreview);

                  setPosterFile(f);
                  setPosterPreview(URL.createObjectURL(f));
                }}
              />
            </label>

            <div className="flex items-center justify-between text-[11px] leading-none mt-1">
              <p className="text-black/60">PNG/JPG, maks 5MB</p>
              <span
                className={`inline-flex items-center gap-1 px-2 py-[2px] rounded-md font-bold ${
                  posterFile ? "bg-[#EEF0E3] text-black" : "bg-black/5 text-black/50"
                }`}
              >
                <span className="material-icons text-[13px]">{posterFile ? "check_box" : "check_box_outline_blank"}</span>
                {posterFile ? "ok" : "belum"}
              </span>
            </div>
          </div>

          {/* Right form */}
          <div className="space-y-2">
            <Field label="Nama acara" value={namaEvent} onChange={setNamaEvent} disabled={saving} />
            <Field label="Penyelenggara" value={penyelenggara} onChange={setPenyelenggara} disabled={saving} />
            <TextAreaField label="Deskripsi acara" value={deskripsi} onChange={setDeskripsi} disabled={saving} />
            <Field label="Tanggal acara" value={tanggal} onChange={setTanggal} type="date" disabled={saving} />
            <Field label="Waktu acara" value={waktu} onChange={setWaktu} type="time" disabled={saving} />
            <Field label="Lokasi acara" value={lokasi} onChange={setLokasi} disabled={saving} />
            <Field label="Kapasitas peserta" value={kapasitas} onChange={setKapasitas} type="number" disabled={saving} />
            <Field label="Harga tiket" value={hargaTiket} onChange={setHargaTiket} type="number" disabled={saving} />

            <div className="pt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 rounded-2xl bg-black/5 font-bold text-sm disabled:opacity-60"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-2xl bg-[#F6B14A] font-extrabold hover:bg-[#f0a63e] text-sm disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function Field({ label, value, onChange, type = "text", disabled = false }) {
  return (
    <div>
      <p className="text-[13px] font-bold text-black mb-1">{label}</p>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white rounded-xl px-4 py-2.5 outline-none border border-black/10 shadow-sm text-sm disabled:opacity-60"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, disabled = false }) {
  return (
    <div>
      <p className="text-[13px] font-bold text-black mb-1">{label}</p>
      <textarea
        rows={3}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white rounded-xl px-4 py-2.5 outline-none border border-black/10 shadow-sm resize-none text-sm disabled:opacity-60"
        placeholder="Tulis deskripsi acara..."
      />
    </div>
  );
}

const formatTanggal = (dateLike) => {
  if (!dateLike) return "-";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return String(dateLike);

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

