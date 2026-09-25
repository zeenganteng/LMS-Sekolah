import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Nilai from "@/models/Nilai";

async function pastikanAdminAtauGuru() {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "guru"].includes(session.user.role)) return null;
  return session;
}

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();

  let filter = {};
  if (session.user.role === "guru") filter = { guru: session.user.id };
  if (session.user.role === "siswa") filter = { siswa: session.user.id };

  const nilai = await Nilai.find(filter)
    .populate("siswa", "nama")
    .populate("mataPelajaran", "nama")
    .populate("kelas", "nama")
    .sort({ createdAt: -1 });

  return NextResponse.json({ nilai });
}

export async function POST(request) {
  const session = await pastikanAdminAtauGuru();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const body = await request.json();
  const { siswa, mataPelajaran, kelas, jenis, keterangan, nilai } = body;

  if (!siswa || !mataPelajaran || !kelas || !jenis || nilai === undefined) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  const nilaiBaru = await Nilai.create({
    siswa, mataPelajaran, kelas, jenis, keterangan, nilai,
    guru: session.user.id,
  });

  return NextResponse.json({ message: "Nilai berhasil disimpan", nilai: nilaiBaru });
}