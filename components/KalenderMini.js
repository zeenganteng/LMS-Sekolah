"use client";

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function KalenderMini() {
  const now = new Date();
  const tahun = now.getFullYear();
  const bulan = now.getMonth();
  const hariIni = now.getDate();

  const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();
  const hariPertama = new Date(tahun, bulan, 1).getDay();

  const sel = [];
  for (let i = 0; i < hariPertama; i++) sel.push(null);
  for (let i = 1; i <= jumlahHari; i++) sel.push(i);

  return (
    <div style={{ background: "white", borderRadius: 8, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: "bold", marginBottom: 12, fontSize: 14 }}>
        {BULAN[bulan]} {tahun}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, fontSize: 12 }}>
        {HARI.map((h) => (
          <div key={h} style={{ textAlign: "center", color: "#94a3b8", fontWeight: "600" }}>{h}</div>
        ))}
        {sel.map((tgl, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              padding: "4px 0",
              borderRadius: "50%",
              background: tgl === hariIni ? "#2563eb" : "transparent",
              color: tgl === hariIni ? "white" : "#334155",
            }}
          >
            {tgl || ""}
          </div>
        ))}
      </div>
    </div>
  );
}
