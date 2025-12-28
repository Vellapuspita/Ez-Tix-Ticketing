import { useMemo, useState } from "react";
import { dummyEvents, rupiah, totalRevenue } from "../../data/adminDummy";
import { ConfirmDialog, Modal, Pagination, Toast } from "../../components/admin/AdminUI";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [events, setEvents] = useState(dummyEvents);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // modal state
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState("create"); // create | edit
  const [selected, setSelected] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);

  // toast
  const [toast, setToast] = useState({ open: false, text: "" });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return events;
    return events.filter((e) => e.title.toLowerCase().includes(s) || e.organizer.toLowerCase().includes(s));
  }, [events, q]);

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totalCustomer = 20; // dummy (samakan figma)
  const totalTicket = events.reduce((acc, e) => acc + e.quota, 0);
  const revenue = totalRevenue(events);

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

  const handleSave = (payload) => {
    if (formMode === "create") {
      const newEv = { ...payload, id: "ev" + Date.now(), sold: 0, visitors: 0 };
      setEvents((prev) => [newEv, ...prev]);
      setToast({ open: true, text: "Acara baru telah berhasil dibuat" });
    } else {
      setEvents((prev) => prev.map((e) => (e.id === selected.id ? { ...e, ...payload } : e)));
      setToast({ open: true, text: "Acara telah di perbarui" });
    }
    setOpenForm(false);
  };

  const handleDelete = () => {
    setEvents((prev) => prev.filter((e) => e.id !== selected.id));
    setOpenDelete(false);
    setToast({ open: true, text: "Acara berhasil dihapus" });
  };

  return (
    <div className="w-full">
      <Toast open={toast.open} text={toast.text} onClose={() => setToast({ open: false, text: "" })} />

      {/* STATS (punyamu) */}
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

      {/* ACTION BAR (punyamu) */}
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
              <div key={ev.id} className="bg-[#EEF0E3] rounded-2xl p-4 flex flex-col lg:flex-row gap-4">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full lg:w-[150px] h-[110px] rounded-xl object-cover"
                />

                <div className="flex-1">
                  <p className="font-extrabold text-black">{ev.title}</p>
                  <div className="mt-1 text-sm text-black/70 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[16px]">location_on</span>
                      <span>{ev.organizer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[16px]">event</span>
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[16px]">confirmation_number</span>
                      <span>{ev.quota} Tiket Tersedia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-[16px]">schedule</span>
                      <span>{ev.time}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-green-700 font-extrabold text-sm">{rupiah(ev.price)}</p>
                </div>

                {/* Right actions + QR mock */}
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

                  <div className="w-[90px] h-[90px] bg-white rounded-xl flex items-center justify-center">
                    <div className="w-[70px] h-[70px] border-2 border-black/20 rounded-lg grid place-items-center text-xs font-bold">
                      QR
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/admin/stats/${ev.id}`)}
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
      />

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={openDelete}
        title="Pop Up Pilihan"
        message="Anda mau menghapus acara ini?"
        onYes={handleDelete}
        onNo={() => setOpenDelete(false)}
      />
    </div>
  );
}

function EventFormModal({ open, mode, initial, onClose, onSave }) {
  const [img, setImg] = useState(initial?.image || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [date, setDate] = useState(initial?.date || "");
  const [time, setTime] = useState(initial?.time || "");
  const [organizer, setOrganizer] = useState(initial?.organizer || "");
  const [quota, setQuota] = useState(initial?.quota || 0);
  const [price, setPrice] = useState(initial?.price || 0);

  // reset saat buka modal
  useMemo(() => {
    if (!open) return null;
    setImg(initial?.image || "");
    setTitle(initial?.title || "");
    setDate(initial?.date || "");
    setTime(initial?.time || "");
    setOrganizer(initial?.organizer || "");
    setQuota(initial?.quota || 0);
    setPrice(initial?.price || 0);
    return null;
  }, [open, initial]);

  const submit = (e) => {
    e.preventDefault();
    onSave({
      image:
        img ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      title,
      date,
      time,
      organizer,
      quota: Number(quota),
      price: Number(price),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Buat acara" : "Edit acara"}
      widthClass="max-w-[820px]"
    >
      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left upload box */}
        <div className="bg-[#F6F6F8] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-black/10">
          <span className="material-icons text-[96px] text-black/70">image</span>
          <p className="font-bold text-black">Upload poster</p>
          <input
            value={img}
            onChange={(e) => setImg(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-3 outline-none border border-black/10"
            placeholder="Tempel URL gambar (dummy)"
          />
          <div className="self-end mt-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#EEF0E3] text-sm font-bold">
              <span className="material-icons text-[18px]">check_box</span> ok
            </span>
          </div>
        </div>

        {/* Right form */}
        <div className="space-y-3">
          <Field label="Nama acara" value={title} onChange={setTitle} />
          <Field label="Hari dan tanggal" value={date} onChange={setDate} />
          <Field label="Waktu" value={time} onChange={setTime} />
          <Field label="Lokasi" value={organizer} onChange={setOrganizer} />
          <Field label="Kuota Peserta" value={quota} onChange={setQuota} type="number" />
          <Field label="Harga tiket" value={price} onChange={setPrice} type="number" />

          <div className="pt-2 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl bg-black/5 font-bold">
              Batal
            </button>
            <button type="submit" className="px-6 py-3 rounded-2xl bg-[#F6B14A] font-extrabold hover:bg-[#f0a63e]">
              Simpan
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <p className="text-sm font-bold text-black mb-1">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white rounded-xl px-4 py-3 outline-none border border-black/10 shadow-sm"
      />
    </div>
  );
}
