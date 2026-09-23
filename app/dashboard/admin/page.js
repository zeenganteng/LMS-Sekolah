"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import KalenderMini from "@/components/KalenderMini";

const KARTU = [
  { key: "totalGuru", label: "Total Guru", color: "#2563eb", icon: "👨‍🏫" },
  { key: "totalSiswa", label: "Total Siswa", color: "#16a34a", icon: "🎓" },
  { key: "totalKelas", label: "Total Kelas", color: "#7c3aed", icon: "🏫" },
  { key: "totalMataPelajaran", label: "Mata Pelajaran", color: "#ea580c", icon: "📖" },
];

function GrafikSederhana({ data }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.jumlah), 1);
  const lebar = 500;
  const tinggi = 140;
  const langkah = lebar / (data.length - 1 || 1);

  const points = data
    .map((d, i) => {
      const x = i * langkah;
      const y = tinggi - (d.jumlah / max) * (tinggi - 20);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${lebar} ${tinggi + 20}`} style={{ width: "100%", height: 160 }}>
      <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2" />
      {data.map((d, i) => {
        const x = i * langkah;
        const y = tinggi - (d.jumlah / max) * (tinggi - 20);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3" fill="#2563eb" />
            <text x={x} y={tinggi + 15} fontSize="10" textAnchor="middle" fill="#64748b">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [aktivitas, setAktivitas] = useState([]);
  const [grafik, setGrafik] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/aktivitas").then((r) => r.json()),
    ]).then(([statsData, aktivitasData]) => {
      setStats(statsData);
      setAktivitas(aktivitasData.aktivitas || []);
      setGrafik(aktivitasData.grafik || []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>
        Selamat Datang, {session?.user?.name || "Admin"}!
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "white", borderRadius: 8, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <h3 style={{ marginBottom: 12, fontSize: 15 }}>Grafik Aktivitas (Materi diupload, 7 hari terakhir)</h3>
          {loading ? <p style={{ color: "#64748b" }}>Memuat...</p> : <GrafikSederhana data={grafik} />}
        </div>
        <KalenderMini />
      </div>

      <div style={{ background: "white", borderRadius: 8, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <h3 style={{ marginBottom: 12, fontSize: 15 }}>Aktivitas Terbaru</h3>
        {loading ? (
          <p style={{ color: "#64748b" }}>Memuat...</p>
        ) : aktivitas.length === 0 ? (
          <p style={{ color: "#64748b" }}>Belum ada aktivitas.</p>
        ) : (
          aktivitas.map((a, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < aktivitas.length - 1 ? "1px solid #e2e8f0" : "none" }}>
              <div style={{ fontSize: 14 }}>{a.teks}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{a.detail}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
