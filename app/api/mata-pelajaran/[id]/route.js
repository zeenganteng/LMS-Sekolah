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

export async function PUT(request, { params }) {
  const session = await pastikanAdmin();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const { id } = params;
  const body = await request.json();

  const terupdate = await MataPelajaran.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!terupdate) {
    return NextResponse.json({ error: "Mata pelajaran tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ message: "Mata pelajaran berhasil diupdate" });
}

export async function DELETE(request, { params }) {
  const session = await pastikanAdmin();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const { id } = params;

  const terhapus = await MataPelajaran.findByIdAndDelete(id);
  if (!terhapus) {
    return NextResponse.json({ error: "Mata pelajaran tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ message: "Mata pelajaran berhasil dihapus" });
}
