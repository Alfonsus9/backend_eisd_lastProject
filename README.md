# Real-time Parking API (Backend)

Sistem API manajemen parkir berbasis Node.js dan Express yang digunakan untuk mengelola data parkir secara real-time. Sistem ini mencakup tracking kendaraan masuk dan keluar, monitoring ketersediaan slot parkir, manajemen laporan pelanggaran, serta pengelolaan pengguna (admin dan petugas).

---

## 📌 Prasyarat (Prerequisites)

Sebelum menjalankan aplikasi secara lokal, pastikan Anda telah memasang tools berikut di komputer Anda:
*   [Node.js](https://nodejs.org/) (versi 18 ke atas direkomendasikan)
*   [npm](https://www.npmjs.com/) (terintegrasi saat menginstal Node.js)
*   [MySQL Database](https://www.mysql.com/) (bisa menggunakan XAMPP, Laragon, Docker, atau MySQL Server standalone)

---

## ⚙️ Langkah Instalasi & Setup Lokal

Ikuti langkah-langkah berikut untuk menjalankan server backend di lingkungan lokal Anda:

### 1. Unduh / Clone Repositori
Masuk ke direktori proyek:
```bash
cd Real-time-parking
```

### 2. Instal Dependensi
Jalankan perintah berikut untuk menginstal semua library Node.js yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Environment Variables (`.env`)
Buat file bernama `.env` di direktori root proyek (jika belum ada) dan sesuaikan nilainya:
```env
PORT=3000
DATABASE_URL="mysql://root:@localhost:3306/parkir"
JWT_SECRET="real-time-parking-secret-key-2026"
CLIENT_URL="http://localhost:8081"
```
*   **PORT**: Port yang digunakan untuk menjalankan server backend secara lokal (default: `3000`).
*   **DATABASE_URL**: URL koneksi database MySQL dengan format: `mysql://<username>:<password>@<host>:<port>/<nama_database>`.
*   **JWT_SECRET**: Kunci rahasia untuk proses enkripsi JWT Token.
*   **CLIENT_URL**: URL aplikasi frontend/klien untuk kebutuhan CORS.

### 4. Setup Database & Jalankan Migrasi Prisma
Pastikan server database MySQL Anda sudah berjalan (misal: aktifkan MySQL pada XAMPP/Laragon).

Kemudian jalankan perintah migrasi database menggunakan Prisma untuk membuat tabel-tabel secara otomatis:
```bash
npx prisma migrate dev --name init
```

### 5. Seeding Database (Data Awal / Dummy)
Untuk mempermudah pengujian, Anda bisa mengisi database dengan data awal (seperti akun admin, akun petugas, area parkir, dan log parkir dummy) dengan menjalankan:
```bash
npx prisma db seed
```
Setelah seed selesai, Anda akan mendapatkan akun pengujian default berikut:
*   **Admin**: NIP `198001012010011001` | Password `password123`
*   **Petugas**: NIP `199203152015031002` | Password `alfonsus123`
*   **Petugas Budi**: NIP `199507202018071003` | Password `password123`

### 6. Jalankan Server
Gunakan perintah berikut untuk menjalankan server dalam mode pengembangan (menggunakan `nodemon` agar otomatis merestart server saat ada perubahan kode):
```bash
npm run dev
```
Server akan berjalan di `http://localhost:3000`.

---

## 📁 Struktur Folder Utama

```text
Real-time-parking/
├── prisma/                 # Konfigurasi skema database dan file seed/dummy
│   ├── schema.prisma       # Skema database (model Prisma)
│   └── dummy.js            # Script seeder data awal
├── src/
│   ├── config/             # Konfigurasi pihak ketiga (misal: Prisma client)
│   ├── controllers/        # Logika utama pemrosesan request dan response API
│   ├── middlewares/        # Middleware Express (autentikasi, upload foto, dll.)
│   ├── routes/             # Definisi rute/endpoint API
│   ├── services/           # Logika bisnis dan interaksi dengan database via Prisma
│   └── utils/              # Helper utilities/fungsi bantuan
├── uploads/                # Folder penyimpanan file gambar yang diunggah
├── .env                    # Variabel lingkungan (koneksi database, port, JWT secret)
├── app.js                  # Setup Express app, middleware global, dan routing
└── server.js               # Titik masuk utama aplikasi untuk mendengarkan port
```

---

## 🚀 Dokumentasi Endpoint API

Semua request yang membutuhkan autentikasi wajib menyertakan header berikut:
```http
Authorization: Bearer <JWT_TOKEN_ANDA>
```

### 🔐 1. Kelompok Autentikasi (`/api/auth`)

#### A. Registrasi Pengguna Baru
*   **URL:** `/api/auth/register`
*   **Method:** `POST`
*   **Headers:** `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
      "name": "Nama Lengkap",
      "nip": "1234567890",
      "password": "password123",
      "role": "admin" // Pilihan: "admin" | "petugas"
    }
    ```
*   **Response Sukses (201 Created):**
    ```json
    {
      "status": true,
      "message": "Registrasi berhasil",
      "data": null
    }
    ```
*   **Response Gagal (400 Bad Request):**
    ```json
    {
      "status": false,
      "message": "Password minimal 8 karakter",
      "data": null
    }
    ```

#### B. Login
*   **URL:** `/api/auth/login`
*   **Method:** `POST`
*   **Headers:** `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
      "nip": "1234567890",
      "password": "password123"
    }
    ```
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": true,
      "message": "Login berhasil",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```
*   **Response Gagal (401 Unauthorized):**
    ```json
    {
      "status": false,
      "message": "NIP atau password salah",
      "data": null
    }
    ```

---

### 🌐 2. Kelompok Publik (`/api/public` & `/api`)
Endpoint yang dapat diakses secara bebas tanpa memerlukan otentikasi JWT.

#### A. Mengambil Semua Area Parkir
*   **URL:** `/api/public/parking-area`
*   **Method:** `GET`
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": true,
      "message": "Berhasil mengambil data area parkir",
      "data": [
        {
          "id_area": 1,
          "name_area": "Parkir A",
          "location": "Gedung Utama",
          "kapasitas_total": 100,
          "photo": "foto-parkir-a.jpg"
        }
      ]
    }
    ```

#### B. Mengambil Area Parkir berdasarkan ID
*   **URL:** `/api/public/parking-area/:id`
*   **Method:** `GET`
*   **Params:** `id` (integer) - ID Area Parkir
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": true,
      "message": "Berhasil mengambil data area parkir",
      "data": {
        "id_area": 1,
        "name_area": "Parkir A",
        "location": "Gedung Utama",
        "kapasitas_total": 100,
        "photo": "foto-parkir-a.jpg",
        "keterisian": 3,
        "sisa_slot": 97
      }
    }
    ```

#### C. Membuat Laporan Pelanggaran
*   **URL:** `/api/violation-reports`
*   **Method:** `POST`
*   **Headers:** `Content-Type: multipart/form-data`
*   **Request Body (FormData):**
    *   `location`: "Lantai 1 Blok B" (text, wajib)
    *   `description`: "Mobil menghalangi akses jalan keluar" (text, wajib)
    *   `photo`: [File Gambar] (file JPG/PNG maks 5MB, wajib)
*   **Response Sukses (201 Created):**
    ```json
    {
      "status": true,
      "message": "Laporan berhasil dikirim",
      "data": null
    }
    ```

---

### 👮 3. Kelompok Petugas (`/petugas`)
Hanya dapat diakses oleh akun ber-role `petugas` yang memiliki token valid dan berstatus aktif.

#### A. Mengambil Daftar Laporan Pelanggaran
*   **URL:** `/petugas/violation-reports`
*   **Method:** `GET`
*   **Query Params:**
    *   `page`: Nomor halaman (default: `1`)
    *   `limit`: Jumlah data per halaman (default: `10`)
    *   `status`: Filter status (`pending` | `diproses` | `selesai`, opsional)
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": true,
      "message": "OK",
      "data": [
        {
          "id_reports": 1,
          "location": "Lantai 1 Blok B",
          "description": "Mobil menghalangi akses jalan",
          "status": "pending",
          "photo": "171888990123-photo.jpg",
          "created_at": "2026-06-20T04:30:00.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalData": 1,
        "totalPages": 1
      }
    }
    ```

#### B. Mengubah Status Laporan Pelanggaran
*   **URL:** `/petugas/violation-reports/:id`
*   **Method:** `PATCH`
*   **Params:** `id` (integer) - ID Laporan Pelanggaran
*   **Request Body:**
    ```json
    {
      "status": "diproses" // Pilihan: "diproses" | "selesai"
    }
    ```
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": true,
      "message": "Status laporan diperbarui",
      "data": null
    }
    ```
*   **Response Gagal (409 Conflict - jika laporan sudah selesai):**
    ```json
    {
      "status": false,
      "message": "Laporan yang sudah selesai tidak dapat diubah",
      "data": null
    }
    ```

#### C. Ekspor Laporan Pelanggaran (PDF)
*   **URL:** `/petugas/violation-reports/export`
*   **Method:** `GET`
*   **Query Params:**
    *   `start_date`: Tanggal mulai filter (format `YYYY-MM-DD`, opsional)
    *   `end_date`: Tanggal akhir filter (format `YYYY-MM-DD`, opsional)
    *   `status`: Filter status (`pending` | `diproses` | `selesai`, opsional)
*   **Response Sukses (200 OK):** Mengirim berkas file PDF dengan header `Content-Type: application/pdf`.

---

### 👑 4. Kelompok Admin (`/admin`)
Hanya dapat diakses oleh akun ber-role `admin` yang memiliki token valid dan berstatus aktif.

#### A. Mengambil Daftar Semua Pengguna
*   **URL:** `/admin/users`
*   **Method:** `GET`
*   **Query Params:**
    *   `page`: Nomor halaman (default: `1`)
    *   `limit`: Jumlah data per halaman (default: `10`)
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": true,
      "message": "OK",
      "data": [
        {
          "id_user": 2,
          "username": "petugas_andi",
          "nip": "199203152015031002",
          "role": "petugas",
          "status": true,
          "created_at": "2026-06-20T04:11:22.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalData": 3,
        "totalPages": 1
      }
    }
    ```

#### B. Mengubah Status Pengguna (Mengaktifkan/Menonaktifkan)
*   **URL:** `/admin/users/:id`
*   **Method:** `PATCH`
*   **Params:** `id` (integer) - ID User
*   **Request Body:**
    ```json
    {
      "status": "aktif" // Pilihan: "aktif" | "nonaktif"
    }
    ```
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": true,
      "message": "Data user diperbarui",
      "data": null
    }
    ```
*   **Response Gagal (403 Forbidden - jika menonaktifkan akun sendiri):**
    ```json
    {
      "status": false,
      "message": "Anda tidak dapat menonaktifkan akun Anda sendiri",
      "data": null
    }
    ```

#### C. Menghapus Pengguna
*   **URL:** `/admin/users/:id`
*   **Method:** `DELETE`
*   **Params:** `id` (integer) - ID User
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": true,
      "message": "User berhasil dihapus",
      "data": null
    }
    ```

#### D. Membuat Area Parkir Baru
*   **URL:** `/admin/parking-area`
*   **Method:** `POST`
*   **Headers:** `Content-Type: multipart/form-data`
*   **Request Body (FormData):**
    *   `name_area`: "Area E Lantai Dasar" (text, wajib)
    *   `location`: "Gedung Annex" (text, wajib)
    *   `kapasitas_total`: 45 (integer, wajib, minimal 1)
    *   `photo`: [File Gambar] (file JPG/PNG maks 5MB, wajib)
*   **Response Sukses (201 Created):**
    ```json
    {
      "status": true,
      "message": "Area parkir berhasil ditambahkan",
      "data": {
        "id_area": 5
      }
    }
    ```

#### E. Memperbarui Data Area Parkir
*   **URL:** `/admin/parking-area/:id`
*   **Method:** `PUT`
*   **Params:** `id` (integer) - ID Area Parkir
*   **Request Body:**
    ```json
    {
      "name_area": "Area A Update", // Opsional
      "location": "Gedung Utama Blok A1", // Opsional
      "kapasitas_total": 110 // Opsional
    }
    ```
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": true,
      "message": "Area parkir berhasil diperbarui",
      "data": null
    }
    ```
*   **Response Gagal (400 Bad Request - kapasitas baru terlalu kecil):**
    ```json
    {
      "status": false,
      "message": "kapasitas_total tidak boleh lebih kecil dari jumlah kendaraan yang sedang parkir",
      "data": null
    }
    ```

#### F. Menghapus Area Parkir
*   **URL:** `/admin/parking-area/:id`
*   **Method:** `DELETE`
*   **Params:** `id` (integer) - ID Area Parkir
*   **Response Sukses (200 OK):**
    ```json
    {
      "status": true,
      "message": "Area parkir berhasil dihapus",
      "data": null
    }
    ```
*   **Response Gagal (409 Conflict - jika area tidak kosong):**
    ```json
    {
      "status": false,
      "message": "Area parkir tidak dapat dihapus karena masih ada kendaraan di dalamnya",
      "data": null
    }
    ```

#### G. Mengambil Daftar Laporan Pelanggaran (Khusus Admin)
*   **URL:** `/admin/violation-reports`
*   **Method:** `GET`
*   **Query Params:**
    *   `page`: Nomor halaman (default: `1`)
    *   `limit`: Jumlah data per halaman (default: `10`)
    *   `status`: Filter status (`pending` | `diproses` | `selesai`, opsional)
*   **Response Sukses (200 OK):** Format sama dengan `/petugas/violation-reports`.

#### H. Ekspor Laporan Pelanggaran (Khusus Admin - PDF)
*   **URL:** `/admin/violation-reports/export`
*   **Method:** `GET`
*   **Query Params:**
    *   `start_date`: Tanggal mulai filter (format `YYYY-MM-DD`, opsional)
    *   `end_date`: Tanggal akhir filter (format `YYYY-MM-DD`, opsional)
    *   `status`: Filter status (`pending` | `diproses` | `selesai`, opsional)
*   **Response Sukses (200 OK):** Mengirim berkas file PDF dengan header `Content-Type: application/pdf`.
