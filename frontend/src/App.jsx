import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";

import DashboardPage from "./pages/DashboardPage";
import EventListPage from "./pages/EventListPage";
import EventDetailPage from "./pages/EventDetailPage";
import TicketListPage from "./pages/TicketListPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

// ❗ sementara: state auth dummy
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LAYOUT UTAMA (NAVBAR + CONTENT) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/change-password"
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/:eventId"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:eventId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccessPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* LAYOUT AUTH (BACKGROUND KONSER + CARD PUTIH) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ResetPasswordPage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
