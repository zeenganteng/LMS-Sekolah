# LMS Sekolah — Starter Project

Project dasar Learning Management System pakai **Next.js (App Router)** + **MongoDB (Mongoose)** + **NextAuth** dengan 5 role: Admin, Guru, Siswa, Kurikulum, Kepala Sekolah.

## Yang Sudah Ada di Starter Ini

- Koneksi ke MongoDB (`lib/mongodb.js`)
- Model User dengan 5 role (`models/User.js`)
- Login pakai NextAuth Credentials (email + password)
- Session menyimpan role user
- Middleware yang otomatis memblokir akses dashboard kalau role tidak sesuai
- 5 halaman dashboard dasar (masih kosong, tinggal dikembangkan)
- Script seed untuk bikin akun contoh tiap role

## Cara Menjalankan

### 1. Pastikan MongoDB Community Server sudah jalan
Cek di `services.msc` (Windows) — status "MongoDB Server" harus **Running**.

### 2. Install dependency
```bash
npm install
```

### 3. Setup environment variable
Copy file `.env.local.example` jadi `.env.local`:
```bash
cp .env.local.example .env.local
```
Isi `NEXTAUTH_SECRET` dengan string acak (bisa generate lewat [generate-secret.vercel.app](https://generate-secret.vercel.app/32) atau `openssl rand -base64 32`).

### 4. Bikin akun contoh (seed database)
```bash
npm run seed
```
Ini akan bikin 5 akun, satu untuk tiap role:

| Role | Email | Password |
|---|---|---|
| Admin | admin@sekolah.id | admin123 |
| Guru | guru@sekolah.id | guru123 |
| Siswa | siswa@sekolah.id | siswa123 |
| Kurikulum | kurikulum@sekolah.id | kurikulum123 |
| Kepala Sekolah | kepsek@sekolah.id | kepsek123 |

### 5. Jalankan development server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) — otomatis diarahkan ke halaman login.

## Struktur Folder

```
lms-sekolah/
  app/
    api/auth/[...nextauth]/route.js   → endpoint NextAuth
    login/page.js                     → halaman login
    dashboard/
      page.js                         → redirect otomatis sesuai role
      admin/page.js
      guru/page.js
      siswa/page.js
      kurikulum/page.js
      kepala-sekolah/page.js
    layout.js
    page.js                           → halaman utama ("/")
  components/
    SessionProviderWrapper.js
    LogoutButton.js
  lib/
    mongodb.js                        → koneksi database
    authOptions.js                    → konfigurasi NextAuth
  models/
    User.js                           → schema User + role
  middleware.js                       → proteksi route per role
  scripts/
    seed.js                           → bikin akun contoh
```

## Langkah Selanjutnya (Belum Ada di Starter Ini)

Ini baru fondasi dasar. Yang perlu ditambahkan sesuai kebutuhan:
- Model tambahan: Kelas, MataPelajaran, Materi, Tugas, Nilai, Absensi
- Halaman admin untuk kelola user (CRUD)
- Upload materi/video pembelajaran
- Fitur submit tugas untuk siswa
- Dashboard laporan untuk Kurikulum & Kepala Sekolah
- Styling yang lebih baik (saat ini masih CSS polos)

## Catatan Keamanan

Jangan lupa: file `.env.local` **jangan pernah di-commit ke Git**. Sudah otomatis dikecualikan lewat `.gitignore`, tapi tetap dicek ulang sebelum push ke GitHub, apalagi kalau repo-nya public.
