import { useState } from "react";

export default function CreateEventPage() {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit data (API call)
    console.log("Event created:", eventData);
  };

  return (
    <div>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={eventData.name}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="date"
          value={eventData.date}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={eventData.location}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={eventData.price}
          onChange={handleChange}
        />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
