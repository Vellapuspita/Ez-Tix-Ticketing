export default function AdminDashboard() {
  return (
    <div className="w-full">
      {/* STATS: dari 1 kolom (mobile) -> 3 kolom (lg) */}
      <div className="w-full bg-[#F6B14A] rounded-[22px] sm:rounded-[28px] px-5 sm:px-8 lg:px-10 py-6 sm:py-7 lg:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1 */}
          <div className="flex items-center gap-4">
            <span className="material-icons text-black text-[52px] sm:text-[60px]">
              group
            </span>
            <div>
              <p className="text-sm text-black/80 font-semibold">Total Customer</p>
              <p className="text-3xl font-extrabold text-black">0</p>
            </div>
          </div>

          {/* 2 */}
          <div className="flex items-center gap-4">
            <span className="material-icons text-black text-[52px] sm:text-[60px]">
              confirmation_number
            </span>
            <div>
              <p className="text-sm text-black/80 font-semibold">Total Tiket</p>
              <p className="text-3xl font-extrabold text-black">0</p>
            </div>
          </div>

          {/* 3 */}
          <div className="flex items-center gap-4">
            <span className="material-icons text-black text-[52px] sm:text-[60px]">
              payments
            </span>
            <div>
              <p className="text-sm text-black/80 font-semibold">Jumlah tiket terjual</p>
              <p className="text-3xl font-extrabold text-black">Rp0</p>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR: mobile jadi stack, desktop jadi sejajar */}
      <div className="mt-6 sm:mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <button className="bg-[#F6B14A] hover:bg-[#f0a63e] text-black font-bold px-5 sm:px-6 py-3 rounded-2xl shadow-sm flex items-center justify-center lg:justify-start gap-2 w-full lg:w-auto">
          <span className="material-icons">add</span>
          Buat acara baru
        </button>

        <div className="w-full lg:w-[420px] bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-2">
          <span className="material-icons text-black/60">search</span>
          <input
            className="w-full outline-none text-black placeholder:text-black/40"
            placeholder="search"
          />
        </div>
      </div>

      {/* MAIN PANEL: tinggi adaptif, tetap enak di semua layar */}
      <div className="mt-5 sm:mt-6 bg-white rounded-[22px] sm:rounded-[28px] shadow-sm p-6 sm:p-10 min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-black">
            Yuk buat acara pertama mu
          </p>
          <p className="text-base sm:text-lg text-black/70">
            kelola tiket dengan mudah&nbsp; bersama EZ-TIX!
          </p>
        </div>
      </div>
    </div>
  );
}
