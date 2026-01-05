import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Siswa", to: "/students" },
  { label: "Kasus", to: "/cases" },
  { label: "Sesi Layanan", to: "/services" },
  { label: "Generator RPL", to: "/rpl" }
];

export default function Layout({ session, children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>BK SMA</h1>
          <p className="muted">Bimbingan Konseling</p>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <header className="header">
          <div>
            <h2>Halo, Guru BK</h2>
            <p className="muted">Masuk sebagai {session?.user?.email}</p>
          </div>
          <button className="btn secondary" onClick={handleLogout}>
            Keluar
          </button>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}
