import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import GuruSidebar from "@/components/GuruSidebar";
import LogoutButton from "@/components/LogoutButton";

export default async function GuruLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "guru") {
    redirect("/dashboard");
  }

  const inisial = session.user.name?.charAt(0)?.toUpperCase() || "G";

  return (
    <div className="admin-shell">
      <GuruSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header className="admin-topbar">
          <div />
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="avatar">{inisial}</div>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{session.user.name}</span>
            <div style={{ width: 90 }}>
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}