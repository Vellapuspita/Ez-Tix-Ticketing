import React from 'react';
import { View, Text } from 'react-native';
import tailwind from 'tailwind-rn';

const AdminLayout = ({ children }) => {
  return (
    <View style={tailwind('flex-1 bg-gray-100')}>
      <View style={tailwind('bg-yellow-500 p-4')}>
        <Text style={tailwind('text-white text-2xl font-bold')}>Admin Panel</Text>
      </View>
      <View style={tailwind('p-4')}>
        {children}
      </View>
    </View>
  );
};

export default AdminLayout;
