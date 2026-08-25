# 📘 BUKU PANDUAN PENGGUNA (MANUAL BOOK)
# SISTEM INFORMASI HELPDESK & TATA KELOLA IT - NEXTIX

**Versi Dokumen:** 2.0 (Standar ITIL v4 / ISO 20000 / SPBE)  
**Terakhir Diperbarui:** 26 Agustus 2026  
**Sasaran Pengguna:** Pelapor (Klien/Pegawai OPD), Tim Teknisi Helpdesk (Support), dan Administrator IT

---

## 📑 DAFTAR ISI
1. [BAB 1: PENDAHULUAN & PENGENALAN SISTEM](#bab-1-pendahuluan--pengenalan-sistem)
2. [BAB 2: PANDUAN PENGGUNA / PELAPOR (CLIENT)](#bab-2-panduan-pengguna--pelapor-client)
   - 2.1 Masuk ke Sistem (Login)
   - 2.2 Mengajukan Tiket Kendala Baru
   - 2.3 Memantau Progres & Berdiskusi via Tiket
   - 2.4 Mengunduh Berita Acara Perbaikan (BAPP PDF)
   - 2.5 Mengisi Survei Kepuasan Layanan (CSAT / IKM ⭐)
3. [BAB 3: PANDUAN TEKNISI HELPDESK (SUPPORT)](#bab-3-panduan-teknisi-helpdesk-support)
   - 3.1 Memantau Antrean Tiket Masuk & Target SLA
   - 3.2 Menugaskan & Mengambil Tiket
   - 3.3 Mengubah Status Pengerjaan (In Progress)
   - 3.4 Berkomunikasi Menggunakan Template Respon Cepat
   - 3.5 Menyelesaikan Tiket (Closed) & Menginput Catatan Solusi
   - 3.6 Membuka Kembali Tiket (Re-open)
4. [BAB 4: PANDUAN ADMINISTRATOR IT (ADMIN)](#bab-4-panduan-administrator-it-admin)
   - 4.1 Mengelola Master Data Unit Kerja / OPD
   - 4.2 Mengelola Master Kategori Kendala
   - 4.3 Manajemen Akun Pengguna & Hak Akses
   - 4.4 Rekapitulasi Laporan & Analisis Kepuasan Pengguna (IKM)
   - 4.5 Pemeriksaan Log Audit SPBE & BPK (Diff JSON)
5. [BAB 5: MATRIKS TARGET SLA & STANDAR KEDINASAN](#bab-5-matriks-target-sla--standar-kedinasan)
6. [BAB 6: TANYA JAWAB UMUM (FAQ)](#bab-6-tanya-jawab-umum-faq)

---

## BAB 1: PENDAHULUAN & PENGENALAN SISTEM

### 1.1 Mengenal NexTix
**NexTix** adalah sistem tiket bantuan teknis (*Helpdesk*) terintegrasi yang dirancang untuk mendukung tata kelola teknologi informasi pemerintah dan korporat secara profesional, transparan, dan akuntabel.

### 1.2 Pembagian Peran Pengguna (Roles)
Sistem membagi pengguna ke dalam 3 peran:
1. **Client (Pengguna/Pelapor)**: Pegawai OPD/dinas yang melaporkan kendala teknis atau mengajukan permohonan layanan IT.
2. **Support (Teknisi Helpdesk)**: Tim teknis IT yang bertugas merespons, menindaklanjuti, dan menyelesaikan kendala sesuai target waktu SLA.
3. **Admin (Administrator Sistem)**: Pengelola sistem IT dengan hak akses penuh atas master data OPD, manajemen user, log audit SPBE, dan rekapitulasi laporan pimpinan.

---

## BAB 2: PANDUAN PENGGUNA / PELAPOR (CLIENT)

### 2.1 Masuk ke Sistem (Login)
1. Buka peramban (*browser*) dan akses portal NexTix.
2. Masukkan **Username / Email** dan **Password** yang telah didaftarkan.
3. Klik tombol **"Masuk ke Portal"**. Anda akan diarahkan ke Dashboard Pengguna.

---

### 2.2 Mengajukan Tiket Kendala Baru
Ketika Anda mengalami gangguan teknis (contoh: *printer mati, jaringan lemot, akses aplikasi dinas error*):

```text
[Dashboard / Menu Tiket Saya] -> [Klik "+ Ajukan Tiket Baru"] -> [Isi Formulir Pengaduan] -> [Kirim Tiket]
```

**Panduan Pengisian Formulir:**
- **Judul / Subjek Kendala**: Tuliskan ringkasan kendala secara singkat dan jelas *(Contoh: Error Koneksi Printer HP LaserJet Ruang Rapat)*.
- **Kategori Kendala**: Pilih kategori yang sesuai *(Contoh: Jaringan, Hardware, Aplikasi Dinas)*.
- **Tingkat Prioritas**:
  - *Critical / Block*: Layanan publik mati total atau proses dinas terhenti.
  - *Major*: Fungsi utama terganggu tetapi masih ada alternatif darurat.
  - *Normal*: Kendala operasional rutin harian.
- **Tipe Pengajuan (Standar ITIL)**:
  - *Incident*: Gangguan atau kerusakan perangkat/sistem yang sedang berjalan.
  - *Service Request*: Permintaan pemasangan baru, hak akses, atau instalasi software.
  - *Change Request*: Permintaan perubahan konfigurasi sistem.
- **Unit Kerja / Departemen OPD**: Pilih dinas atau bagian Anda *(Contoh: DISKOMINFO, BKPSDM, BPKAD, dll.)*.
- **Deskripsi Detail Masalah**: Jelaskan kronologi masalah, pesan error yang muncul pada layar, atau lokasi spesifik perangkat.
- **Lampiran (Opsional)**: Unggah tangkapan layar (*screenshot*) atau foto fisik kendala (Format PNG, JPG, atau PDF maks. 5MB).
- Klik tombol **"Kirim Tiket"**.

---

### 2.3 Memantau Progres & Berdiskusi via Tiket
1. Buka menu **"Tiket Saya"** pada sidebar navigasi.
2. Klik tombol **"Detail"** pada tiket yang ingin dipantau.
3. Pada halaman detail tiket:
   - **Stepper Progres**: Menampilkan status saat ini (*1. Menunggu* $\rightarrow$ *2. Sedang Dikerjakan* $\rightarrow$ *3. Selesai*).
   - **Badge Target SLA**: Menampilkan sisa waktu penanganan teknisi.
   - **Kolom Diskusi / Tanggapan**: Anda dapat menulis pesan tambahan atau mengirim dokumen bukti susulan kepada teknisi.

---

### 2.4 Mengunduh Berita Acara Perbaikan (BAPP PDF)
Setelah teknisi menyelesaikan masalah dan status tiket menjadi **`Closed`**:
1. Buka halaman detail tiket Anda.
2. Di bagian atas layar, klik tombol hitam **"Cetak Berita Acara (BAPP)"** berlogo PDF.
3. Sistem akan mengunduh dokumen resmi **Berita Acara Penyelesaian Pekerjaan** berformat PDF yang memuat nomor tiket, rincian keluhan, tindakan solusi teknisi, serta kolom tanda tangan kedinasan.

---

### 2.5 Mengisi Survei Kepuasan Layanan (CSAT / IKM ⭐)
Setelah tiket ditandai `Closed`:
1. Pada halaman detail tiket akan muncul banner emas bertuliskan **"Bagikan Kepuasan Layanan Anda"**.
2. Klik tombol **"Beri Nilai Tiket"**.
3. Modal survei bintang akan terbuka:
   - Pilih bintang **1 sampai 5** sesuai kualitas respon dan ketepatan solusi teknisi.
   - *(Opsional)* Tuliskan ulasan pengalaman Anda pada kolom testimoni.
4. Klik **"Kirim Penilaian"**. Nilai Anda akan dirangkum untuk evaluasi mutu pelayanan publik instansi.

---

## BAB 3: PANDUAN TEKNISI HELPDESK (SUPPORT)

### 3.1 Memantau Antrean Tiket Masuk & Target SLA
1. Buka menu **"Kelola Tiket"** pada sidebar.
2. Gunakan filter status:
   - **Open (Menunggu)**: Tiket baru yang belum disentuh dan memerlukan respon cepat.
   - **In Progress (Diproses)**: Tiket yang sedang aktif dikerjakan.
   - **Closed (Selesai)**: Arsip tiket yang telah tuntas.
3. Perhatikan kolom **Prioritas & SLA**: Jika badge berkedip merah (*SLA Breached*), tiket tersebut harus segera diselesaikan untuk menjaga indeks kepatuhan.

---

### 3.2 Menugaskan & Mengambil Tiket
- Buka detail tiket yang masih berstatus `Open` atau belum memiliki penanggung jawab.
- Jika Anda bertindak sebagai teknisi pelaksana, mulailah pengerjaan dengan menekan tombol status.

---

### 3.3 Mengubah Status Pengerjaan (In Progress)
1. Pada panel samping kanan **"Kontrol Penanganan Tiket"**, klik tombol oranye **"Mulai Kerjakan (Set In Progress)"**.
2. Status tiket otomatis beralih menjadi `In Progress` dan waktu respon pertama (*First Responded At*) akan tercatat pada sistem.

---

### 3.4 Berkomunikasi Menggunakan Template Respon Cepat
Pada kolom tanggapan bawah, Anda dapat mengklik template cepat untuk efisiensi komunikasi:
- *"Halo, kendala sedang kami telusuri lebih lanjut."*
- *"Perbaikan sudah diterapkan, mohon lakukan refresh & coba kembali."*
- *"Bisa tolong lampirkan tangkapan layar (screenshot) pesan errornya?"*

---

### 3.5 Menyelesaikan Tiket (Closed) & Menginput Catatan Solusi
1. Pastikan perbaikan teknis telah selesai dan berhasil diuji coba.
2. Klik tombol hijau **"Selesaikan Tiket (Closed)"**.
3. Modal konfirmasi solusi akan muncul:
   - Tuliskan langkah perbaikan yang telah dilakukan *(Contoh: Driver printer di-install ulang dan IP address LAN di-set static).*
4. Klik **"Konfirmasi Selesai"**.
5. Sistem akan mencatat waktu penyelesaian (*Resolved At*), melampirkan solusi pada timeline, dan membuka opsi ekspor BAPP serta survei kepuasan bagi pelapor.

---

### 3.6 Membuka Kembali Tiket (Re-open)
Jika setelah ditutup kendala yang sama kambuh kembali:
- Klik tombol **"Buka Kembali Tiket (Re-open)"** pada panel kontrol untuk mengembalikan status ke `In Progress`.

---

## BAB 4: PANDUAN ADMINISTRATOR IT (ADMIN)

### 4.1 Mengelola Master Data Unit Kerja / OPD
- **Akses:** Sidebar $\rightarrow$ **Unit Kerja / OPD** (`/departments`).
- **Fitur:**
  - **Tambah OPD:** Klik *"Tambah Unit Kerja Baru"*, masukkan Kode Singkatan *(misal: BAPPEDA)*, Nama Lengkap Dinas, dan Deskripsi Tugas.
  - **Status Aktif/Nonaktif:** Klik toggle status untuk mengaktifkan atau menyembunyikan OPD dari dropdown formulir tiket.
  - **Edit & Hapus:** Perbarui informasi dinas kapan saja.

---

### 4.2 Mengelola Master Kategori Kendala
- **Akses:** Sidebar $\rightarrow$ **Kategori Kendala** (`/kategori`).
- **Fitur:** Menambah, mengubah nama kategori, atau menghapus klasifikasi masalah teknis.

---

### 4.3 Manajemen Akun Pengguna & Hak Akses
- **Akses:** Sidebar $\rightarrow$ **Manajemen Pengguna** (`/manageuser`).
- **Fitur:**
  - Mendaftarkan akun pegawai baru.
  - Mengatur peran pengguna: `Client`, `Support`, atau `Admin`.
  - Reset kata sandi pengguna yang lupa password.

---

### 4.4 Rekapitulasi Laporan & Analisis Kepuasan Pengguna (IKM)
- **Akses:** Sidebar $\rightarrow$ **Laporan & CSAT** (`/report`).
- **Tab 1: Rekapitulasi Tiket & Ekspor:**
  - Filter rentang tanggal mulai & akhir, dinas OPD, kategori, dan status.
  - Klik **"Ekspor PDF"** untuk format laporan cetak kedinasan atau **"Ekspor Excel"** untuk olah data spreadsheet.
- **Tab 2: Indeks Kepuasan Pengguna (CSAT / IKM):**
  - Melihat skor rata-rata kepuasan instansi (skala 1.0 - 5.0).
  - Persentase kepuasan layanan publik (standar PermenPAN-RB No. 14/2017).
  - Feed testimoni dan ulasan real-time dari pelapor.
- **Tab 3: Kepatuhan SLA Instansi:**
  - Memantau persentase kepatuhan penyelesaian tepat waktu (*Compliance Rate %*).

---

### 4.5 Pemeriksaan Log Audit SPBE & BPK (Diff JSON)
- **Akses:** Sidebar $\rightarrow$ **Log Audit SPBE** (`/audit-logs`).
- **Fungsi:** Menjamin kepatuhan standar keamanan data SPBE dan pengawasan auditor eksternal/internal (BPK & Inspektorat).
- **Fitur:**
  - Filter berdasarkan aksi: `TICKET_CREATED`, `STATUS_CHANGED`, `COMMENT_ADDED`, `USER_REGISTERED`, `DEPARTMENT_CREATED`, dll.
  - Klik tombol **"Inspeksi Diff"** untuk melihat rekaman komparasi data lama (*Old Values*) vs data baru (*New Values*) beserta IP Address dan User Agent pengubah.

---

## BAB 5: MATRIKS TARGET SLA & STANDAR KEDINASAN

| Prioritas | Target Respon Awal (*First Response*) | Target Penyelesaian (*Resolution*) | Kriteria Masalah |
| :--- | :---: | :---: | :--- |
| **Critical** | **15 Menit** | **2 Jam** | Sistem utama atau server pelayanan publik mati total. |
| **Block** | **20 Menit** | **3 Jam** | Kendala yang menghentikan operasional satu unit kerja penuh. |
| **Major** | **30 Menit** | **4 Jam** | Fitur vital bermasalah tetapi masih ada metode alternatif. |
| **Normal** | **60 Menit** | **8 Jam** | Kendala teknis harian standar pegawai. |
| **Minor / Trivial** | **120 Menit** | **24 Jam** | Permintaan bantuan minor, konsultasi, atau instalasi software. |

---

## BAB 6: TANYA JAWAB UMUM (FAQ)

**Q: Apakah pelapor bisa menghapus atau mengubah status tiket sendiri?**  
A: Tidak. Sesuai standar tata kelola ITIL, hanya tim teknisi (Support) dan Administrator yang berwenang mengubah status tiket setelah dilakukan verifikasi teknis.

**Q: Kapan Berita Acara Perbaikan (BAPP PDF) bisa dicetak?**  
A: Tombol cetak BAPP PDF otomatis aktif saat status tiket telah resmi ditutup (`Closed`).

**Q: Mengapa tiket saya memiliki tanda "SLA Breached"?**  
A: Tanda tersebut menunjukkan bahwa durasi pengerjaan telah melampaui batas target matriks SLA yang ditentukan, sehingga menjadi prioritas eskalasi bagi teknisi.

---

*Hak Cipta &copy; 2026 NexTix Helpdesk Portal. Seluruh hak cipta dilindungi undang-undang.*
