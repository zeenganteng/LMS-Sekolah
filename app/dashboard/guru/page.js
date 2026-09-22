import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LogoutButton from "@/components/LogoutButton";

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
        <p>Di sini nanti kamu bisa: kelola materi, input nilai, absensi kelas.</p>
      </div>
    </div>
  );
}
