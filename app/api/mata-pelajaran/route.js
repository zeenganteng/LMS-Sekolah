import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import MataPelajaran from "@/models/MataPelajaran";

async function pastikanAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await pastikanAdmin();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const mataPelajaran = await MataPelajaran.find()
    .populate("guruPengampu", "nama")
    .sort({ nama: 1 });
  return NextResponse.json({ mataPelajaran });
}

export async function POST(request) {
  const session = await pastikanAdmin();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const body = await request.json();
  const { nama, kode, guruPengampu } = body;

  if (!nama) {
    return NextResponse.json({ error: "Nama mata pelajaran wajib diisi" }, { status: 400 });
  }

  const sudahAda = await MataPelajaran.findOne({ nama });
  if (sudahAda) {
    return NextResponse.json({ error: "Mata pelajaran itu sudah ada" }, { status: 400 });
  }

  const mapelBaru = await MataPelajaran.create({
    nama,
    kode,
    guruPengampu: guruPengampu || undefined,
  });

  return NextResponse.json({ message: "Mata pelajaran berhasil dibuat", mapel: mapelBaru });
}
