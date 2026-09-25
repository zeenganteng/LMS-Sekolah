import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Pengumuman from "@/models/Pengumuman";

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  const { id } = params;

  const terhapus = await Pengumuman.findByIdAndDelete(id);
  if (!terhapus) {
    return NextResponse.json({ error: "Pengumuman tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ message: "Pengumuman berhasil dihapus" });
}