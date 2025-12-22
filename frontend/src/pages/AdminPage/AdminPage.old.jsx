import { Link, Outlet } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="admin-container">
      {/* Sidebar Admin */}
      <div className="sidebar bg-yellow-500 p-6 text-white">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
        <nav>
          <ul>
            <li><Link to="dashboard">Dashboard</Link></li>
            <li><Link to="events">Manage Events</Link></li>
            <li><Link to="users">Manage Users</Link></li>
            <li><Link to="statistics">Statistics</Link></li>
          </ul>
        </nav>
        <div className="mt-auto">
          <p>Admin: Arya Genta</p>
          <button className="bg-red-500 p-2 rounded-full">Logout</button>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area p-6">
        <Outlet />
      </div>
    </div>
  );
}
