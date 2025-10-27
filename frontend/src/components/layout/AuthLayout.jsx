import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center"
      // Kita pakai gambar dari folder public/ yang Anda siapkan
      style={{ backgroundImage: "url('/concert-bg.jpg')" }}
    >
      {/* Overlay gelap tipis untuk kontras */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Konten akan diletakkan di atas overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;