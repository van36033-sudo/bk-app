# BK SMA Web App

Aplikasi web Bimbingan Konseling (BK) untuk SMA berbasis React + Supabase yang siap di-deploy ke GitHub Pages.

## Fitur Utama

- Login Guru BK (Supabase Auth).
- Dashboard ringkasan layanan BK & persentase per jenis layanan.
- CRUD data siswa.
- CRUD kasus BK.
- CRUD sesi layanan BK.
- Generator RPL dengan ekspor DOC/PDF.

## Teknologi

- React + Vite
- Supabase (Auth + Database)
- GitHub Pages (static hosting)

## Konfigurasi Supabase

URL dan anon key sudah ditanam langsung pada `src/utils/supabaseClient.js`:

```js
const SUPABASE_URL = "https://smgrmdavolyaivslypou.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_ukqRkVkK9jvmNXFRWoNhAw_zLPMVNsh";
```

> Jika ingin lebih aman, pindahkan ke file `.env` dan ganti pemanggilan di `supabaseClient.js`.

### Struktur Tabel Supabase

Buat tabel berikut pada Supabase SQL Editor:

```sql
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  nisn text not null,
  name text not null,
  class text not null,
  created_at timestamp with time zone default now()
);

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  urgency text not null,
  status text not null,
  created_at timestamp with time zone default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  service_type text not null,
  service_date date not null,
  notes text,
  created_at timestamp with time zone default now()
);
```

Aktifkan Row Level Security (RLS) sesuai kebutuhan dan berikan policy untuk `SELECT`, `INSERT`, `UPDATE`, `DELETE` bagi role authenticated.

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Akses aplikasi di `http://localhost:5173`.

## Build & Deploy ke GitHub Pages

1. Pastikan repository sudah memiliki GitHub Pages pada branch `gh-pages`.
2. Build aplikasi:

```bash
npm run build
```

3. Deploy menggunakan `gh-pages` (opsional):

```bash
npm install --save-dev gh-pages
npx gh-pages -d dist
```

4. Atur GitHub Pages di Settings → Pages → Deploy from `gh-pages` branch.

> File `vite.config.js` sudah menggunakan `base: "./"` agar kompatibel dengan GitHub Pages.
