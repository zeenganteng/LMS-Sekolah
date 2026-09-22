import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Kelas from "@/models/Kelas";
import MataPelajaran from "@/models/MataPelajaran";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();

  const [totalGuru, totalSiswa, totalKelas, totalMataPelajaran] = await Promise.all([
    User.countDocuments({ role: "guru" }),
    User.countDocuments({ role: "siswa" }),
    Kelas.countDocuments(),
    MataPelajaran.countDocuments(),
  ]);

  return NextResponse.json({
    totalGuru,
    totalSiswa,
    totalKelas,
    totalMataPelajaran,
  });
}
