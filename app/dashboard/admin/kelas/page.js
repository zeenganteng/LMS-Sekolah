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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Kelola Kelas</h2>
        <button style={{ width: "auto", padding: "8px 20px" }} onClick={() => setShowForm(true)}>
          + Tambah Kelas
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", padding: 20, borderRadius: 8, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginBottom: 16 }}>Tambah Kelas Baru</h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
            Nama kelas & nomor rombel otomatis dibuat. Contoh: pilih Tingkat 10 + Jurusan PPLG → jadi "10 PPLG 1", tambah lagi otomatis "10 PPLG 2".
          </p>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

            <label style={{ fontSize: 13, color: "#334155" }}>Tingkat</label>
            <select
              value={tingkat}
              onChange={(e) => setTingkat(e.target.value)}
              style={{ display: "block", width: "100%", padding: 10, marginBottom: 12, marginTop: 4, borderRadius: 4, border: "1px solid #ccc" }}
            >
              {TINGKAT_LIST.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <label style={{ fontSize: 13, color: "#334155" }}>Jurusan</label>
            <select
              value={jurusan}
              onChange={(e) => setJurusan(e.target.value)}
              style={{ display: "block", width: "100%", padding: 10, marginBottom: 12, marginTop: 4, borderRadius: 4, border: "1px solid #ccc" }}
            >
              {JURUSAN_LIST.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Tambah Kelas</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ backgroundColor: "#94a3b8" }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#e2e8f0", textAlign: "left" }}>
              <th style={{ padding: 12 }}>Tingkat</th>
              <th style={{ padding: 12 }}>Nama Kelas</th>
              
              <th style={{ padding: 12 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kelasList.map((k) => (
              <tr key={k._id} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{k.nama}</td>
                <td style={{ padding: 12 }}>{k.tingkat}</td>
                <td style={{ padding: 12 }}>{k.jurusan}</td>
                <td style={{ padding: 12 }}>
                  <button style={{ width: "auto", padding: "6px 14px", backgroundColor: "#dc2626" }} onClick={() => handleDelete(k._id, k.nama)}>Hapus</button>
                </td>
              </tr>
            ))}
            {kelasList.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Belum ada kelas</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}