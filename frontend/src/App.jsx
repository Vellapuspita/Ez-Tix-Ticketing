import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";

// Import Pages untuk Customer
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

// Import Pages untuk Admin
import AdminDashboard from "./pages/AdminPage/AdminDashboard";
import AdminEventList from "./pages/AdminPage/AdminEventList";
import CreateEventPage from "./pages/AdminPage/CreateEventPage";
import EditEventPage from "./pages/AdminPage/EditEventPage";
import AdminUsers from "./pages/AdminPage/AdminUser";

// ❗ sementara: state auth dummy
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Fungsi untuk melindungi rute customer
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Fungsi untuk melindungi rute admin
const isAuthenticatedAdmin = () => {
  return !!localStorage.getItem("adminToken"); // Token admin disimpan di localStorage
};

function ProtectedRouteAdmin({ children }) {
  if (!isAuthenticatedAdmin()) {
    return <Navigate to="/admin/login" replace />;
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

        {/* ROUTES ADMIN */}
        <Route element={<ProtectedRouteAdmin><MainLayout /></ProtectedRouteAdmin>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEventList />} />
          <Route path="/admin/events/create" element={<CreateEventPage />} />
          <Route path="/admin/events/edit/:id" element={<EditEventPage />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
