import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const serviceLabels = {
  individu: "Konseling Individu",
  kelompok: "Konseling Kelompok",
  klasikal: "Bimbingan Klasikal",
  bimbingan_kelompok: "Bimbingan Kelompok"
};

const initialStats = Object.keys(serviceLabels).reduce((acc, key) => {
  acc[key] = 0;
  return acc;
}, {});

export default function Dashboard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = async () => {
    setLoading(true);
    setError("");
    const { data, error: fetchError } = await supabase
      .from("services")
      .select("id, service_type")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setServices(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const stats = useMemo(() => {
    const counts = { ...initialStats };
    services.forEach((service) => {
      if (counts[service.service_type] !== undefined) {
        counts[service.service_type] += 1;
      }
    });
    return counts;
  }, [services]);

  const total = services.length;

  return (
    <div className="stack">
      <section className="card">
        <div className="card-header">
          <div>
            <h3>Ringkasan Layanan BK</h3>
            <p className="muted">
              Data diperbarui secara real-time dari Supabase.
            </p>
          </div>
          <button className="btn secondary" onClick={loadServices}>
            Refresh
          </button>
        </div>
        {loading ? (
          <p>Memuat data...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Layanan BK</h4>
              <span className="stat-value">{total}</span>
            </div>
            {Object.entries(stats).map(([key, value]) => {
              const percent = total ? Math.round((value / total) * 100) : 0;
              return (
                <div className="stat-card" key={key}>
                  <h4>{serviceLabels[key]}</h4>
                  <div className="stat-meta">
                    <span className="stat-value">{percent}%</span>
                    <span className="muted">{value} sesi</span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
