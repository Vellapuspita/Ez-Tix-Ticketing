import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AdminLayout from '../components/layouts/AdminLayout';
import tailwind from 'tailwind-rn';

const ManageEventsPage = () => {
  const [eventName, setEventName] = useState('');

  const handleCreateEvent = () => {
    // Logika untuk menambah acara baru
    alert('Acara berhasil dibuat!');
  };

  return (
    <AdminLayout>
      <Text style={tailwind('text-xl font-bold mb-4')}>Kelola Acara</Text>
      <TextInput
        style={tailwind('border p-2 m-2 w-full')}
        placeholder="Nama Acara"
        value={eventName}
        onChangeText={setEventName}
      />
      <Button title="Buat Acara" onPress={handleCreateEvent} />
      {/* Di sini, Anda bisa menambahkan daftar acara dan fitur edit/hapus */}
    </AdminLayout>
  );
};

export default ManageEventsPage;
