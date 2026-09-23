"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  { label: "Dashboard", href: "/dashboard/admin" },
  { label: "Guru", href: "/dashboard/admin/guru" },
  { label: "Siswa", href: "/dashboard/admin/siswa" },
  { label: "Kelas", href: "/dashboard/admin/kelas" },
  { label: "Mata Pelajaran", href: "/dashboard/admin/mata-pelajaran" },
  { label: "Materi", href: "/dashboard/admin/materi" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ width: 220, background: "white", borderRight: "1px solid #e2e8f0" }}>
      <div
        style={{
          background: "#2563eb",
          color: "white",
          padding: "20px 16px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        LMS SEKOLAH
      </div>
      <nav style={{ padding: "12px 0" }}>
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
                display: "block",
                padding: "10px 20px",
                textDecoration: "none",
                color: aktif ? "#2563eb" : "#334155",
                background: aktif ? "#dbeafe" : "transparent",
                borderRight: aktif ? "3px solid #2563eb" : "3px solid transparent",
                fontWeight: aktif ? "600" : "400",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}