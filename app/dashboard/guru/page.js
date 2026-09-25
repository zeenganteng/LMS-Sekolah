import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Pengumuman from "@/models/Pengumuman";

export default async function GuruDashboard() {
  const session = await getServerSession(authOptions);

  await dbConnect();
  const pengumuman = await Pengumuman.find({ target: { $in: ["semua", "guru"] } })
    .sort({ createdAt: -1 })
    .limit(5);

  return (
    <div>
      <nav className="dashboard-nav">
        <span>Dashboard Guru - {session.user.name}</span>
        <LogoutButton />
      </nav>
      <div className="dashboard-content">
        <h2>Selamat datang, Guru</h2>
        <p style={{ marginBottom: 20 }}>Kelola materi pembelajaran kamu di sini.</p>

        <Link
          href="/dashboard/guru/materi"
          style={{
            display: "inline-block",
            padding: 20,
            background: "white",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            textDecoration: "none",
            color: "#1a1a1a",
            minWidth: 200,
            marginBottom: 24,
          }}
        >
          <strong>📚 Kelola Materi</strong>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
            Tambah dan kelola materi pembelajaran
          </p>
        </Link>

        <h3 style={{ marginBottom: 12 }}>📢 Pengumuman</h3>
        {pengumuman.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>Belum ada pengumuman.</p>
        ) : (
          pengumuman.map((p) => (
            <div
              key={p._id}
              style={{
                background: "white",
                padding: 16,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                marginBottom: 10,
              }}
            >
              <strong>{p.judul}</strong>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{p.isi}</p>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                {new Date(p.createdAt).toLocaleDateString("id-ID")}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}