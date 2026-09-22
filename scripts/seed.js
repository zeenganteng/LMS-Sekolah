// Jalankan dengan: npm run seed
// Script ini bikin 1 akun contoh untuk tiap role, biar langsung bisa dicoba login

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema(
  {
    nama: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

const akunContoh = [
  { nama: "Admin Sekolah", email: "admin@sekolah.id", password: "admin123", role: "admin" },
  { nama: "Budi Guru", email: "guru@sekolah.id", password: "guru123", role: "guru" },
  { nama: "Siti Siswa", email: "siswa@sekolah.id", password: "siswa123", role: "siswa" },
  { nama: "Rina Kurikulum", email: "kurikulum@sekolah.id", password: "kurikulum123", role: "kurikulum" },
  { nama: "Bpk. Kepala Sekolah", email: "kepsek@sekolah.id", password: "kepsek123", role: "kepala_sekolah" },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Terhubung ke MongoDB...");

  for (const akun of akunContoh) {
    const sudahAda = await User.findOne({ email: akun.email });
    if (sudahAda) {
      console.log(`Skip, sudah ada: ${akun.email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(akun.password, 10);
    await User.create({ ...akun, password: hashedPassword });
    console.log(`Berhasil dibuat: ${akun.email} (password: ${akun.password})`);
  }

  console.log("\nSelesai seeding. Silakan login pakai salah satu akun di atas.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Gagal seeding:", err);
  process.exit(1);
});
