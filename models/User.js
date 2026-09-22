import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama wajib diisi"],
    },
    email: {
      type: String,
      required: [true, "Email wajib diisi"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
      select: false, // biar password gak ikut ke-fetch tiap query User biasa
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "guru", "siswa", "kurikulum", "kepala_sekolah"],
      default: "siswa",
    },
    // field tambahan opsional, sesuaikan lagi nanti
    nisn_nip: {
      type: String, // NISN untuk siswa, NIP untuk guru/staff
    },
    kelas: {
      type: String, // relevan untuk role siswa, misal "X-A"
    },
  },
  { timestamps: true }
);

// Kalau model User sudah pernah didefinisikan (karena hot-reload di dev),
// pakai yang sudah ada. Kalau belum, baru bikin.
export default mongoose.models.User || mongoose.model("User", UserSchema);
