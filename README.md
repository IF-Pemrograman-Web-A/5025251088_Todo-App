# 5025251088_Todo-App

**Identitas Diri**
* **Nama:** I Komang Bagus Alvero Wisnawa
* **NRP:** 5025251088
* **Mata Kuliah:** Pemrograman Web A

**Deskripsi Proyek**
Proyek ini merupakan antarmuka (UI) statis untuk aplikasi Todo Dashboard. Halaman ini dibangun menggunakan elemen semantik HTML5 dan CSS. Website ini dirancang menjadi responsif menggunakan kombinasi CSS Grid untuk struktur utama dan Flexbox untuk pembagian panel, sehingga tampilan tetap rapi baik pada layar desktop maupun mobile.

**Fitur Baru (E02a):** 
Menambahkan manipulasi DOM dengan JavaScript untuk fungsionalitas Todo App (tambah tugas, edit, hapus, tandai selesai, dan toggle Dark Mode).

**Fitur Baru (E03):** Menambahkan Web Storage (IndexedDB & localStorage), Media Capture untuk gambar, Service Worker untuk notifikasi pengingat, dan standar Aksesibilitas.

**Fitur Baru (E04):**
* Struktur PHP modular (`config.php`, `header.php`, `menu-bar.php`, `footer.php`, `process.php`, `index.php`).
* Navigasi menu bar terpisah untuk kategori Personal Todo dan Shared Todo.
* Integrasi database MySQL (`todo_app`) melalui file skema `data.sql`.
* Operasi CRUD (Create, Read, Update/Mark as Done, Delete) berbasis PHP.
* Fitur pengunggahan gambar (*File Handling*) yang tersimpan otomatis di folder `uploads`.

**Fitur Baru (E05 - The Offline Abyss):**
* Mengubah Todo App menjadi Progressive Web App (PWA) dengan `manifest.json` dan maskable icons.
* Menerapkan Service Worker (`sw.js`) untuk *precaching app shell* dan halaman offline fallback (`offline.html`).
* Menerapkan strategi *caching* (Network-First untuk halaman, Cache-First untuk aset statis).
* Menambahkan fungsionalitas instalasi PWA.

**Fitur Baru (E06 - The Endpoint of Portals):**
* Migrasi struktur backend menjadi RESTful API (`api.php`).
* Implementasi HTTP Methods: `GET` (Read), `POST` (Create), `PUT`/`PATCH` (Update), dan `DELETE` (Hapus).
* Implementasi Status Code HTTP yang sesuai (200 OK, 201 Created).
* Implementasi Error Status Code (400 Bad Request, 401 Unauthorized, 404 Not Found, 405 Method Not Allowed, 500 Server Error).
* Menambahkan Authentication API Key (`x-api-key`) pada headers untuk keamanan akses endpoint.

**Bukti Pengujian Offline (Cache Storage):**
**Bukti DevTools & Pengujian Offline:**

![Validasi Manifest](image-1.png)
![Service worker](image-2.png)
![Cache Storage](image-3.png)
![Simulasi Offline](image-4.png)

**Bukti Pengujian REST API (Postman):**
![Bukti 200 OK](image-6.png)
![Bukti 401 Unauthorized](image-5.png)

**Preview UI**
* **Dekstop:**
* <img width="1917" height="863" alt="image" src="https://github.com/user-attachments/assets/d123b235-8a59-4f87-b502-ba56d78b8317" />


* **Mobile:**
* <img width="727" height="1600" alt="Mobile Todo List" src="https://github.com/user-attachments/assets/b51a930e-0741-4870-be6d-a711f597c1d4" />
* <img width="727" height="1600" alt="Mobile Todo List2" src="https://github.com/user-attachments/assets/8f1aa371-d2d9-4547-a88c-2fd1dcaab7cc" />

