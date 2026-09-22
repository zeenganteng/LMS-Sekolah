import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

async function pastikanAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return null;
  }
  return session;
}

// PUT /api/users/[id] - update data user
export async function PUT(request, { params }) {
  const session = await pastikanAdmin();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  const { id } = params;
  const body = await request.json();
  const { nama, email, role, nisn_nip, kelas, password } = body;

  const dataUpdate = { nama, email, role, nisn_nip, kelas };

  // Password hanya diupdate kalau diisi (biar gak wajib ganti password tiap edit)
  if (password) {
    dataUpdate.password = await bcrypt.hash(password, 10);
  }

  const userTerupdate = await User.findByIdAndUpdate(id, dataUpdate, {
    new: true,
    runValidators: true,
  });

  if (!userTerupdate) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ message: "User berhasil diupdate" });
}

// DELETE /api/users/[id] - hapus user
export async function DELETE(request, { params }) {
  const session = await pastikanAdmin();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  const { id } = params;

  // Jangan biarkan admin hapus akunnya sendiri (biar gak ke-lock out)
  if (id === session.user.id) {
    return NextResponse.json(
      { error: "Tidak bisa menghapus akun sendiri" },
      { status: 400 }
    );
  }

  const userTerhapus = await User.findByIdAndDelete(id);

  if (!userTerhapus) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ message: "User berhasil dihapus" });
}
