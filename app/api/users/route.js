import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// Helper: cek apakah yang akses adalah admin
async function pastikanAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return null;
  }
  return session;
}

// GET /api/users - ambil semua user (tanpa password)
export async function GET() {
  const session = await pastikanAdmin();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  const users = await User.find().sort({ createdAt: -1 });

  return NextResponse.json({ users });
}

// POST /api/users - bikin user baru
export async function POST(request) {
  const session = await pastikanAdmin();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  const body = await request.json();
  const { nama, email, password, role, nisn_nip, kelas } = body;

  if (!nama || !email || !password || !role) {
    return NextResponse.json(
      { error: "Nama, email, password, dan role wajib diisi" },
      { status: 400 }
    );
  }

  const emailSudahAda = await User.findOne({ email });
  if (emailSudahAda) {
    return NextResponse.json(
      { error: "Email sudah terdaftar" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userBaru = await User.create({
    nama,
    email,
    password: hashedPassword,
    role,
    nisn_nip,
    kelas,
  });

  return NextResponse.json({
    message: "User berhasil dibuat",
    user: {
      id: userBaru._id,
      nama: userBaru.nama,
      email: userBaru.email,
      role: userBaru.role,
    },
  });
}
