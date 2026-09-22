"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const KARTU = [
  { key: "totalGuru", label: "Total Guru", color: "#2563eb", icon: "👨‍🏫" },
  { key: "totalSiswa", label: "Total Siswa", color: "#16a34a", icon: "🎓" },
  { key: "totalKelas", label: "Total Kelas", color: "#7c3aed", icon: "🏫" },
  { key: "totalMataPelajaran", label: "Mata Pelajaran", color: "#ea580c", icon: "📖" },
];

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>
        Selamat Datang, {session?.user?.name || "Admin"}!
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {KARTU.map((k) => (
          <div
            key={k.key}
            style={{
              background: "white",
              borderRadius: 8,
              padding: 20,
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: `${k.color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              {k.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: "bold" }}>
                {loading ? "..." : stats?.[k.key] ?? 0}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, background: "white", borderRadius: 8, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <h3 style={{ marginBottom: 8 }}>Menu Cepat</h3>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Gunakan menu di sidebar kiri untuk mengelola Guru, Siswa, Kelas, dan Mata Pelajaran.
          Fitur Materi, Tugas, Quiz, Nilai, dan Laporan masih dalam pengembangan.
        </p>
      </div>
    </div>
  );
}
