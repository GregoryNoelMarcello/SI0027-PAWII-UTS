// Controller Buku - CRUD dan query katalog.
// Format error: lempar objek { status, message } (lihat middlewares/errorHandler.js),
// mis. throw { status: 404, message: "Buku tidak ditemukan" }
// express-async-errors sudah aktif di app.js, jadi tidak perlu try/catch.

const Buku = require("../models/bukuModel");

const MAX_LIMIT = 100;

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
  const filter = {};
  if (req.query.kategoriId) filter.kategoriId = req.query.kategoriId;

  const parsePositiveInteger = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  };

  const page = parsePositiveInteger(req.query.page, 1);
  const limit = Math.min(parsePositiveInteger(req.query.limit, 10), MAX_LIMIT);
  const sort = req.query.sort || "createdAt";
  const fields = req.query.fields
    ? req.query.fields
        .split(",")
        .map((field) => field.trim())
        .filter(Boolean)
        .join(" ")
    : null;

  const [data, total] = await Promise.all([
    Buku.find(filter)
      .sort({ [sort]: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(fields)
      .populate("kategoriId"),
    Buku.countDocuments(filter),
  ]);

  res.json({ data, page, limit, total });
};

// GET /buku/:id
//   - 200 -> dokumen buku, kategoriId ter-populate
//   - tidak ada -> 404 { message }
//   - format id salah -> 400 (ditangani errorHandler lewat CastError)
exports.getById = async (req, res) => {
  const buku = await Buku.findById(req.params.id).populate("kategoriId");
  if (!buku) throw { status: 404, message: "Buku tidak ditemukan" };
  res.json(buku);
};


// POST /buku
//   - 201 -> dokumen yang baru dibuat
//   - validasi gagal / ISBN duplikat -> 400 (ditangani errorHandler)
exports.create = async (req, res) => {
  const buku = await Buku.create(req.body);
  res.status(201).json(buku);
};


// PUT /buku/:id
//   - 200 -> dokumen setelah diperbarui (bukan sebelum)
//   - validasi schema HARUS tetap berjalan saat update
//   - tidak ada -> 404 { message }
exports.update = async (req, res) => {
  const buku = await Buku.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!buku) throw { status: 404, message: "Buku tidak ditemukan" };
  res.json(buku);
};

// DELETE /buku/:id
//   - 204 tanpa body
//   - tidak ada -> 404 { message }
exports.remove = async (req, res) => {
  const buku = await Buku.findByIdAndDelete(req.params.id);
  if (!buku) throw { status: 404, message: "Buku tidak ditemukan" };
  res.status(204).end();
};

