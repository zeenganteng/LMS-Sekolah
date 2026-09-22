"use client";

import { useState, useEffect } from "react";

const ROLE_LABEL = {
  admin: "Admin",
  guru: "Guru",
  siswa: "Siswa",
  kurikulum: "Kurikulum",
  kepala_sekolah: "Kepala Sekolah",
};

const FORM_KOSONG = {
  nama: "",
  email: "",
  password: "",
  role: "siswa",
  nisn_nip: "",
  kelas: "",
};

export default function KelolaUserClient() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_KOSONG);
  const [editingId, setEditingId] = useState(null); // null = mode tambah, isi id = mode edit
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
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

  function bukaFormEdit(user) {
    setForm({
      nama: user.nama,
      email: user.email,
      password: "", // dikosongkan, isi cuma kalau mau ganti password
      role: user.role,
      nisn_nip: user.nisn_nip || "",
      kelas: user.kelas || "",
    });
    setEditingId(user._id);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const url = editingId ? `/api/users/${editingId}` : "/api/users";
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
    fetchUsers();
  }

  async function handleDelete(id, nama) {
    const konfirmasi = confirm(`Yakin mau hapus user "${nama}"?`);
    if (!konfirmasi) return;

    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Gagal menghapus user");
      return;
    }

    fetchUsers();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Kelola User</h2>
        <button style={{ width: "auto", padding: "8px 20px" }} onClick={bukaFormTambah}>
          + Tambah User
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", padding: 20, borderRadius: 8, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginBottom: 16 }}>{editingId ? "Edit User" : "Tambah User Baru"}</h3>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

            <input
              name="nama"
              placeholder="Nama lengkap"
              value={form.nama}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder={editingId ? "Password baru (kosongkan jika tidak ganti)" : "Password"}
              value={form.password}
              onChange={handleChange}
              required={!editingId}
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{ display: "block", width: "100%", padding: 10, marginBottom: 12, borderRadius: 4, border: "1px solid #ccc" }}
            >
              {Object.entries(ROLE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <input
              name="nisn_nip"
              placeholder="NISN / NIP (opsional)"
              value={form.nisn_nip}
              onChange={handleChange}
            />
            <input
              name="kelas"
              placeholder="Kelas, misal X-A (opsional, untuk siswa)"
              value={form.kelas}
              onChange={handleChange}
            />

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">{editingId ? "Simpan Perubahan" : "Tambah User"}</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ backgroundColor: "#94a3b8" }}
              >
                Batal
              </button>
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
              <th style={{ padding: 12 }}>Nama</th>
              <th style={{ padding: 12 }}>Email</th>
              <th style={{ padding: 12 }}>Role</th>
              <th style={{ padding: 12 }}>NISN/NIP</th>
              <th style={{ padding: 12 }}>Kelas</th>
              <th style={{ padding: 12 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={{ padding: 12 }}>{user.nama}</td>
                <td style={{ padding: 12 }}>{user.email}</td>
                <td style={{ padding: 12 }}>{ROLE_LABEL[user.role] || user.role}</td>
                <td style={{ padding: 12 }}>{user.nisn_nip || "-"}</td>
                <td style={{ padding: 12 }}>{user.kelas || "-"}</td>
                <td style={{ padding: 12, display: "flex", gap: 8 }}>
                  <button
                    style={{ width: "auto", padding: "6px 14px", backgroundColor: "#f59e0b" }}
                    onClick={() => bukaFormEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ width: "auto", padding: "6px 14px", backgroundColor: "#dc2626" }}
                    onClick={() => handleDelete(user._id, user.nama)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#64748b" }}>
                  Belum ada user
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
