import mongoose from "mongoose";

const PengumumanSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: [true, "Judul pengumuman wajib diisi"],
    },
    isi: {
      type: String,
      required: [true, "Isi pengumuman wajib diisi"],
    },
    target: {
      type: String,
      required: true,
      enum: ["semua", "guru", "siswa"],
      default: "semua",
    },
    dibuatOleh: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Pengumuman || mongoose.model("Pengumuman", PengumumanSchema);