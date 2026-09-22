import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LogoutButton from "@/components/LogoutButton";

export default async function KurikulumDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <nav className="dashboard-nav">
        <span>Dashboard Kurikulum - {session.user.name}</span>
        <LogoutButton />
      </nav>
      <div className="dashboard-content">
        <h2>Selamat datang, Tim Kurikulum</h2>
        <p>Di sini nanti kamu bisa: review materi guru, lihat laporan akademik lintas kelas.</p>
      </div>
    </div>
  );
}
