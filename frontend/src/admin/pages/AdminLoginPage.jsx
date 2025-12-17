import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import tailwind from 'tailwind-rn';

const AdminLoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'admin@ez-tix.com' && password === 'admin123') {
      navigation.navigate('DashboardAdminPage');
    } else if (email === 'penyelenggara@ez-tix.com' && password === 'penyelenggara123') {
      navigation.navigate('DashboardAdminPage');
    } else {
      alert('Email atau password salah!');
    }
  };

  return (
    <View style={tailwind('flex-1 justify-center items-center p-4')}>
      <TextInput
        style={tailwind('border p-2 m-2 w-full')}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={tailwind('border p-2 m-2 w-full')}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={tailwind('mt-4 text-blue-500')}>
        Belum punya akun?{' '}
        <Text
          style={tailwind('text-blue-500 font-bold')}
          onPress={() => navigation.navigate('AdminRegisterPage')}
        >
          Daftar Sekarang
        </Text>
      </Text>
    </View>
  );
};

export default AdminLoginPage;
