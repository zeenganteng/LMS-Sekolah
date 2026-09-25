import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LogoutButton from "@/components/LogoutButton";
import dbConnect from "@/lib/mongodb";
import Pengumuman from "@/models/Pengumuman";

export default async function SiswaDashboard() {
  const session = await getServerSession(authOptions);

  await dbConnect();
  const pengumuman = await Pengumuman.find({ target: { $in: ["semua", "siswa"] } })
    .sort({ createdAt: -1 })
    .limit(5);

  return (
    <div>
      <nav className="dashboard-nav">
        <span>Dashboard Siswa - {session.user.name}</span>
        <LogoutButton />
      </nav>
      <div className="dashboard-content">
        <h2>Selamat datang, Siswa</h2>
        <p style={{ marginBottom: 20 }}>Di sini nanti kamu bisa: lihat materi, submit tugas, lihat nilai.</p>

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