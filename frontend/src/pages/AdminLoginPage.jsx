import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const AdminLoginPage = () => {
  return (
    <AuthLayout>
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex overflow-hidden">
        {/* Bagian Kiri: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-800">SELAMAT DATANG DI EZ-TIX</h2>
          <p className="text-gray-600 mt-2 mb-6">Persiapkan acaramu dengan mudah</p>
          
          <form>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="admin@eztix.com"
            />
            <Input
              label="Kata Sandi"
              name="password"
              type="password"
              placeholder="••••••••"
            />
            <div className="mt-8">
              <Button>Masuk sebagai admin</Button>
            </div>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Bukan admin?{' '}
            <Link to="/" className="font-medium text-orange-500 hover:text-orange-600">
              Login customer
            </Link>
          </p>
        </div>
        
        {/* Bagian Kanan: Logo */}
        <div className="hidden md:flex w-1/2 bg-lime-50 items-center justify-center p-12">
          <div className="bg-yellow-400 p-8 shadow-lg text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tighter">EZ-TIX</h1>
            <p className="text-2xl font-semibold text-gray-800">TICKETING</p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AdminLoginPage;