// src/pages/EventListPage.jsx
import { events } from "../data/events";
import { useNavigate } from "react-router-dom";

export default function EventListPage() {
  const navigate = useNavigate();

  const handleBuy = (id) => {
    const token = localStorage.getItem("token");
    if (!token) navigate(`/login?redirect=/events/${id}/checkout`);
    else navigate(`/events/${id}/checkout`);
  };

  return (
    <div className="space-y-6">

      {/* LOCATION */}
      <div className="flex justify-end text-sm text-gray-600 pr-4">
        <div className="text-right">
          <p>Lokasi saat ini</p>
          <p className="flex items-center gap-1">
            <span className="material-icons text-sm">location_on</span> Bali
          </p>
        </div>
      </div>

      {/* MAIN WHITE CONTAINER */}
      <div className="bg-white rounded-t-3xl shadow-md p-8 space-y-8">

        {/* Filter */}
        <div className="w-full flex justify-center mt-2">
        <button className="px-4 py-2 rounded-xl bg-[#FFE37A] text-black font-semibold text-sm shadow flex items-center gap-1">
            Urutkan
            <span className="material-icons text-sm">arrow_drop_down</span>
        </button>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-[#1F1F1F]">
          Jelajahi berbagai konser dan acara menarik di sini
        </h2>

        {/* LIST OF EVENTS */}
        <div className="space-y-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-[#EFEFCC] rounded-2xl shadow-md overflow-hidden flex"
            >
              {/* DATE BOX */}
              <div className="w-40 bg-white p-4 flex flex-col justify-center items-center text-center border-r border-gray-200">
                <img
                  src={ev.banner}
                  alt={ev.title}
                  className="w-full h-20 object-cover rounded-md mb-2"
                />
                <p className="font-extrabold text-black text-lg leading-5">
                  {ev.date.split(" ")[0]} <br />
                  <span className="text-sm">{ev.date.split(" ")[1]}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{ev.time}</p>
              </div>

              {/* INFO */}
              <div className="flex-1 p-6">
                <h3 className="text-xl font-bold text-[#2B2B2B]">{ev.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{ev.location}</p>

                <p className="text-lg font-bold text-green-600 mt-3">
                  Rp {ev.price.toLocaleString("id-ID")}
                </p>
              </div>

              {/* BUTTON */}
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
        </div>

      </div>
    </div>
  );
}
