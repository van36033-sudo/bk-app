import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const emptyForm = { id: null, nisn: "", name: "", className: "" };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    setLoading(true);
    setError("");
    const { data, error: fetchError } = await supabase
      .from("students")
      .select("id, nisn, name, class")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setStudents(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.id) {
      const { error: updateError } = await supabase
        .from("students")
        .update({ nisn: form.nisn, name: form.name, class: form.className })
        .eq("id", form.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("students").insert({
        nisn: form.nisn,
        name: form.name,
        class: form.className
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }
    }

    setForm(emptyForm);
    loadStudents();
  };

  const handleEdit = (student) => {
    setForm({
      id: student.id,
      nisn: student.nisn,
      name: student.name,
      className: student.class
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Hapus data siswa ini?");
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    loadStudents();
  };

  return (
    <div className="stack">
      <section className="card">
        <h3>Tambah / Edit Siswa</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            NISN
            <input
              value={form.nisn}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, nisn: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Nama Siswa
            <input
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Kelas
            <input
              value={form.className}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, className: event.target.value }))
              }
              required
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <div className="form-actions">
            <button className="btn" type="submit">
              {form.id ? "Simpan Perubahan" : "Tambah Siswa"}
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
          <h3>Daftar Siswa</h3>
          <button className="btn secondary" onClick={loadStudents}>
            Refresh
          </button>
        </div>
        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>NISN</th>
                  <th>Nama</th>
                  <th>Kelas</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.nisn}</td>
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                    <td className="table-actions">
                      <button
                        className="btn small"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn small danger"
                        onClick={() => handleDelete(student.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
