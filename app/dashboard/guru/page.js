import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default async function GuruDashboard() {
  const session = await getServerSession(authOptions);

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
          }}
        >
          <strong>📚 Kelola Materi</strong>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
            Tambah dan kelola materi pembelajaran
          </p>
        </Link>

        <p style={{ marginTop: 20, color: "#94a3b8", fontSize: 14 }}>
          Fitur Tugas, Nilai, dan Absensi masih dalam pengembangan.
        </p>
      </div>
    </div>
  );
}
