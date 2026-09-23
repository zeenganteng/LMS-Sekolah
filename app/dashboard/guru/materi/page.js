import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import GuruMateriClient from "./GuruMateriClient";

export default async function GuruMateriPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "guru") {
    redirect("/dashboard");
  }

  return (
    <div>
      <nav className="dashboard-nav">
        <span>Dashboard Guru - {session.user.name}</span>
        <LogoutButton />
      </nav>
      <div className="dashboard-content">
        <Link href="/dashboard/guru" style={{ color: "#2563eb" }}>← Kembali ke Dashboard</Link>
        <div style={{ marginTop: 16 }}>
          <GuruMateriClient />
        </div>
      </div>
    </div>
  );
}
