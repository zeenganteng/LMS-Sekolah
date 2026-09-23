import mongoose from "mongoose";

const JURUSAN_LIST = ["PPLG", "TJKT", "BDR", "MPLB", "Perhotelan"];

const KelasSchema = new mongoose.Schema(
  {
    tingkat: {
      type: String,
      required: [true, "Tingkat wajib diisi"], // "10", "11", "12"
    },
    jurusan: {
      type: String,
      required: [true, "Jurusan wajib dipilih"],
      enum: JURUSAN_LIST,
    },
    nomor: {
      type: Number,
      required: true, // nomor urut rombel, misal 1, 2, 3
    },
    nama: {
      type: String,
      required: true,
      unique: true, // contoh hasil generate: "10 PPLG 1"
    },
  },
  { timestamps: true }
);

export const JURUSAN = JURUSAN_LIST;
export default mongoose.models.Kelas || mongoose.model("Kelas", KelasSchema);