import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./components/useAuth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Cases from "./pages/Cases";
import Services from "./pages/Services";
import RplGenerator from "./pages/RplGenerator";

const ProtectedRoute = ({ isReady, session, children }) => {
  if (!isReady) {
    return <div className="page-loading">Memuat sesi...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  const { session, isReady } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute isReady={isReady} session={session}>
            <Layout session={session}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/cases" element={<Cases />} />
                <Route path="/services" element={<Services />} />
                <Route path="/rpl" element={<RplGenerator />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
