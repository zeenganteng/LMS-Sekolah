import mongoose from "mongoose";

const NilaiSchema = new mongoose.Schema(
  {
    siswa: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mataPelajaran: { type: mongoose.Schema.Types.ObjectId, ref: "MataPelajaran", required: true },
    kelas: { type: mongoose.Schema.Types.ObjectId, ref: "Kelas", required: true },
    jenis: { type: String, enum: ["tugas", "quiz", "ujian"], required: true },
    keterangan: { type: String }, // misal: nama tugas/quiz-nya apa
    nilai: { type: Number, required: true, min: 0, max: 100 },
    guru: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Nilai || mongoose.model("Nilai", NilaiSchema);