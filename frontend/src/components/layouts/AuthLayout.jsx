// src/components/layouts/AuthLayout.jsx
import bg from "/background.jpg";
import logo from "/logo.png";

export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-5xl bg-white/95 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* LEFT FORM */}
        <div className="w-full md:w-1/2 px-8 md:px-12 py-10 flex flex-col justify-center">
          {children}
        </div>

        {/* RIGHT LOGO */}
        <div className="hidden md:flex w-1/2 bg-[#FFF7E6] items-center justify-center">
          <img src={logo} alt="EZ-TIX" className="w-64 h-auto drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}
