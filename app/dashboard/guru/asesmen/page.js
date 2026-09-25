"use client";

import { useState, useEffect } from "react";

const FORM_KOSONG = { judul: "", jenis: "quiz", deskripsi: "", mataPelajaran: "", kelas: "", tanggal: "" };

export default function AsesmenPage() {
  const [list, setList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_KOSONG);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function fetchData() {
    setLoading(true);
    const [resA, resMapel, resKelas] = await Promise.all([
      fetch("/api/asesmen"),
      fetch("/api/mata-pelajaran"),
      fetch("/api/kelas"),
    ]);
    setList((await resA.json()).asesmen || []);
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

    const res = await fetch("/api/asesmen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) { setError(data.error || "Terjadi kesalahan"); return; }

    setForm(FORM_KOSONG);
    setShowForm(false);
    fetchData();
  }

  async function handleDelete(id, judul) {
    if (!confirm(`Yakin mau hapus "${judul}"?`)) return;
    const res = await fetch(`/api/asesmen/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { alert(data.error || "Gagal menghapus"); return; }
    fetchData();
  }

  return (
    <div>
      <div className="card-header">
        <h2>Asesmen / Ujian</h2>
        <button className="btn-auto" onClick={() => setShowForm(true)}>+ Buat Asesmen</button>
      </div>

      {(mapelList.length === 0 || kelasList.length === 0) && !loading && (
        <div className="card" style={{ marginBottom: 20, background: "#fef3c7", color: "#92400e" }}>
          ⚠️ Belum ada Mata Pelajaran atau Kelas. Minta Admin menambahkannya dulu.
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Asesmen Baru</h3>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <input name="judul" placeholder="Judul (misal: Ulangan Harian Bab 3)" value={form.judul} onChange={handleChange} required />

            <select name="jenis" value={form.jenis} onChange={handleChange}>
              <option value="quiz">Quiz</option>
              <option value="ujian">Ujian</option>
            </select>

            <select name="mataPelajaran" value={form.mataPelajaran} onChange={handleChange} required>
              <option value="">-- Pilih Mata Pelajaran --</option>
              {mapelList.map((m) => <option key={m._id} value={m._id}>{m.nama}</option>)}
            </select>

            <select name="kelas" value={form.kelas} onChange={handleChange} required>
              <option value="">-- Pilih Kelas --</option>
              {kelasList.map((k) => <option key={k._id} value={k._id}>{k.nama}</option>)}
            </select>

            <textarea name="deskripsi" placeholder="Keterangan (opsional)" value={form.deskripsi} onChange={handleChange} rows={3} />

            <label>Tanggal Pelaksanaan</label>
            <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} />

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Simpan</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Judul</th><th>Jenis</th><th>Mapel</th><th>Kelas</th><th>Tanggal</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="table-empty">Memuat...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={6} className="table-empty">Belum ada asesmen</td></tr>
            ) : (
              list.map((a) => (
                <tr key={a._id}>
                  <td>{a.judul}</td>
                  <td style={{ textTransform: "capitalize" }}>{a.jenis}</td>
                  <td>{a.mataPelajaran?.nama || "-"}</td>
                  <td>{a.kelas?.nama || "-"}</td>
                  <td>{a.tanggal ? new Date(a.tanggal).toLocaleDateString("id-ID") : "-"}</td>
                  <td>
                    <button className="btn-auto btn-danger" onClick={() => handleDelete(a._id, a.judul)}>Hapus</button>
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