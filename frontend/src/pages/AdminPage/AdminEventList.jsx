import { Link } from "react-router-dom";

export default function AdminEventList() {
  const events = [
    { id: 1, title: "Event 1", date: "2025-10-01", location: "Venue 1" },
    { id: 2, title: "Event 2", date: "2025-10-05", location: "Venue 2" },
  ];

  return (
    <div>
      <h2>Manage Events</h2>
      <Link to="create" className="bg-blue-500 text-white p-2 rounded-full mb-4">Create New Event</Link>
      <div>
        {events.map(event => (
          <div key={event.id} className="mb-4 p-4 border rounded-lg">
            <h3>{event.title}</h3>
            <p>{event.date}</p>
            <p>{event.location}</p>
            <div className="flex justify-between">
              <Link to={`edit/${event.id}`} className="bg-yellow-500 p-2 rounded">Edit</Link>
              <button className="bg-red-500 p-2 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
