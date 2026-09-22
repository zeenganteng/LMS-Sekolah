"use client";

import { useState, useEffect } from "react";

const FORM_KOSONG = { nama: "", tingkat: "", waliKelas: "" };

export default function KelasPage() {
  const [kelasList, setKelasList] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_KOSONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function fetchData() {
    setLoading(true);
    const [resKelas, resUsers] = await Promise.all([
      fetch("/api/kelas"),
      fetch("/api/users"),
    ]);
    const dataKelas = await resKelas.json();
    const dataUsers = await resUsers.json();

    setKelasList(dataKelas.kelas || []);
    setGuruList((dataUsers.users || []).filter((u) => u.role === "guru"));
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function bukaFormTambah() {
    setForm(FORM_KOSONG);
    setEditingId(null);
    setError("");
    setShowForm(true);
  }

  function bukaFormEdit(item) {
    setForm({
      nama: item.nama,
      tingkat: item.tingkat || "",
      waliKelas: item.waliKelas?._id || "",
    });
    setEditingId(item._id);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const url = editingId ? `/api/kelas/${editingId}` : "/api/kelas";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
        <button style={{ width: "auto", padding: "8px 20px" }} onClick={bukaFormTambah}>
          + Tambah Kelas
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", padding: 20, borderRadius: 8, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginBottom: 16 }}>{editingId ? "Edit Kelas" : "Tambah Kelas Baru"}</h3>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <input name="nama" placeholder="Nama kelas, misal: X-A" value={form.nama} onChange={handleChange} required />
            <input name="tingkat" placeholder="Tingkat, misal: X" value={form.tingkat} onChange={handleChange} />
            <select
              name="waliKelas"
              value={form.waliKelas}
              onChange={handleChange}
              style={{ display: "block", width: "100%", padding: 10, marginBottom: 12, borderRadius: 4, border: "1px solid #ccc" }}
            >
              <option value="">-- Pilih Wali Kelas (opsional) --</option>
              {guruList.map((g) => (
                <option key={g._id} value={g._id}>{g.nama}</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">{editingId ? "Simpan" : "Tambah"}</button>
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
              <th style={{ padding: 12 }}>Nama Kelas</th>
              <th style={{ padding: 12 }}>Tingkat</th>
              <th style={{ padding: 12 }}>Wali Kelas</th>
              <th style={{ padding: 12 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kelasList.map((k) => (
              <tr key={k._id} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={{ padding: 12 }}>{k.nama}</td>
                <td style={{ padding: 12 }}>{k.tingkat || "-"}</td>
                <td style={{ padding: 12 }}>{k.waliKelas?.nama || "-"}</td>
                <td style={{ padding: 12, display: "flex", gap: 8 }}>
                  <button style={{ width: "auto", padding: "6px 14px", backgroundColor: "#f59e0b" }} onClick={() => bukaFormEdit(k)}>Edit</button>
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
