import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import LogoutButton from "@/components/LogoutButton";
import KelolaUserClient from "./KelolaUserClient";
import Link from "next/link";

export default async function KelolaUserPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div>
      <nav className="dashboard-nav">
        <span>Dashboard Admin - {session.user.name}</span>
        <LogoutButton />
      </nav>
      <div className="dashboard-content">
        <Link href="/dashboard/admin" style={{ color: "#2563eb" }}>
          ← Kembali ke Dashboard
        </Link>
        <div style={{ marginTop: 16 }}>
          <KelolaUserClient />
        </div>
      </div>
    </div>
  );
}
