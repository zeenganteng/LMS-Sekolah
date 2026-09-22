import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LogoutButton from "@/components/LogoutButton";

export default async function SiswaDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <nav className="dashboard-nav">
        <span>Dashboard Siswa - {session.user.name}</span>
        <LogoutButton />
      </nav>
      <div className="dashboard-content">
        <h2>Selamat datang, Siswa</h2>
        <p>Di sini nanti kamu bisa: lihat materi, submit tugas, lihat nilai.</p>
      </div>
    </div>
  );
}
