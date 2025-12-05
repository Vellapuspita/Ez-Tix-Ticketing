// src/pages/DashboardPage.jsx
import { useNavigate } from "react-router-dom";
import { events } from "../data/events";

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleBuy = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/login?redirect=/events/${id}/checkout`);
    } else {
      navigate(`/events/${id}/checkout`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <section className="mb-4">
        <h2 className="text-3xl font-extrabold text-[#1F1F1F]">
          Nikmati pengalaman terbaik mencari dan membeli tiket acara favoritmu
        </h2>
      </section>

      {/* REKOMENDASI ATAS */}
      <section className="grid md:grid-cols-2 gap-4">
        {events.slice(0, 4).map((ev) => (
          <div
            key={ev.id}
            className="bg-[#EFEFCC] rounded-2xl shadow-md overflow-hidden flex"
          >
            {/* Image */}
            <img
              src={ev.banner}
              alt={ev.title}
              className="w-40 h-40 object-cover"
            />

            {/* Info */}
            <div className="flex-1 p-4">
              <h3 className="text-lg font-semibold text-[#2B2B2B]">
                {ev.title}
              </h3>

              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <span className="material-icons text-sm">location_on</span>
                {ev.location}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="material-icons text-sm">calendar_today</span>
                {ev.date}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="material-icons text-sm">access_time</span>
                {ev.time}
              </p>

              <p className="font-bold mt-2">
                Rp {ev.price.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Button area */}
            <div className="flex items-center px-6 bg-[#F0A33F] justify-center">
              <button
                onClick={() => handleBuy(ev.id)}
                className="bg-white px-6 py-2 rounded-md font-semibold text-[#2B2B2B] shadow-md"
              >
                Beli tiket
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* REKOMENDASI BAWAH */}
      <section className="mt-4">
        <h3 className="text-lg font-semibold mb-3">Rekomendasi acara</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="relative rounded-2xl overflow-hidden shadow-md"
            >
              <img
                src={ev.banner}
                alt={ev.title}
                className="w-full h-60 object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />

              <div className="absolute bottom-0 w-full p-4 text-white">
                <h4 className="text-lg font-semibold">{ev.title}</h4>
                <p className="text-sm flex items-center gap-2">
                  <span className="material-icons text-sm">location_on</span>
                  {ev.location}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <span className="material-icons text-sm">calendar_today</span>
                  {ev.date}
                </p>
                <button
                  onClick={() => handleBuy(ev.id)}
                  className="bg-[#F0A33F] text-black w-full py-2 mt-3 rounded-md shadow font-semibold"
                >
                  Beli tiket
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
