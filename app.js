// UTS PAW II - Katalog Perpustakaan Digital Kampus (Starter)
// Koneksi MongoDB, CORS, parser JSON, dan route /kategori sudah tersedia.
// Seluruh route API dan middleware error ditautkan di bawah ini.

require("express-async-errors");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

const kategoriRoutes = require("./routes/kategoriRoutes");
const bukuRoutes = require("./routes/bukuRoutes");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.json());

app.use("/kategori", kategoriRoutes);
app.use("/buku", bukuRoutes);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Terhubung ke MongoDB");
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Gagal terhubung ke MongoDB:", err.message);
    process.exit(1);
  });
