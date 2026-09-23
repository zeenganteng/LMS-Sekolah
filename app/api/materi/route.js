import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Materi from "@/models/Materi";

async function pastikanAdminAtauGuru() {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "guru"].includes(session.user.role)) return null;
  return session;
}

export async function GET() {
  const session = await pastikanAdminAtauGuru();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();

  const filter = session.user.role === "guru" ? { guru: session.user.id } : {};

  const materi = await Materi.find(filter)
    .populate("mataPelajaran", "nama")
    .populate("kelas", "nama")
    .populate("guru", "nama")
    .sort({ createdAt: -1 });

  return NextResponse.json({ materi });
}

export async function POST(request) {
  const session = await pastikanAdminAtauGuru();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const body = await request.json();
  const { judul, deskripsi, mataPelajaran, kelas, fileUrl } = body;

  if (!judul || !mataPelajaran || !kelas) {
    return NextResponse.json(
      { error: "Judul, mata pelajaran, dan kelas wajib diisi" },
      { status: 400 }
    );
  }

  const materiBaru = await Materi.create({
    judul,
    deskripsi,
    mataPelajaran,
    kelas,
    fileUrl,
    guru: session.user.id,
  });

  return NextResponse.json({ message: "Materi berhasil ditambahkan", materi: materiBaru });
}
