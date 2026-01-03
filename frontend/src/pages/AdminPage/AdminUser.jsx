import React, { useState, useEffect } from "react";
import api from "../../utils/api"; 
import { Toast, ConfirmDialog, Pagination } from "../../components/admin/AdminUI";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(""); // State untuk search
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  
  const [toast, setToast] = useState({ open: false, text: "" });
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const pageSize = 10;

  // 1. Fungsi Fetch Data (Mendukung Search & Pagination dari Controller)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken"); // Pastikan key sesuai login admin
      
      const response = await api.get("/users", {
        params: {
          search: q,
          page: page,
          limit: pageSize
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      // Sesuai dengan response res.json({ users, total, ... }) di controller
      setUsers(response.data.users);
      setTotalData(response.data.total);
    } catch (err) {
      console.error("Gagal mengambil daftar pengguna:", err);
      setToast({ open: true, text: "Gagal memuat data pengguna." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, q]); // Refresh jika halaman atau pencarian berubah

  // 2. Fungsi Hapus User (Memanggil deleteUser di Controller)
  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(`/users/${selectedUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setToast({ open: true, text: "User berhasil dihapus" });
      fetchUsers(); // Refresh data setelah menghapus
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menghapus user";
      setToast({ open: true, text: msg });
    } finally {
      setOpenDelete(false);
      setSelectedUserId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalData / pageSize));

  return (
    <div className="p-6 bg-white rounded-[22px] shadow-sm">
      <Toast open={toast.open} text={toast.text} onClose={() => setToast({ open: false, text: "" })} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-black">Kelola Pengguna</h2>
          <p className="text-sm text-black/60">Total terdaftar: {totalData} user</p>
        </div>

        {/* Search Bar Terintegrasi ke Backend */}
        <div className="w-full md:w-[300px] bg-gray-100 rounded-xl px-4 py-2 flex items-center gap-2 border border-black/5">
          <span className="material-icons text-gray-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="bg-transparent outline-none text-sm w-full"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-black/10 text-black/60">
              <th className="p-3 font-semibold">Nama Pengguna</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Tgl Bergabung</th>
              <th className="p-3 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-10 text-center text-gray-400">Memuat data...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="4" className="p-10 text-center text-gray-400">Tidak ada user ditemukan.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b border-black/5 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-black">{user.namaPengguna}</td>
                  <td className="p-3 text-black/70">{user.email}</td>
                  <td className="p-3 text-black/60 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => { setSelectedUserId(user._id); setOpenDelete(true); }}
                      className="px-4 py-1.5 rounded-xl bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-colors"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      <ConfirmDialog
        open={openDelete}
        title="Hapus Pengguna"
        message="Hapus akun ini secara permanen? User tidak akan bisa login lagi."
        onYes={handleDeleteUser}
        onNo={() => setOpenDelete(false)}
      />
    </div>
  );
};

export default AdminUsers;