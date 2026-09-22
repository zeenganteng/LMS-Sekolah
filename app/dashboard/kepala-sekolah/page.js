import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LogoutButton from "@/components/LogoutButton";

export default async function KepalaSekolahDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <nav className="dashboard-nav">
        <span>Dashboard Kepala Sekolah - {session.user.name}</span>
        <LogoutButton />
      </nav>
      <div className="dashboard-content">
        <h2>Selamat datang, Kepala Sekolah</h2>
        <p>Di sini nanti kamu bisa: lihat rekap laporan sekolah, approval tingkat tinggi.</p>
      </div>
    </div>
  );
}
