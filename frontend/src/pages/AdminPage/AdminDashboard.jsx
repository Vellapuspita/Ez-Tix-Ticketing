export default function AdminDashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-orange-500 p-6 rounded-lg text-white">
          <h3>Total Customer</h3>
          <p>0</p>
        </div>
        <div className="bg-orange-500 p-6 rounded-lg text-white">
          <h3>Total Tickets</h3>
          <p>0</p>
        </div>
        <div className="bg-orange-500 p-6 rounded-lg text-white">
          <h3>Revenue</h3>
          <p>Rp0</p>
        </div>
      </div>
      <div>
        <h3>Events</h3>
        <p>List of upcoming events will be displayed here</p>
      </div>
    </div>
  );
}
