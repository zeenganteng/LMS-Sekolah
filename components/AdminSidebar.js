"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  { label: "Dashboard", href: "/dashboard/admin", icon: "📊" },
  { label: "Guru", href: "/dashboard/admin/guru", icon: "👨‍🏫" },
  { label: "Siswa", href: "/dashboard/admin/siswa", icon: "🎓" },
  { label: "Kelas", href: "/dashboard/admin/kelas", icon: "🏫" },
  { label: "Mata Pelajaran", href: "/dashboard/admin/mata-pelajaran", icon: "📖" },
  { label: "Pengumuman", href: "/dashboard/admin/pengumuman", icon: "📢" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        background: "white",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "22px 20px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "#4f46e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🎓
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>LMS Sekolah</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Panel Admin</div>
        </div>
      </div>

      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {MENU.map((item) => {
          const aktif =
            item.href === "/dashboard/admin"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                marginBottom: 4,
                borderRadius: 8,
                textDecoration: "none",
                color: aktif ? "#4f46e5" : "#334155",
                background: aktif ? "#eef2ff" : "transparent",
                fontWeight: aktif ? 600 : 500,
                fontSize: 14,
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}