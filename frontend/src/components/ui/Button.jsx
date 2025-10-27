import React from 'react';

// Komponen Tombol yang bisa dipakai ulang
const Button = ({ children, type = 'submit', onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-orange-500 text-white py-3 px-4 rounded-md font-semibold shadow-lg hover:bg-orange-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75"
    >
      {children}
    </button>
  );
};

export default Button;