// TODO D: Middleware error handling terpusat (Pertemuan 5 & 11-12)
// Didaftarkan PALING AKHIR pada app.js. Respons error SELALU berbentuk { message }.

// Pemetaan error -> status:
//   err.status ada (mis. { status: 404, message })  -> pakai status & message tersebut
//   ValidationError (Mongoose)                        -> 400, message dari error
//   CastError (format id/ObjectId salah)              -> 400, "Format <err.path> tidak valid"
//   Duplicate key (err.code === 11000)                -> 400, "Data dengan nilai unik tersebut sudah ada"
//   error lain yang tidak terduga                     -> 500, catat ke console.error,
//                                                        message ke client TETAP generik
//                                                        ("Terjadi kesalahan pada server"),
//                                                        stack trace jangan dibocorkan

function errorHandler(err, req, res, next) {
  let status = 500;
  let message = "Terjadi kesalahan pada server";

  if (err.status) {
    status = err.status;
    message = err.message || message;
  } else if (err.name === "ValidationError") {
    status = 400;
    message = err.message;
  } else if (err.name === "CastError") {
    status = 400;
    message = `Format ${err.path} tidak valid`;
  } else if (err.code === 11000) {
    status = 400;
    message = "Data dengan nilai unik tersebut sudah ada";
  } else {
    console.error(err);
  }

  res.status(status).json({ message });
}

module.exports = errorHandler;
