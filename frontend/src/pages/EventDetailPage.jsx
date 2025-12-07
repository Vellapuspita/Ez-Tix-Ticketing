import { useNavigate, useParams } from "react-router-dom";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: fetch detail dari backend by id
  const event = {
    id,
    title: "Seminar Nasional Blockchain",
    location: "Bali, Denpasar • Dharma Negara Alaya Denpasar",
    dateTime: "27 September 2025 • 09:00 WITA",
    description:
      "Bali Blockchain Summit 2025 adalah sebuah forum internasional yang mempertemukan pemerintah, pelaku industri, akademisi, komunitas teknologi, hingga media dalam satu panggung besar. Acara ini bertujuan mengajak masyarakat melihat potensi blockchain lebih dari sekadar teknologi finansial.",
    ticketsLeft: 100,
    organizer: "Bali Blockchain Center",
    price: "Rp. 100.000",
  };

  return (
    <div className="bg-card rounded-3xl shadow-card overflow-hidden">
      {/* banner */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary to-secondary" />
      {/* content */}
      <div className="p-5 md:p-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">
              {event.title}
            </h1>
            <p className="text-sm text-muted">{event.location}</p>
            <p className="text-sm text-muted">{event.dateTime}</p>
          </div>

          {/* pill tabs dummy */}
          <div className="flex flex-wrap gap-2 text-xs font-medium mt-2">
            <span className="px-3 py-1 rounded-full bg-primary text-white">
              Deskripsi
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary text-dark">
              Tiket tersedia {event.ticketsLeft}
            </span>
            <span className="px-3 py-1 rounded-full bg-body text-dark">
              {event.organizer}
            </span>
          </div>

          <section className="mt-4">
            <h2 className="font-semibold mb-1">Deskripsi</h2>
            <p className="text-sm text-muted leading-relaxed">
              {event.description}
            </p>
          </section>
        </div>

        {/* sidebar price */}
        <aside className="md:w-64 bg-body rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <p className="text-sm text-muted">Mulai dari</p>
            <p className="text-2xl font-semibold text-primary">
              {event.price}
            </p>
          </div>
          <button
            className="mt-4 w-full rounded-full bg-primary text-white py-2.5 font-semibold text-sm"
            onClick={() => navigate(`/checkout/${event.id}`)}
          >
            Beli Sekarang
          </button>
        </aside>
      </div>
    </div>
  );
}
