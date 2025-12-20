import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditEventPage = () => {
  const { id } = useParams();  // Mendapatkan ID acara dari URL
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    price: "",
  });

  useEffect(() => {
    // Ambil data acara berdasarkan id (simulasi API call)
    const fetchedEvent = {
      id,
      title: "Event Example",
      date: "2025-10-10",
      time: "19:00 WIB",
      location: "Venue Example",
      price: "150000",
    };
    setEventData(fetchedEvent);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi pengiriman data ke backend
    console.log("Event updated:", eventData);
  };

  return (
    <div>
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-medium">Event Name</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="font-medium">Time</label>
          <input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={eventData.price}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
