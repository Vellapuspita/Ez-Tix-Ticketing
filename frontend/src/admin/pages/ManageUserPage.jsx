import React from 'react';
import { View, Text, Button } from 'react-native';
import AdminLayout from '../components/layouts/AdminLayout';
import tailwind from 'tailwind-rn';

const ManageUsersPage = () => {
  const users = [
    { id: 1, name: 'Wilson Dacosta' },
    { id: 2, name: 'Vella Puspitasari' },
  ];

  const handleDeleteUser = (id) => {
    alert(`Pengguna dengan ID ${id} telah dihapus`);
  };

  return (
    <AdminLayout>
      <Text style={tailwind('text-xl font-bold mb-4')}>Kelola Pengguna</Text>
      {users.map((user) => (
        <View key={user.id} style={tailwind('flex-row justify-between items-center p-2 border-b')}>
          <Text>{user.name}</Text>
          <Button title="Hapus" onPress={() => handleDeleteUser(user.id)} />
        </View>
      ))}
    </AdminLayout>
  );
};

export default ManageUsersPage;
