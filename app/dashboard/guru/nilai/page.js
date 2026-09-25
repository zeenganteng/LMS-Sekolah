"use client";

import { useState, useEffect } from "react";

const FORM_KOSONG = { siswa: "", mataPelajaran: "", kelas: "", jenis: "tugas", keterangan: "", nilai: "" };

export default function NilaiPage() {
  const [nilaiList, setNilaiList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_KOSONG);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function fetchData() {
    setLoading(true);
    const [resNilai, resMapel, resKelas, resUsers] = await Promise.all([
      fetch("/api/nilai"),
      fetch("/api/mata-pelajaran"),
      fetch("/api/kelas"),
      fetch("/api/users"),
    ]);
    setNilaiList((await resNilai.json()).nilai || []);
    setMapelList((await resMapel.json()).mataPelajaran || []);
    setKelasList((await resKelas.json()).kelas || []);
    setSiswaList(((await resUsers.json()).users || []).filter((u) => u.role === "siswa"));
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/nilai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, nilai: Number(form.nilai) }),
    });
    const data = await res.json();

    if (!res.ok) { setError(data.error || "Terjadi kesalahan"); return; }

    setForm(FORM_KOSONG);
    setShowForm(false);
    fetchData();
  }

  async function handleDelete(id) {
    if (!confirm("Yakin mau hapus nilai ini?")) return;
    const res = await fetch(`/api/nilai/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { alert(data.error || "Gagal menghapus"); return; }
    fetchData();
  }

  return (
    <div>
      <div className="card-header">
        <h2>Input Nilai</h2>
        <button className="btn-auto" onClick={() => setShowForm(true)}>+ Input Nilai</button>
      </div>

      {(mapelList.length === 0 || kelasList.length === 0 || siswaList.length === 0) && !loading && (
        <div className="card" style={{ marginBottom: 20, background: "#fef3c7", color: "#92400e" }}>
          ⚠️ Pastikan sudah ada Mata Pelajaran, Kelas, dan Siswa sebelum input nilai.
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Input Nilai Baru</h3>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

            <select name="siswa" value={form.siswa} onChange={handleChange} required>
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map((s) => <option key={s._id} value={s._id}>{s.nama} {s.kelas ? `(${s.kelas})` : ""}</option>)}
            </select>

            <select name="mataPelajaran" value={form.mataPelajaran} onChange={handleChange} required>
              <option value="">-- Pilih Mata Pelajaran --</option>
              {mapelList.map((m) => <option key={m._id} value={m._id}>{m.nama}</option>)}
            </select>

            <select name="kelas" value={form.kelas} onChange={handleChange} required>
              <option value="">-- Pilih Kelas --</option>
              {kelasList.map((k) => <option key={k._id} value={k._id}>{k.nama}</option>)}
            </select>

            <select name="jenis" value={form.jenis} onChange={handleChange}>
              <option value="tugas">Tugas</option>
              <option value="quiz">Quiz</option>
              <option value="ujian">Ujian</option>
            </select>

            <input name="keterangan" placeholder="Keterangan, misal: Tugas Bab 2" value={form.keterangan} onChange={handleChange} />

            <input type="number" name="nilai" placeholder="Nilai (0-100)" min="0" max="100" value={form.nilai} onChange={handleChange} required />

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Simpan Nilai</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Siswa</th><th>Mapel</th><th>Kelas</th><th>Jenis</th><th>Keterangan</th><th>Nilai</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="table-empty">Memuat...</td></tr>
            ) : nilaiList.length === 0 ? (
              <tr><td colSpan={7} className="table-empty">Belum ada nilai</td></tr>
            ) : (
              nilaiList.map((n) => (
                <tr key={n._id}>
                  <td>{n.siswa?.nama || "-"}</td>
                  <td>{n.mataPelajaran?.nama || "-"}</td>
                  <td>{n.kelas?.nama || "-"}</td>
                  <td style={{ textTransform: "capitalize" }}>{n.jenis}</td>
                  <td>{n.keterangan || "-"}</td>
                  <td style={{ fontWeight: 700 }}>{n.nilai}</td>
                  <td>
                    <button className="btn-auto btn-danger" onClick={() => handleDelete(n._id)}>Hapus</button>
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