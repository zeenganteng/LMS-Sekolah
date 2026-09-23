import mongoose from "mongoose";

const MateriSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: [true, "Judul materi wajib diisi"],
    },
    deskripsi: {
      type: String,
    },
    mataPelajaran: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MataPelajaran",
      required: [true, "Mata pelajaran wajib dipilih"],
    },
    kelas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kelas",
      required: [true, "Kelas wajib dipilih"],
    },
    guru: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Materi || mongoose.model("Materi", MateriSchema);
