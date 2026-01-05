import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const serviceOptions = [
  { value: "individu", label: "Konseling Individu" },
  { value: "kelompok", label: "Konseling Kelompok" },
  { value: "klasikal", label: "Bimbingan Klasikal" },
  { value: "bimbingan_kelompok", label: "Bimbingan Kelompok" }
];

const emptyForm = {
  id: null,
  service_type: "individu",
  service_date: "",
  notes: ""
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadServices = async () => {
    setError("");
    const { data, error: fetchError } = await supabase
      .from("services")
      .select("id, service_type, service_date, notes")
      .order("service_date", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    setServices(data ?? []);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.id) {
      const { error: updateError } = await supabase
        .from("services")
        .update({
          service_type: form.service_type,
          service_date: form.service_date,
          notes: form.notes
        })
        .eq("id", form.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("services").insert({
        service_type: form.service_type,
        service_date: form.service_date,
        notes: form.notes
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }
    }

    setForm(emptyForm);
    loadServices();
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      service_type: item.service_type,
      service_date: item.service_date,
      notes: item.notes
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Hapus sesi layanan ini?");
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    loadServices();
  };

  return (
    <div className="stack">
      <section className="card">
        <h3>Tambah / Edit Sesi Layanan BK</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Jenis Layanan
            <select
              value={form.service_type}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  service_type: event.target.value
                }))
              }
            >
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tanggal Layanan
            <input
              type="date"
              value={form.service_date}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  service_date: event.target.value
                }))
              }
              required
            />
          </label>
          <label>
            Catatan Singkat
            <textarea
              value={form.notes}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, notes: event.target.value }))
              }
              rows={4}
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <div className="form-actions">
            <button className="btn" type="submit">
              {form.id ? "Simpan Perubahan" : "Tambah Sesi"}
            </button>
            {form.id ? (
              <button
                className="btn secondary"
                type="button"
                onClick={() => setForm(emptyForm)}
              >
                Batal
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>Riwayat Sesi Layanan</h3>
          <button className="btn secondary" onClick={loadServices}>
            Refresh
          </button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Jenis Layanan</th>
                <th>Tanggal</th>
                <th>Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {services.map((item) => (
                <tr key={item.id}>
                  <td>
                    {
                      serviceOptions.find(
                        (option) => option.value === item.service_type
                      )?.label
                    }
                  </td>
                  <td>{item.service_date}</td>
                  <td>{item.notes}</td>
                  <td className="table-actions">
                    <button
                      className="btn small"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn small danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
