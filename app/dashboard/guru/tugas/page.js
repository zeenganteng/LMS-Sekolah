"use client";

import { useState, useEffect } from "react";

const FORM_KOSONG = { judul: "", deskripsi: "", mataPelajaran: "", kelas: "", deadline: "" };

export default function TugasPage() {
  const [tugasList, setTugasList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_KOSONG);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function fetchData() {
    setLoading(true);
    const [resTugas, resMapel, resKelas] = await Promise.all([
      fetch("/api/tugas"),
      fetch("/api/mata-pelajaran"),
      fetch("/api/kelas"),
    ]);
    setTugasList((await resTugas.json()).tugas || []);
    setMapelList((await resMapel.json()).mataPelajaran || []);
    setKelasList((await resKelas.json()).kelas || []);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/tugas", {
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
    if (!confirm(`Yakin mau hapus tugas "${judul}"?`)) return;
    const res = await fetch(`/api/tugas/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { alert(data.error || "Gagal menghapus"); return; }
    fetchData();
  }

  return (
    <div>
      <div className="card-header">
        <h2>Tugas</h2>
        <button className="btn-auto" onClick={() => setShowForm(true)}>+ Beri Tugas</button>
      </div>

      {(mapelList.length === 0 || kelasList.length === 0) && !loading && (
        <div className="card" style={{ marginBottom: 20, background: "#fef3c7", color: "#92400e" }}>
          ⚠️ Belum ada Mata Pelajaran atau Kelas. Minta Admin menambahkannya dulu.
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Beri Tugas Baru</h3>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <input name="judul" placeholder="Judul tugas" value={form.judul} onChange={handleChange} required />

            <select name="mataPelajaran" value={form.mataPelajaran} onChange={handleChange} required>
              <option value="">-- Pilih Mata Pelajaran --</option>
              {mapelList.map((m) => <option key={m._id} value={m._id}>{m.nama}</option>)}
            </select>

            <select name="kelas" value={form.kelas} onChange={handleChange} required>
              <option value="">-- Pilih Kelas --</option>
              {kelasList.map((k) => <option key={k._id} value={k._id}>{k.nama}</option>)}
            </select>

            <textarea name="deskripsi" placeholder="Instruksi tugas" value={form.deskripsi} onChange={handleChange} rows={3} />

            <label>Deadline</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Terbitkan Tugas</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Judul</th><th>Mapel</th><th>Kelas</th><th>Deadline</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="table-empty">Memuat...</td></tr>
            ) : tugasList.length === 0 ? (
              <tr><td colSpan={5} className="table-empty">Belum ada tugas</td></tr>
            ) : (
              tugasList.map((t) => (
                <tr key={t._id}>
                  <td>{t.judul}</td>
                  <td>{t.mataPelajaran?.nama || "-"}</td>
                  <td>{t.kelas?.nama || "-"}</td>
                  <td>{t.deadline ? new Date(t.deadline).toLocaleDateString("id-ID") : "-"}</td>
                  <td>
                    <button className="btn-auto btn-danger" onClick={() => handleDelete(t._id, t.judul)}>Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}