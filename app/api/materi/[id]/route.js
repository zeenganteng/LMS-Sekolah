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

export async function PUT(request, { params }) {
  const session = await pastikanAdminAtauGuru();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const { id } = params;

  const materi = await Materi.findById(id);
  if (!materi) {
    return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
  }

  if (session.user.role === "guru" && materi.guru.toString() !== session.user.id) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();
  const { judul, deskripsi, mataPelajaran, kelas, fileUrl } = body;

  materi.judul = judul ?? materi.judul;
  materi.deskripsi = deskripsi ?? materi.deskripsi;
  materi.mataPelajaran = mataPelajaran ?? materi.mataPelajaran;
  materi.kelas = kelas ?? materi.kelas;
  materi.fileUrl = fileUrl ?? materi.fileUrl;

  await materi.save();

  return NextResponse.json({ message: "Materi berhasil diupdate" });
}

export async function DELETE(request, { params }) {
  const session = await pastikanAdminAtauGuru();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const { id } = params;

  const materi = await Materi.findById(id);
  if (!materi) {
    return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
  }

  if (session.user.role === "guru" && materi.guru.toString() !== session.user.id) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await Materi.findByIdAndDelete(id);

  return NextResponse.json({ message: "Materi berhasil dihapus" });
}
