"use client";

import { useState, useEffect } from "react";

const FORM_KOSONG = { judul: "", deskripsi: "", mataPelajaran: "", kelas: "", fileUrl: "" };

export default function GuruMateriClient() {
  const [materiList, setMateriList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_KOSONG);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function fetchData() {
    setLoading(true);
    const [resMateri, resMapel, resKelas] = await Promise.all([
      fetch("/api/materi"),
      fetch("/api/mata-pelajaran"),
      fetch("/api/kelas"),
    ]);
    const dataMateri = await resMateri.json();
    const dataMapel = await resMapel.json();
    const dataKelas = await resKelas.json();

    setMateriList(dataMateri.materi || []);
    setMapelList(dataMapel.mataPelajaran || []);
    setKelasList(dataKelas.kelas || []);
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
      judul: item.judul,
      deskripsi: item.deskripsi || "",
      mataPelajaran: item.mataPelajaran?._id || "",
      kelas: item.kelas?._id || "",
      fileUrl: item.fileUrl || "",
    });
    setEditingId(item._id);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mapelList.length === 0 || kelasList.length === 0) {
      setError("Belum ada Mata Pelajaran/Kelas. Minta Admin untuk menambahkannya dulu.");
      return;
    }

    const url = editingId ? `/api/materi/${editingId}` : "/api/materi";
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

  async function handleDelete(id, judul) {
    if (!confirm(`Yakin mau hapus materi "${judul}"?`)) return;
    const res = await fetch(`/api/materi/${id}`, { method: "DELETE" });
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
        <h2>Materi Saya</h2>
        <button style={{ width: "auto", padding: "8px 20px" }} onClick={bukaFormTambah}>
          + Tambah Materi
        </button>
      </div>

      {(mapelList.length === 0 || kelasList.length === 0) && !loading && (
        <div style={{ background: "#fef3c7", padding: 14, borderRadius: 8, marginBottom: 20, color: "#92400e" }}>
          ⚠️ Belum ada Mata Pelajaran atau Kelas yang terdaftar. Minta Admin untuk menambahkannya dulu.
        </div>
      )}

      {showForm && (
        <div style={{ background: "white", padding: 20, borderRadius: 8, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginBottom: 16 }}>{editingId ? "Edit Materi" : "Tambah Materi Baru"}</h3>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <input name="judul" placeholder="Judul materi" value={form.judul} onChange={handleChange} required />

            <select
              name="mataPelajaran"
              value={form.mataPelajaran}
              onChange={handleChange}
              required
              style={{ display: "block", width: "100%", padding: 10, marginBottom: 12, borderRadius: 4, border: "1px solid #ccc" }}
            >
              <option value="">-- Pilih Mata Pelajaran --</option>
              {mapelList.map((m) => (
                <option key={m._id} value={m._id}>{m.nama}</option>
              ))}
            </select>

            <select
              name="kelas"
              value={form.kelas}
              onChange={handleChange}
              required
              style={{ display: "block", width: "100%", padding: 10, marginBottom: 12, borderRadius: 4, border: "1px solid #ccc" }}
            >
              <option value="">-- Pilih Kelas --</option>
              {kelasList.map((k) => (
                <option key={k._id} value={k._id}>{k.nama}</option>
              ))}
            </select>

            <textarea
              name="deskripsi"
              placeholder="Isi/ringkasan materi"
              value={form.deskripsi}
              onChange={handleChange}
              rows={4}
              style={{ display: "block", width: "100%", padding: 10, marginBottom: 12, borderRadius: 4, border: "1px solid #ccc", fontFamily: "inherit" }}
            />

            <input name="fileUrl" placeholder="Link file/video materi (opsional)" value={form.fileUrl} onChange={handleChange} />

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
              <th style={{ padding: 12 }}>Judul</th>
              <th style={{ padding: 12 }}>Mata Pelajaran</th>
              <th style={{ padding: 12 }}>Kelas</th>
              <th style={{ padding: 12 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {materiList.map((m) => (
              <tr key={m._id} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={{ padding: 12 }}>{m.judul}</td>
                <td style={{ padding: 12 }}>{m.mataPelajaran?.nama || "-"}</td>
                <td style={{ padding: 12 }}>{m.kelas?.nama || "-"}</td>
                <td style={{ padding: 12, display: "flex", gap: 8 }}>
                  <button style={{ width: "auto", padding: "6px 14px", backgroundColor: "#f59e0b" }} onClick={() => bukaFormEdit(m)}>Edit</button>
                  <button style={{ width: "auto", padding: "6px 14px", backgroundColor: "#dc2626" }} onClick={() => handleDelete(m._id, m.judul)}>Hapus</button>
                </td>
              </tr>
            ))}
            {materiList.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Belum ada materi. Yuk tambah materi pertamamu!</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
