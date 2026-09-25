"use client";

import { useState, useEffect } from "react";

const TARGET_LABEL = { semua: "Semua", guru: "Guru", siswa: "Siswa" };
const FORM_KOSONG = { judul: "", isi: "", target: "semua" };

export default function PengumumanPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_KOSONG);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function fetchData() {
    setLoading(true);
    const res = await fetch("/api/pengumuman");
    const data = await res.json();
    setList(data.pengumuman || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/pengumuman", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Terjadi kesalahan");
      return;
    }

    setForm(FORM_KOSONG);
    setShowForm(false);
    fetchData();
  }

  async function handleDelete(id, judul) {
    if (!confirm(`Yakin mau hapus pengumuman "${judul}"?`)) return;
    const res = await fetch(`/api/pengumuman/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Gagal menghapus");
      return;
    }
    fetchData();
  }

  return (
    <div>
      <div className="card-header">
        <h2>Pengumuman</h2>
        <button className="btn-auto" onClick={() => setShowForm(true)}>
          + Buat Pengumuman
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Pengumuman Baru</h3>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

            <input name="judul" placeholder="Judul pengumuman" value={form.judul} onChange={handleChange} required />

            <textarea
              name="isi"
              placeholder="Isi pengumuman"
              value={form.isi}
              onChange={handleChange}
              rows={4}
              required
            />

            <label>Tampilkan untuk</label>
            <select name="target" value={form.target} onChange={handleChange}>
              <option value="semua">Semua (Guru & Siswa)</option>
              <option value="guru">Guru saja</option>
              <option value="siswa">Siswa saja</option>
            </select>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Terbitkan</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Memuat data...</p>
      ) : list.length === 0 ? (
        <div className="card table-empty">Belum ada pengumuman</div>
      ) : (
        list.map((p) => (
          <div key={p._id} className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3>{p.judul}</h3>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Untuk: {TARGET_LABEL[p.target]} • oleh {p.dibuatOleh?.nama || "-"} •{" "}
                  {new Date(p.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
              <button className="btn-auto btn-danger" onClick={() => handleDelete(p._id, p.judul)}>
                Hapus
              </button>
            </div>
            <p style={{ marginTop: 10, fontSize: 14 }}>{p.isi}</p>
          </div>
        ))
      )}
    </div>
  );
}