import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Tugas from "@/models/Tugas";

async function pastikanAdminAtauGuru() {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "guru"].includes(session.user.role)) return null;
  return session;
}

export async function DELETE(request, { params }) {
  const session = await pastikanAdminAtauGuru();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const tugas = await Tugas.findById(params.id);
  if (!tugas) return NextResponse.json({ error: "Tugas tidak ditemukan" }, { status: 404 });

  if (session.user.role === "guru" && tugas.guru.toString() !== session.user.id) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await Tugas.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Tugas berhasil dihapus" });
}