import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ModDownloader from "./components/modDownloader/ModDownloader";
import ModSearch from "./components/modSearch/ModSearch";
import ModListsPage from "./components/modLists/ModListsPage";
import NavBar from "./components/common/NavBar";
import LandingPage from "./components/common/LandingPage";
import NotFound from "./components/common/NotFound";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from './contexts/NotificationContext';
import Notification from './components/ui/Notification';

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
          <Router>
            <NavBar />
            <Notification />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/download" 
                  element={
                    <ProtectedRoute>
                      <ModDownloader />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/search" 
                  element={
                    <ProtectedRoute>
                      <ModSearch />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/modlists" 
                  element={
                    <ProtectedRoute>
                      <ModListsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </div>
      </AuthProvider>
    </NotificationProvider>
  );
}
