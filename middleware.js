import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Mapping: prefix URL -> role yang boleh akses
const roleRoutes = {
  "/dashboard/admin": ["admin"],
  "/dashboard/guru": ["guru"],
  "/dashboard/siswa": ["siswa"],
  "/dashboard/kurikulum": ["kurikulum"],
  "/dashboard/kepala-sekolah": ["kepala_sekolah"],
};

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    // Cek apakah pathname yang diakses termasuk halaman yang dibatasi role
    const matchedPrefix = Object.keys(roleRoutes).find((prefix) =>
      pathname.startsWith(prefix)
    );

    if (matchedPrefix) {
      const allowedRoles = roleRoutes[matchedPrefix];
      if (!allowedRoles.includes(role)) {
        // Kalau role gak sesuai, tendang ke halaman utama dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Wajib login dulu buat semua halaman yang kena middleware ini
      authorized: ({ token }) => !!token,
    },
  }
);

// Halaman mana saja yang wajib login (dan bisa kena cek role di atas)
export const config = {
  matcher: ["/dashboard/:path*"],
};
