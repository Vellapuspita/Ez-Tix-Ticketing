// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthLayout from "./components/layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import EventDetailPage from "./pages/EventDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import TicketListPage from "./pages/TicketListPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import EventListPage from "./pages/EventListPage";

import MainLayout from "./components/layouts/MainLayout";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* AUTH PAGES */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <ResetPasswordPage />
            </AuthLayout>
          }
        />

        {/* CUSTOMER SIDE */}
        <Route
          path="/"
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          }
        />
        <Route
          path="/events/:id"
          element={
            <MainLayout>
              <EventDetailPage />
            </MainLayout>
          }
        />
        <Route
          path="/events/:id/checkout"
          element={
            <MainLayout>
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            </MainLayout>
          }
        />
        <Route
          path="/tickets"
          element={
            <MainLayout>
              <RequireAuth>
                <TicketListPage />
              </RequireAuth>
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            </MainLayout>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <MainLayout>
              <RequireAuth>
                <EditProfilePage />
              </RequireAuth>
            </MainLayout>
          }
        />
        <Route
          path="/profile/change-password"
          element={
            <MainLayout>
              <RequireAuth>
                <ChangePasswordPage />
              </RequireAuth>
            </MainLayout>
          }
          />
        <Route path="/events" element={
            <MainLayout>
              <EventListPage />
            </MainLayout>
          } 
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
