import React from "react";

const AdminStatistics = () => {
  return (
    <div>
      <h2>Statistics</h2>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-green-500 p-6 rounded-lg text-white">
          <h3>Total Customers</h3>
          <p>100</p>
        </div>
        <div className="bg-blue-500 p-6 rounded-lg text-white">
          <h3>Total Tickets</h3>
          <p>200</p>
        </div>
        <div className="bg-yellow-500 p-6 rounded-lg text-white">
          <h3>Total Revenue</h3>
          <p>Rp 1.000.000.000</p>
        </div>
      </div>

      <h3>Sales by Event</h3>
      <table className="table-auto w-full text-sm">
        <thead>
          <tr>
            <th className="p-3">Event</th>
            <th className="p-3">Tickets Sold</th>
            <th className="p-3">Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3">Seminar Nasional Blockchain</td>
            <td className="p-3">100</td>
            <td className="p-3">Rp 10.000.000</td>
          </tr>
          <tr>
            <td className="p-3">Ruang Nada</td>
            <td className="p-3">150</td>
            <td className="p-3">Rp 15.000.000</td>
          </tr>
          {/* Tambahkan data acara lainnya */}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStatistics;
