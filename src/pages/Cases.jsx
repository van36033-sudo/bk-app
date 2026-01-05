import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const emptyForm = {
  id: null,
  title: "",
  category: "",
  urgency: "Rendah",
  status: "Baru"
};

const urgencyOptions = ["Rendah", "Sedang", "Tinggi", "Darurat"];
const statusOptions = ["Baru", "Dalam Penanganan", "Selesai", "Ditutup"];

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadCases = async () => {
    setError("");
    const { data, error: fetchError } = await supabase
      .from("cases")
      .select("id, title, category, urgency, status")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    setCases(data ?? []);
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.id) {
      const { error: updateError } = await supabase
        .from("cases")
        .update({
          title: form.title,
          category: form.category,
          urgency: form.urgency,
          status: form.status
        })
        .eq("id", form.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("cases").insert({
        title: form.title,
        category: form.category,
        urgency: form.urgency,
        status: form.status
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }
    }

    setForm(emptyForm);
    loadCases();
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title,
      category: item.category,
      urgency: item.urgency,
      status: item.status
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Hapus kasus BK ini?");
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("cases")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    loadCases();
  };

  return (
    <div className="stack">
      <section className="card">
        <h3>Tambah / Edit Kasus BK</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Judul Kasus
            <input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Kategori Masalah
            <input
              value={form.category}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, category: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Urgensi
            <select
              value={form.urgency}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, urgency: event.target.value }))
              }
            >
              {urgencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value }))
              }
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          {error ? <p className="error">{error}</p> : null}
          <div className="form-actions">
            <button className="btn" type="submit">
              {form.id ? "Simpan Perubahan" : "Tambah Kasus"}
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
          <h3>Daftar Kasus BK</h3>
          <button className="btn secondary" onClick={loadCases}>
            Refresh
          </button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Urgensi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.urgency}</td>
                  <td>{item.status}</td>
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
