import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";

const FITUR = [
  { icon: "👨‍🏫", judul: "Manajemen Guru", desc: "Kelola data guru dengan mudah dan terpusat." },
  { icon: "🎓", judul: "Manajemen Siswa", desc: "Data siswa per kelas dan jurusan tersusun rapi." },
  { icon: "🏫", judul: "Manajemen Kelas", desc: "Kelas dibuat otomatis berdasarkan tingkat & jurusan." },
  { icon: "📖", judul: "Mata Pelajaran", desc: "Atur mata pelajaran dan guru pengampunya." },
  { icon: "📚", judul: "Materi Pembelajaran", desc: "Guru upload materi, siswa akses kapan saja." },
  { icon: "🔐", judul: "5 Peran Pengguna", desc: "Admin, Guru, Siswa, Kurikulum, dan Kepala Sekolah." },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="landing-brand">
          <div className="landing-logo">🎓</div>
          <span>LMS Sekolah</span>
        </div>
        <Link href="/login" className="btn-auto" style={{ textDecoration: "none" }}>
          Masuk
        </Link>
      </header>

      <section className="landing-hero">
        <h1>Sistem Manajemen Pembelajaran Sekolah</h1>
        <p>
          Satu platform untuk Admin, Guru, Siswa, Kurikulum, dan Kepala Sekolah —
          kelola kelas, mata pelajaran, dan materi pembelajaran dalam satu tempat.
        </p>
        <Link href="/login" className="landing-cta">
          Masuk ke Sistem →
        </Link>
      </section>

      <section className="landing-features">
        <h2 style={{ textAlign: "center", marginBottom: 32 }}>Fitur Utama</h2>
        <div className="landing-grid">
          {FITUR.map((f) => (
            <div key={f.judul} className="landing-card">
              <div className="landing-card-icon">{f.icon}</div>
              <h3>{f.judul}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        © {new Date().getFullYear()} LMS Sekolah. Dibuat untuk mendukung pembelajaran digital.
      </footer>
    </div>
  );
}