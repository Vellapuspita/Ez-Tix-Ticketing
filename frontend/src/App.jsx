import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import semua halaman yang sudah kita buat
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminLoginPage from './pages/AdminLoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman login customer sebagai halaman utama */}
        <Route path="/" element={<LoginPage />} /> 
        
        {/* Halaman lainnya */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;