# List Endpoint yang Sudah Jadi

Berikut adalah daftar endpoint API beserta method, parameter input request (body, query, params, headers) dalam format JSON, dan pengelompokannya.

---

## Auth
Endpoint untuk proses autentikasi (registrasi dan login).

### 1. Register
* **Method:** `POST`
* **URL:** `/api/auth/register`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "name": "Nama Lengkap",
    "nip": "1234567890",
    "password": "password123",
    "role": "admin" // atau "petugas"
  }
  ```

### 2. Login
* **Method:** `POST`
* **URL:** `/api/auth/login`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "nip": "1234567890",
    "password": "password123"
  }
  ```

---

## Public
Endpoint yang dapat diakses oleh siapa saja tanpa memerlukan token otentikasi.

### 1. Get All Parking Areas
* **Method:** `GET`
* **URL:** `/api/public/parking-area`
* **Request:** None

### 2. Get Parking Area by ID
* **Method:** `GET`
* **URL:** `/api/public/parking-area/:id`
* **Request Params:**
  ```json
  {
    "id": 1
  }
  ```

### 3. Create Violation Report
* **Method:** `POST`
* **URL:** `/api/violation-reports`
* **Content-Type:** `multipart/form-data`
* **Request Body (Form Data):**
  ```json
  {
    "location": "Lantai 1 Blok B",
    "description": "Mobil parkir menghalangi jalan",
    "photo": "file_gambar.jpg" // upload file menggunakan key "photo"
  }
  ```

---

## Petugas
Endpoint khusus untuk akun ber-role `petugas`.
* **Header Wajib:** `Authorization: Bearer <token>`

### 1. Get Violation Reports (Satpam)
* **Method:** `GET`
* **URL:** `/petugas/violation-reports`
* **Request Query:**
  ```json
  {
    "page": 1, // opsional, default: 1
    "limit": 10, // opsional, default: 10
    "status": "pending" // opsional: "pending" | "diproses" | "selesai"
  }
  ```

### 2. Update Violation Report Status
* **Method:** `PATCH`
* **URL:** `/petugas/violation-reports/:id`
* **Request Params:**
  ```json
  {
    "id": 1
  }
  ```
* **Request Body:**
  ```json
  {
    "status": "diproses" // "diproses" | "selesai"
  }
  ```

### 3. Export Violation Reports (PDF)
* **Method:** `GET`
* **URL:** `/petugas/violation-reports/export`
* **Request Query:**
  ```json
  {
    "start_date": "2026-06-01", // opsional, format YYYY-MM-DD
    "end_date": "2026-06-19", // opsional, format YYYY-MM-DD
    "status": "selesai" // opsional: "pending" | "diproses" | "selesai"
  }
  ```

---

## Admin
Endpoint khusus untuk akun ber-role `admin`.
* **Header Wajib:** `Authorization: Bearer <token>`

### 1. Get All Users
* **Method:** `GET`
* **URL:** `/admin/users`
* **Request Query:**
  ```json
  {
    "page": 1, // opsional, default: 1
    "limit": 10 // opsional, default: 10
  }
  ```

### 2. Update User Status
* **Method:** `PATCH`
* **URL:** `/admin/users/:id`
* **Request Params:**
  ```json
  {
    "id": 1
  }
  ```
* **Request Body:**
  ```json
  {
    "status": "aktif" // "aktif" | "nonaktif"
  }
  ```

### 3. Delete User
* **Method:** `DELETE`
* **URL:** `/admin/users/:id`
* **Request Params:**
  ```json
  {
    "id": 1
  }
  ```

### 4. Create Parking Area
* **Method:** `POST`
* **URL:** `/admin/parking-area`
* **Content-Type:** `multipart/form-data`
* **Request Body (Form Data):**
  ```json
  {
    "name_area": "Area A",
    "location": "Lantai 1",
    "kapasitas_total": 50,
    "photo": "file_gambar.jpg" // upload file menggunakan key "photo"
  }
  ```

### 5. Update Parking Area
* **Method:** `PUT`
* **URL:** `/admin/parking-area/:id`
* **Request Params:**
  ```json
  {
    "id": 1
  }
  ```
* **Request Body (minimal kirim salah satu):**
  ```json
  {
    "name_area": "Area A Baru", // opsional
    "location": "Lantai 1 Sayap Kanan", // opsional
    "kapasitas_total": 60 // opsional
  }
  ```

### 6. Delete Parking Area
* **Method:** `DELETE`
* **URL:** `/admin/parking-area/:id`
* **Request Params:**
  ```json
  {
    "id": 1
  }
  ```

### 7. Get Violation Reports (Admin)
* **Method:** `GET`
* **URL:** `/admin/violation-reports`
* **Request Query:**
  ```json
  {
    "page": 1, // opsional, default: 1
    "limit": 10, // opsional, default: 10
    "status": "pending" // opsional: "pending" | "diproses" | "selesai"
  }
  ```

### 8. Export Violation Reports (Admin - PDF)
* **Method:** `GET`
* **URL:** `/admin/violation-reports/export`
* **Request Query:**
  ```json
  {
    "start_date": "2026-06-01", // opsional, format YYYY-MM-DD
    "end_date": "2026-06-19", // opsional, format YYYY-MM-DD
    "status": "selesai" // opsional: "pending" | "diproses" | "selesai"
  }
  ```