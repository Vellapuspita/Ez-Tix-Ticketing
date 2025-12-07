import { useNavigate } from "react-router-dom";
import { events, recommended } from "../data/events";

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 leading-snug">
        Nikmati pengalaman terbaik <br />
        mencari dan membeli tiket{" "}
        <span className="text-primary">acara favoritmu</span>
      </h1>

      {/* GRID EVENT 2×2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex bg-[#FFF8E2] rounded-2xl shadow-md overflow-hidden"
          >
            {/* Poster kiri */}
            <div className="p-4">
              <img
                src={ev.image}
                alt={ev.title}
                className="w-28 h-28 rounded-xl object-cover"
              />
            </div>

            {/* Middle Details */}
            <div className="flex-1 py-4">
              <h3 className="text-lg font-semibold">{ev.title}</h3>

              <div className="mt-2 space-y-1 text-sm">

                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">
                    location_on
                  </span>
                  {ev.location}
                </p>

                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">
                    payments
                  </span>
                  {ev.price}
                </p>

                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">
                    event
                  </span>
                  {ev.date}
                </p>

                <p className="flex items-center gap-2">
                  <span className="material-icons text-gray-600 text-base">
                    schedule
                  </span>
                  {ev.time}
                </p>
              </div>
            </div>

            {/* Button kanan */}
            <div className="flex items-center justify-center bg-[#F4A623] px-6">
              <button
                onClick={() => navigate(`/events/${ev.id}`)}
                className="font-semibold text-black whitespace-nowrap"
              >
                Beli tiket
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rekomendasi acara */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Rekomendasi acara</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommended.map((rec) => (
          <div
            key={rec.id}
            className="relative rounded-2xl shadow-lg overflow-hidden cursor-pointer"
            onClick={() => navigate(`/events/${rec.id}`)}
          >
            <img
              src={rec.image}
              alt={rec.title}
              className="w-full h-56 object-cover"
            />

            {/* Overlay */}
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/85 to-transparent text-white">
              <h3 className="text-lg font-semibold">{rec.title}</h3>

              <div className="text-xs opacity-90 space-y-1 mt-1">
                <p>{rec.location}</p>
                <p>{rec.date}</p>
              </div>

              <button className="w-full bg-[#F4A623] text-black font-semibold py-2 rounded-xl mt-3">
                Beli tiket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
