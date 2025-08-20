export default function errorMiddleware(err, req, res, next) {
  console.error("❌ Error:", err?.message || err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error"
  });
}
