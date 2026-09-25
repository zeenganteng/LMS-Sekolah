import mongoose from "mongoose";

const TugasSchema = new mongoose.Schema(
  {
    judul: { type: String, required: [true, "Judul tugas wajib diisi"] },
    deskripsi: { type: String },
    mataPelajaran: { type: mongoose.Schema.Types.ObjectId, ref: "MataPelajaran", required: true },
    kelas: { type: mongoose.Schema.Types.ObjectId, ref: "Kelas", required: true },
    guru: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deadline: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Tugas || mongoose.model("Tugas", TugasSchema);