import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Nilai from "@/models/Nilai";

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "guru"].includes(session.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  const item = await Nilai.findById(params.id);
  if (!item) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });

  if (session.user.role === "guru" && item.guru.toString() !== session.user.id) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await Nilai.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Nilai berhasil dihapus" });
}