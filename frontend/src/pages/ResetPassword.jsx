import React from 'react';
import { Link } from 'react-router-dom';

import AuthLayout from '../components/layouts/AuthLayout';
import AuthCard from '../components/ui/AuthCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <AuthCard title="EZ-TIX" subtitle="Buat kata sandi baru">
        <form>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Masukkan email"
          />
          <Input
            label="Kata Sandi Baru"
            name="newPassword"
            type="password"
            placeholder="Masukkan kata sandi baru"
          />
          <Input
            label="Ulangi Kata Sandi Baru"
            name="confirmNewPassword"
            type="password"
            placeholder="Masukkan ulang kata sandi baru"
          />
          <div className="mt-6">
            <Button>Ubah Kata Sandi</Button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Batal?{' '}
          <Link to="/" className="font-medium text-orange-500 hover:text-orange-600">
            Kembali ke Login
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default ResetPasswordPage;