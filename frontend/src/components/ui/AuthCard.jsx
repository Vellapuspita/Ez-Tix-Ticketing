import React from 'react';
import { Link } from 'react-router-dom';

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="w-full max-w-md bg-gray-50/95 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">EZ-TIX</h1>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default AuthCard;