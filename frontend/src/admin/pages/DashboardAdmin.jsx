import React from 'react';
import { View, Text, Button } from 'react-native';
import AdminLayout from '../components/layouts/AdminLayout';
import AdminNavbar from '../components/layouts/AdminNavbar';
import tailwind from 'tailwind-rn';

const DashboardAdminPage = ({ navigation }) => {
  return (
    <AdminLayout>
      <AdminNavbar navigation={navigation} />
      <Text style={tailwind('text-xl font-bold mb-4')}>Dashboard Admin</Text>
      <Button title="Kelola Acara" onPress={() => navigation.navigate('ManageEventsPage')} />
      <Button title="Kelola Pengguna" onPress={() => navigation.navigate('ManageUsersPage')} />
      <Button title="Statistik Penjualan" onPress={() => navigation.navigate('SalesStatsPage')} />
    </AdminLayout>
  );
};

export default DashboardAdminPage;
