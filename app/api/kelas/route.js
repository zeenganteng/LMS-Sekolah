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
  const kelas = await Kelas.find().populate("waliKelas", "nama").sort({ nama: 1 });
  return NextResponse.json({ kelas });
}

export async function POST(request) {
  const session = await pastikanAdmin();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const body = await request.json();
  const { nama, tingkat, waliKelas } = body;

  if (!nama) {
    return NextResponse.json({ error: "Nama kelas wajib diisi" }, { status: 400 });
  }

  const sudahAda = await Kelas.findOne({ nama });
  if (sudahAda) {
    return NextResponse.json({ error: "Kelas dengan nama itu sudah ada" }, { status: 400 });
  }

  const kelasBaru = await Kelas.create({
    nama,
    tingkat,
    waliKelas: waliKelas || undefined,
  });

  return NextResponse.json({ message: "Kelas berhasil dibuat", kelas: kelasBaru });
}
