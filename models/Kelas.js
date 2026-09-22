import mongoose from "mongoose";

const KelasSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama kelas wajib diisi"], // contoh: "X-A", "XI IPA 2"
      unique: true,
    },
    tingkat: {
      type: String, // contoh: "X", "XI", "XII"
    },
    waliKelas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // relasi ke User dengan role guru
    },
  },
  { timestamps: true }
);

export default mongoose.models.Kelas || mongoose.model("Kelas", KelasSchema);
