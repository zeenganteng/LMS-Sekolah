import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

// Mapping role -> halaman dashboard masing-masing
const roleRedirect = {
  admin: "/dashboard/admin",
  guru: "/dashboard/guru",
  siswa: "/dashboard/siswa",
  kurikulum: "/dashboard/kurikulum",
  kepala_sekolah: "/dashboard/kepala-sekolah",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const target = roleRedirect[session.user.role] || "/login";
  redirect(target);
}