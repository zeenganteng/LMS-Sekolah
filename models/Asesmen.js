import mongoose from "mongoose";

const AsesmenSchema = new mongoose.Schema(
  {
    judul: { type: String, required: [true, "Judul wajib diisi"] },
    jenis: { type: String, enum: ["quiz", "ujian"], default: "quiz" },
    deskripsi: { type: String },
    mataPelajaran: { type: mongoose.Schema.Types.ObjectId, ref: "MataPelajaran", required: true },
    kelas: { type: mongoose.Schema.Types.ObjectId, ref: "Kelas", required: true },
    guru: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tanggal: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Asesmen || mongoose.model("Asesmen", AsesmenSchema);