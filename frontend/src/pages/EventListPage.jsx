import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { events } from "../data/events";

export default function EventListPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Tanggal");
  const [filterOpen, setFilterOpen] = useState(false);


  return (
    <div className="space-y-8">

      {/* ======================== */}
      {/* TITLE SECTION */}
      {/* ======================== */}
      <div className="flex justify-between items-start">
        <h1 className="text-[32px] font-bold leading-tight">
          Jelajahi berbagai konser <br />
          dan acara menarik disini
        </h1>

        {/* LOKASI SAAT INI */}
        <div className="text-right text-sm leading-tight">
          <p className="text-gray-700">Lokasi saat ini</p>
          <p className="flex items-center justify-end gap-1 font-semibold text-black">
            <span className="material-icons text-base">location_on</span>
            Bali
          </p>
        </div>
      </div>

      {/* ======================== */}
      {/* FILTER DROPDOWN — CENTER */}
      {/* ======================== */}
        <div className="flex justify-center mt-2 mb-6">

          {/* Label */}
          <span className="text-gray-700 font-medium mr-3">Urutkan</span>

          {/* Wrapper (relative) */}
          <div className="relative">

            {/* Button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="bg-[#F4A623] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow"
            >
              {sortBy}
              <span className="material-icons text-sm">expand_more</span>
            </button>

            {/* Dropdown */}
            {filterOpen && (
              <div className="absolute top-[45px] left-0 bg-[#F4A623] text-black rounded-lg shadow px-4 py-2 text-sm font-semibold z-20">

                <button
                  className="block w-full text-left"
                  onClick={() => {
                    setSortBy("Tanggal");
                    setFilterOpen(false);
                  }}
                >
                  Tanggal
                </button>

                <button
                  className="block w-full text-left mt-1"
                  onClick={() => {
                    setSortBy("Lokasi");
                    setFilterOpen(false);
                  }}
                >
                  Lokasi
                </button>

              </div>
            )}

          </div>
        </div>



      {/* ======================== */}
      {/* LIST EVENT */}
      {/* ======================== */}
      <div className="space-y-5">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="grid grid-cols-[160px_1fr_140px] bg-white rounded-2xl shadow overflow-hidden"
          >

            {/* POSTER + DATE */}
            <div className="flex gap-3 p-4">
              <img
                src={ev.image}
                alt={ev.title}
                className="w-24 h-24 object-cover rounded-xl"
              />

              <div className="flex flex-col justify-center leading-tight">
                <p className="text-lg font-bold">{ev.day}</p>
                <p className="text-lg font-bold">{ev.month}</p>
                <p className="text-lg font-bold">{ev.year}</p>

                <p className="text-sm text-gray-700 mt-1">{ev.time}</p>
              </div>
            </div>

            {/* MIDDLE INFO */}
            <div className="flex flex-col justify-center px-6 bg-[#F7F9E8]">
              <h3 className="text-xl font-bold">{ev.title}</h3>
              <p className="text-sm text-gray-600">{ev.location}</p>
              <p className="text-green-600 font-semibold mt-1">{ev.price}</p>
            </div>

            {/* BUTTON */}
            <div className="bg-[#F4A623] flex justify-center items-center">
              <button
                onClick={() => navigate(`/events/${ev.id}`)}
                className="font-semibold text-black"
              >
                Beli tiket
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
