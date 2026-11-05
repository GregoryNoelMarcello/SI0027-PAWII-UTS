// Schema dan model Buku sesuai kontrak API.
//
// Ketentuan:
//   judul      String, wajib diisi, spasi di awal/akhir dibuang
//   isbn       String, wajib, UNIK, harus tepat 13 digit angka
//   penulis    Array of String (EMBEDDED), minimal 1 penulis
//   penerbit   Subdocument (EMBEDDED, tanpa _id sendiri):
//                nama  String, wajib
//                tahun Number, 1900 s.d. tahun berjalan
//   kategoriId ObjectId (REFERENCING ke model "Kategori"), wajib
//   stok       Number, default 0, tidak boleh negatif
//   createdAt  Date, default waktu saat ini
//
// Petunjuk: lihat models/kategoriModel.js sebagai contoh sintaks dasar,
// dan materi Pertemuan 9-10 (embedding vs referencing).

const mongoose = require("mongoose");

const penerbitSchema = new mongoose.Schema(
	{
		nama: { type: String, required: true, trim: true },
		tahun: {
			type: Number,
			required: true,
			min: 1900,
			max: new Date().getFullYear(),
		},
	},
	{ _id: false }
);

const bukuSchema = new mongoose.Schema({
	judul: { type: String, required: true, trim: true },
	isbn: {
		type: String,
		required: true,
		unique: true,
		match: [/^\d{13}$/, "ISBN harus terdiri dari tepat 13 digit angka"],
	},
	penulis: {
		type: [{ type: String, trim: true }],
		required: true,
		validate: {
			validator: (penulis) => Array.isArray(penulis) && penulis.length >= 1,
			message: "Minimal harus ada satu penulis",
		},
	},
	penerbit: { type: penerbitSchema, required: true },
	kategoriId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Kategori",
		required: true,
	},
	stok: { type: Number, default: 0, min: 0 },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Buku", bukuSchema);
