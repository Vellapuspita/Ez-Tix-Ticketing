import React, { useState, useEffect } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulasi data pengguna yang diterima dari API
    const fetchedUsers = [
      { id: 1, name: "Selina Maharani", email: "maharanisIn123@gmail.com" },
      { id: 2, name: "Arya Genta", email: "arya.genta@gmail.com" },
      // Tambahkan data pengguna lainnya
    ];
    setUsers(fetchedUsers);
  }, []);

  const handleDeleteUser = (id) => {
    // Implementasikan logika untuk menghapus pengguna
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Manage Users</h2>
      <div className="mt-4">
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <button className="text-yellow-500">Edit</button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="ml-2 text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
