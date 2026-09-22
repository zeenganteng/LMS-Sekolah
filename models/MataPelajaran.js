import mongoose from "mongoose";

const MataPelajaranSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama mata pelajaran wajib diisi"], // contoh: "Matematika"
      unique: true,
    },
    kode: {
      type: String, // contoh: "MTK", opsional
    },
    guruPengampu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // relasi ke User dengan role guru
    },
  },
  { timestamps: true }
);

export default mongoose.models.MataPelajaran ||
  mongoose.model("MataPelajaran", MataPelajaranSchema);
