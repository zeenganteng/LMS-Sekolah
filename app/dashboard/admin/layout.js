import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import AdminSidebar from "@/components/AdminSidebar";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            background: "white",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>{session.user.name}</span>
            <LogoutButton />
          </div>
        </header>
        <main style={{ flex: 1, background: "#f1f5f9", padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
