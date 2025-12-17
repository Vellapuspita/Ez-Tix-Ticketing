import React from 'react';
import { View, Text, Button } from 'react-native';
import tailwind from 'tailwind-rn';

const AdminNavbar = ({ navigation }) => {
  return (
    <View style={tailwind('flex-row justify-between items-center p-4 bg-yellow-500')}>
      <Text style={tailwind('text-white text-lg')}>Admin Panel</Text>
      <Button title="Logout" onPress={() => navigation.navigate('AdminLoginPage')} />
    </View>
  );
};

export default AdminNavbar;
