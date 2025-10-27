import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

import AuthLayout from '../components/layouts/AuthLayout';
import AuthCard from '../components/ui/AuthCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const RegisterPage = () => {
  return (
    <AuthLayout>
      <AuthCard title="EZ-TIX" subtitle="Silahkan buat akun anda">
        <form>
          <Input
            label="Nama Pengguna"
            name="username"
            placeholder="Masukkan nama pengguna"
          />
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
          <Input
            label="Ulangi Kata Sandi"
            name="confirmPassword"
            type="password"
            placeholder="Masukkan ulang kata sandi"
          />
          <div className="text-right mb-6">
            <Link to="/admin-login" className="text-sm text-gray-600 hover:text-orange-500 inline-flex items-center">
              Admin
              <CheckCircleIcon className="w-4 h-4 ml-1 text-green-500" />
            </Link>
          </div>
          <Button>Buat Akun</Button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{' '}
          <Link to="/" className="font-medium text-orange-500 hover:text-orange-600">
            Login di sini
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default RegisterPage;