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

export async function PUT(request, { params }) {
  const session = await pastikanAdmin();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const { id } = params;
  const body = await request.json();

  const kelasTerupdate = await Kelas.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!kelasTerupdate) {
    return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ message: "Kelas berhasil diupdate" });
}

export async function DELETE(request, { params }) {
  const session = await pastikanAdmin();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const { id } = params;

  const kelasTerhapus = await Kelas.findByIdAndDelete(id);
  if (!kelasTerhapus) {
    return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ message: "Kelas berhasil dihapus" });
}
