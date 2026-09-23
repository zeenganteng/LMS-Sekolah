import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Materi from "@/models/Materi";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();

  // Ambil materi terbaru sebagai sumber aktivitas (data asli, bukan dummy)
  const materiTerbaru = await Materi.find()
    .populate("guru", "nama")
    .populate("mataPelajaran", "nama")
    .sort({ createdAt: -1 })
    .limit(5);

  const aktivitas = materiTerbaru.map((m) => ({
    teks: `${m.guru?.nama || "Seseorang"} mengupload materi baru`,
    detail: `${m.mataPelajaran?.nama || "-"} - ${m.judul}`,
    waktu: m.createdAt,
  }));

  // Data untuk grafik ringkas: jumlah materi yang dibuat per hari, 7 hari terakhir
  const tujuhHariLalu = new Date();
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6);
  tujuhHariLalu.setHours(0, 0, 0, 0);

  const materiSeminggu = await Materi.find({ createdAt: { $gte: tujuhHariLalu } });

  const grafik = [];
  for (let i = 6; i >= 0; i--) {
    const tanggal = new Date();
    tanggal.setDate(tanggal.getDate() - i);
    const label = tanggal.toLocaleDateString("id-ID", { weekday: "short" });
    const jumlah = materiSeminggu.filter((m) => {
      const d = new Date(m.createdAt);
      return d.toDateString() === tanggal.toDateString();
    }).length;
    grafik.push({ label, jumlah });
  }

  return NextResponse.json({ aktivitas, grafik });
}
