"use client";

import { useState, useEffect } from "react";

const TINGKAT_LIST = ["10", "11", "12"];
const JURUSAN_LIST = ["PPLG", "TJKT", "BDR", "MPLB", "Perhotelan"];

export default function KelasPage() {
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tingkat, setTingkat] = useState(TINGKAT_LIST[0]);
  const [jurusan, setJurusan] = useState(JURUSAN_LIST[0]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function fetchData() {
    setLoading(true);
    const res = await fetch("/api/kelas");
    const data = await res.json();
    setKelasList(data.kelas || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/kelas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tingkat, jurusan }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Terjadi kesalahan");
      return;
    }

    setShowForm(false);
    fetchData();
  }

  async function handleDelete(id, nama) {
    if (!confirm(`Yakin mau hapus kelas "${nama}"?`)) return;
    const res = await fetch(`/api/kelas/${id}`, { method: "DELETE" });
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
        <h2>Kelola Kelas</h2>
        <button className="btn-auto" onClick={() => setShowForm(true)}>
          + Tambah Kelas
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 8 }}>Tambah Kelas Baru</h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
            Nama & nomor rombel dibuat otomatis. Contoh: Tingkat 10 + Jurusan PPLG →
            "10 PPLG 1", ditambah lagi jadi "10 PPLG 2".
          </p>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

            <label>Tingkat</label>
            <select value={tingkat} onChange={(e) => setTingkat(e.target.value)}>
              {TINGKAT_LIST.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <label>Jurusan</label>
            <select value={jurusan} onChange={(e) => setJurusan(e.target.value)}>
              {JURUSAN_LIST.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Tambah Kelas</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nama Kelas</th>
              <th>Tingkat</th>
              <th>Jurusan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="table-empty">Memuat data...</td></tr>
            ) : kelasList.length === 0 ? (
              <tr><td colSpan={4} className="table-empty">Belum ada kelas</td></tr>
            ) : (
              kelasList.map((k) => (
                <tr key={k._id}>
                  <td style={{ fontWeight: 600 }}>{k.nama}</td>
                  <td>{k.tingkat}</td>
                  <td>{k.jurusan}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-auto btn-danger" onClick={() => handleDelete(k._id, k.nama)}>
                        Hapus
                      </button>
                    </div>
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