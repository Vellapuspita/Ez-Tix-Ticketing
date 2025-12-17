import React from 'react';
import { View, Text } from 'react-native';
import AdminLayout from '../components/layouts/AdminLayout';
import tailwind from 'tailwind-rn';

const SalesStatsPage = () => {
  return (
    <AdminLayout>
      <Text style={tailwind('text-xl font-bold mb-4')}>Statistik Penjualan</Text>
      <Text style={tailwind('text-lg')}>Total Pendapatan: Rp2.500.000</Text>
      <Text style={tailwind('text-lg')}>Tiket Terjual: 32</Text>
    </AdminLayout>
  );
};

export default SalesStatsPage;
