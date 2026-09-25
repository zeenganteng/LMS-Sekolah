import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
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
      <h2 style={{ marginBottom: 20 }}>Selamat datang, {session.user.name}!</h2>

      <h3 style={{ marginBottom: 12 }}>📢 Pengumuman</h3>
      {pengumuman.length === 0 ? (
        <div className="card table-empty">Belum ada pengumuman.</div>
      ) : (
        pengumuman.map((p) => (
          <div key={p._id} className="card" style={{ marginBottom: 10 }}>
            <strong>{p.judul}</strong>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{p.isi}</p>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              {new Date(p.createdAt).toLocaleDateString("id-ID")}
            </span>
          </div>
        ))
      )}
    </div>
  );
}