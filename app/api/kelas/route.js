import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Kelas from "@/models/Kelas";

async function pastikanAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await pastikanAdmin();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const kelas = await Kelas.find().sort({ tingkat: 1, jurusan: 1, nomor: 1 });
  return NextResponse.json({ kelas });
}

export async function POST(request) {
  const session = await pastikanAdmin();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const body = await request.json();
  const { tingkat, jurusan } = body;

  if (!tingkat || !jurusan) {
    return NextResponse.json({ error: "Tingkat dan jurusan wajib diisi" }, { status: 400 });
  }

  // Hitung berapa kelas yang sudah ada dengan tingkat+jurusan yang sama, buat nomor urut berikutnya
  const jumlahSudahAda = await Kelas.countDocuments({ tingkat, jurusan });
  const nomor = jumlahSudahAda + 1;
  const nama = `${tingkat} ${jurusan} ${nomor}`;

  const kelasBaru = await Kelas.create({ tingkat, jurusan, nomor, nama });

  return NextResponse.json({ message: "Kelas berhasil dibuat", kelas: kelasBaru });
}