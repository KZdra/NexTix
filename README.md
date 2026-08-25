# 🚀 NexTix - Enterprise Helpdesk & ITSM SPBE Portal

[![Vue 3](https://img.shields.io/badge/Vue.js-v3.4+-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-State_Management-FFD859?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-UI_Components-409EFF?style=for-the-badge&logo=element-plus&logoColor=white)](https://element-plus.org/)
[![ITIL v4 & SPBE](https://img.shields.io/badge/Standard-ITIL_v4_%2F_SPBE-blueviolet?style=for-the-badge)](https://spbe.go.id/)

**NexTix** adalah platform sistem layanan bantuan (*Helpdesk*) dan tata kelola teknologi informasi modern yang dirancang khusus untuk instansi pemerintahan, Badan Layanan Umum (BLU), maupun korporat. Platform ini telah diselaraskan dengan standar tata kelola global **ITIL v4**, **ISO/IEC 20000**, serta kerangka **Sistem Pemerintahan Berbasis Elektronik (SPBE)** dan **PermenPAN-RB No. 14 Tahun 2017** (Survei Kepuasan Masyarakat / IKM).

---

## 🏛️ Standarisasi & Fitur Utama

### 1. Multi-Departemen & Unit Kerja OPD
- Pengelompokan tiket berbasis dinas/OPD (*Diskominfo, BKPSDM, BPKAD, Setda, Inspektorat, dll.*).
- Filter pencarian dan penugasan tiket terarah ke masing-masing bidang/divisi teknis.

### 2. Matriks Kebijakan SLA & Countdown Real-Time
- Penghitungan otomatis target waktu respon (*First Response Due*) dan target waktu penyelesaian (*Resolution Due*).
- **Matriks SLA**:
  - `Critical`: Respon 15 Menit / Solusi 2 Jam
  - `Block`: Respon 20 Menit / Solusi 3 Jam
  - `Major`: Respon 30 Menit / Solusi 4 Jam
  - `Normal`: Respon 60 Menit / Solusi 8 Jam
  - `Minor / Trivial`: Respon 120 Menit / Solusi 24 Jam
- Badge dinamis countdown sisa waktu, indikator *SLA Met* (Tepat Waktu), dan peringatan *SLA Breached* (Terlambat).

### 3. Survei Kepuasan Pengguna (CSAT / IKM)
- Kuesioner interaktif bintang 1–5 ⭐ dan masukan kualitatif saat tiket telah diselesaikan (`Closed`).
- Tab Analisis IKM pada halaman laporan untuk menghitung persentase kepuasan, rata-rata skor, dan rekap ulasan pengguna.

### 4. Kepatuhan Log Audit SPBE & BPK
- Pencatatan seluruh aktivitas penting sistem (*Perubahan Status Tiket, Tambah Komentar, Perubahan Master Data, dll.*).
- Modal inspeksi *Diff Data* menampilkan nilai sebelum (`old_values`) dan sesudah (`new_values`), IP Address, User Agent, dan Timestamp.

### 5. Ekspor Berita Acara Penyelesaian Pekerjaan (BAPP PDF)
- Cetak otomatis surat dinas resmi **Berita Acara Perbaikan (BAPP)** berformat PDF siap tanda tangan teknisi dan pelapor sebagai bukti fisik pekerjaan.

### 6. Desain Antarmuka Modern & Responsif
- **Sidebar Navigasi Modern**: Sidebar fixed di desktop dan off-canvas drawer di mobile.
- **Dark Glassmorphic Landing Page**: Dilengkapi animasi glowing, widget pelacak tiket instan, dan panduan FAQ.

---

## 👥 Matriks Hak Akses Pengguna (RBAC)

| Fitur / Modul | Client (Pelapor) | Support (Teknisi) | Admin (Super Admin) |
| :--- | :---: | :---: | :---: |
| **Ajukan Tiket Baru** | ✅ Ya | ✅ Ya | ✅ Ya |
| **Akses Antrean Tiket** | 🔒 Tiket Sendiri | 👁️ Semua Tiket | 👁️ Semua Tiket |
| **Ubah Status Tiket (`Open` $\rightarrow$ `In Progress` $\rightarrow$ `Closed`)** | ❌ Dilarang | ✅ Ya | ✅ Ya |
| **Buka Kembali Tiket (`Re-open`)** | ❌ Dilarang | ✅ Ya | ✅ Ya |
| **Beri Rating & Ulasan (CSAT)** | ✅ Wajib Pelapor | ❌ Hanya pantau | ❌ Hanya pantau |
| **Unduh Berita Acara (BAPP PDF)** | ✅ Ya (Saat `Closed`) | ✅ Ya (Saat `Closed`) | ✅ Ya (Saat `Closed`) |
| **Hapus Tiket** | ❌ Dilarang | ❌ Dilarang | ✅ Ya |
| **Master Data OPD & Kategori** | ❌ Tidak ada akses | ❌ Tidak ada akses | ✅ CRUD Penuh |
| **Manajemen Pengguna (User)** | ❌ Tidak ada akses | ❌ Tidak ada akses | ✅ CRUD Penuh |
| **Laporan & Ekspor (Excel/PDF)** | ❌ Tidak ada akses | ❌ Tidak ada akses | ✅ Analisis Penuh |
| **Log Audit SPBE (Diff JSON)** | ❌ Tidak ada akses | ❌ Tidak ada akses | ✅ Inspeksi Penuh |

---

## 🛠️ Arsitektur & Struktur Direktori

```text
NexTix/
├── src/
│   ├── assets/              # Asset gambar, ikon, dan styling global
│   ├── components/          # Komponen UI reusable
│   │   ├── layouts/         # Layout wrapper (MainLayout dengan Sidebar)
│   │   ├── SlaBadge.vue     # Komponen kalkulator & status badge SLA
│   │   ├── RatingModal.vue  # Modal penilaian bintang CSAT / IKM
│   │   ├── Sidebar.vue      # Sidebar navigasi modern responsif
│   │   └── PriorityIcon.vue # Indikator visual prioritas tiket
│   ├── router/              # Konfigurasi rute & Route Guards (RBAC)
│   ├── stores/              # Pinia Global State Management
│   │   ├── authStore.ts       # Autentikasi & manajemen sesi token
│   │   ├── ticketStore.ts     # Manajemen tiket, filter, & BAPP export
│   │   ├── departmentStore.ts # CRUD & data active unit kerja OPD
│   │   ├── slaStore.ts        # Matriks kebijakan & statistik SLA
│   │   ├── ratingStore.ts     # Survei CSAT & analitik IKM
│   │   ├── auditLogStore.ts   # Log audit kepatuhan SPBE & BPK
│   │   ├── kategoriStore.ts   # Manajemen master kategori kendala
│   │   └── userStore.ts       # Manajemen user & role
│   ├── utils/               # Axios instance & error handling interceptor
│   └── views/               # Halaman antarmuka pengguna
│       ├── admin/           # Halaman admin (Departemen, Audit Log, User, Kategori, Report)
│       ├── auth/            # Halaman Login
│       ├── misc/            # FAQ & Pusat Bantuan
│       ├── ticket/          # Daftar Tiket & Detail Tiket interaktif
│       ├── HomeView.vue     # Dashboard analitik pengguna
│       └── LandingPageView.vue # Halaman depan (Landing page animasi)
├── MANUAL_BOOK.md           # Panduan Lengkap Penggunaan Aplikasi
└── package.json
```

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Kebutuhan Sistem
- **Node.js**: v18.0.0 atau lebih baru
- **NPM**: v9.0.0 atau lebih baru
- **Backend API**: [Helpdesk-Api Laravel Repository](https://github.com/KZdra/helpdesk-api) aktif di `http://127.0.0.1:8000`

### 2. Instalasi Dependensi
```bash
# Clone repository
git clone https://github.com/KZdra/NexTix.git

# Masuk ke direktori proyek
cd NexTix

# Install paket dependensi
npm install
```

### 3. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Aplikasi frontend akan berjalan secara lokal di `http://localhost:5173` (atau port yang ditentukan).

### 4. Build untuk Lingkungan Produksi
```bash
# Type check & build bundle
npm run build-only

# Preview hasil build
npm run preview
```

---

## 📖 Buku Panduan Pengguna (*User Manual*)
Dokumentasi tata cara penggunaan langkah demi langkah untuk setiap peran (Client, Teknisi, Admin) telah disediakan secara komprehensif pada file:
👉 **[Buku Panduan Pengguna (MANUAL_BOOK.md)](file:///c:/Users/Indruyy/Documents/codingan/tiketing/NexTix/MANUAL_BOOK.md)**

---

## 📄 Lisensi
Proyek ini dikembangkan di bawah lisensi MIT. Hak cipta &copy; 2026 NexTix Helpdesk SPBE.
