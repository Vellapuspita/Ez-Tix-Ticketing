import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";

// Customer Pages
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

// Admin Pages
import AdminDashboard from "./pages/AdminPage/AdminDashboard";
import AdminEventList from "./pages/AdminPage/AdminEventList";
import CreateEventPage from "./pages/AdminPage/CreateEventPage";
import EditEventPage from "./pages/AdminPage/EditEventPage";
import AdminUsers from "./pages/AdminPage/AdminUser";

// Admin Pages (tambahan figma)
import AdminStatsPage from "./pages/AdminPage/AdminStatsPage";
import AdminStatsDetailPage from "./pages/AdminPage/AdminStatsDetailPage";
import AdminCheckinPage from "./pages/AdminPage/AdminCheckinPage";
import AdminQRPage from "./pages/AdminPage/AdminQRPage";

// ✅ Admin Login Page
import AdminLoginPage from "./pages/AdminPage/AdminLoginPage";

/* ===================== AUTH (DUMMY) ===================== */
// Customer auth
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

// Admin auth
const isAuthenticatedAdmin = () => {
  return !!localStorage.getItem("adminToken");
};

function ProtectedRouteAdmin({ children }) {
  if (!isAuthenticatedAdmin()) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===================== CUSTOMER ===================== */}
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

        {/* ✅ Admin login pakai layout auth yang sama */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ===================== AUTH (Customer + Admin Login) ===================== */}
        <Route element={<AuthLayout />}>
          {/* Customer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ResetPasswordPage />} />
        </Route>

        {/* ===================== ADMIN (PROTECTED + NESTED) ===================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin>
              <AdminLayout />
            </ProtectedRouteAdmin>
          }
        >
          {/* HOME ADMIN */}
          <Route index element={<AdminDashboard />} />

          {/* EVENT CRUD */}
          <Route path="events" element={<AdminEventList />} />
          <Route path="events/create" element={<CreateEventPage />} />
          <Route path="events/edit/:id" element={<EditEventPage />} />

          {/* USERS */}
          <Route path="users" element={<AdminUsers />} />

          {/* STATISTIK */}
          <Route path="stats" element={<AdminStatsPage />} />
          <Route path="stats/:id" element={<AdminStatsDetailPage />} />
          <Route path="stats/:id/checkin" element={<AdminCheckinPage />} />

          {/* QR */}
          <Route path="qr" element={<AdminQRPage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
