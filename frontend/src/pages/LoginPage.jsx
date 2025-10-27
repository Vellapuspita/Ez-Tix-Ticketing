import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/layouts/AuthLayout';
import AuthCard from '../components/ui/AuthCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage = () => {
  return (
    <AuthLayout>
      <AuthCard title="EZ-TIX" subtitle="Selamat datang kembali!">
        <form>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Masukkan email"
          />
          <Input
            label="Kata Sandi"
            name="password"
            type="password"
            placeholder="Masukkan kata sandi"
          />
          <div className="text-right mb-6">
            <Link to="/reset-password" className="text-sm font-medium text-orange-500 hover:text-orange-600">
              Lupa kata sandi?
            </Link>
          </div>
          <Button>Login</Button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-orange-500 hover:text-orange-600">
            Daftar di sini
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;