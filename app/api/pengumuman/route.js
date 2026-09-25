import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Pengumuman from "@/models/Pengumuman";

// GET - semua role yang login boleh lihat, tapi hasilnya difilter sesuai target
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();

  // Admin lihat semua pengumuman, role lain cuma lihat yang "semua" atau sesuai rolenya
  const filter =
    session.user.role === "admin"
      ? {}
      : { target: { $in: ["semua", session.user.role] } };

  const pengumuman = await Pengumuman.find(filter)
    .populate("dibuatOleh", "nama")
    .sort({ createdAt: -1 });

  return NextResponse.json({ pengumuman });
}

// POST - cuma admin yang boleh bikin pengumuman
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  const body = await request.json();
  const { judul, isi, target } = body;

  if (!judul || !isi) {
    return NextResponse.json({ error: "Judul dan isi wajib diisi" }, { status: 400 });
  }

  const pengumumanBaru = await Pengumuman.create({
    judul,
    isi,
    target: target || "semua",
    dibuatOleh: session.user.id,
  });

  return NextResponse.json({ message: "Pengumuman berhasil dibuat", pengumuman: pengumumanBaru });
}