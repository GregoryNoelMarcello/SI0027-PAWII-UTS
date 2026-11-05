// TODO B: Controller Buku - CRUD lengkap (Pertemuan 3-4, 9-12)
// Format error: lempar objek { status, message } (lihat middlewares/errorHandler.js),
const { get } = require("mongoose");
const errorHandler = require("../middlewares/errorHandler");
throw {status: 404, message: "Buku tidak ditemukan"}
// mis. throw { status: 404, message: "Buku tidak ditemukan" }
// express-async-errors sudah aktif di app.js, jadi tidak perlu try/catch.

const Buku = require("../models/bukuModel");

const MAX_LIMIT = 100;
exports.getAll = async (req, res) => {
  const data = await Buku.find().sort({ nama: 1 });
  res.json(data);
};
// GET /buku
// Query opsional:
//   kategoriId  filter berdasarkan kategori
//   sort        nama field, urut ascending (default: createdAt)
//   page        default 1
//   limit       default 10, maksimum 100
//   fields      projection, dipisah koma, mis. fields=judul,isbn
// Respons 200: { data, page, limit, total }
//   - total = jumlah dokumen yang cocok dengan filter (BUKAN jumlah data pada halaman ini)
//   - data memuat kategoriId yang ter-populate (objek Kategori)
exports.getAll = async (req, res) => {
  // TODO B1
};

// GET /buku/:id
//   - 200 -> dokumen buku, kategoriId ter-populate
//   - tidak ada -> 404 { message }
//   - format id salah -> 400 (ditangani errorHandler lewat CastError)
exports.getById = async (req, res) => {
  // TODO B2
};

// POST /buku
//   - 201 -> dokumen yang baru dibuat
//   - validasi gagal / ISBN duplikat -> 400 (ditangani errorHandler)
exports.create = async (req, res) => {
  // TODO B3
};

// PUT /buku/:id
//   - 200 -> dokumen setelah diperbarui (bukan sebelum)
//   - validasi schema HARUS tetap berjalan saat update
//   - tidak ada -> 404 { message }
exports.update = async (req, res) => {
  // TODO B4
};

// DELETE /buku/:id
//   - 204 tanpa body
//   - tidak ada -> 404 { message }
exports.remove = async (req, res) => {
  // TODO B5
};
