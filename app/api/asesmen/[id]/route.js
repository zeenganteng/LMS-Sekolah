import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Asesmen from "@/models/Asesmen";

async function pastikanAdminAtauGuru() {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "guru"].includes(session.user.role)) return null;
  return session;
}

export async function DELETE(request, { params }) {
  const session = await pastikanAdminAtauGuru();
  if (!session) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });

  await dbConnect();
  const asesmen = await Asesmen.findById(params.id);
  if (!asesmen) return NextResponse.json({ error: "Asesmen tidak ditemukan" }, { status: 404 });

  if (session.user.role === "guru" && asesmen.guru.toString() !== session.user.id) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await Asesmen.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Asesmen berhasil dihapus" });
}