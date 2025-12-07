import { Outlet } from "react-router-dom";
import bg from "../../assets/background.jpg";
import logo from "../../assets/logo.png"; // ⬅️ Logo asli

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-4xl bg-white/95 rounded-3xl shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT FORM */}
        <div className="p-8 md:p-10">
          <Outlet />
        </div>

        {/* RIGHT: LOGO ONLY */}
        <div className="hidden md:flex items-center justify-center bg-[#FFF7D6]">

          <div className="flex flex-col items-center justify-center">
            <img
              src={logo}
              alt="EZ-TIX Logo"
              className="w-80 object-contain"  // ukuran pas untuk layout
            />
          </div>

        </div>
      </div>
    </div>
  );
}
