// middlewares/upload.js
import multer from "multer";

const storage = multer.memoryStorage(); // keep in memory for Supabase
const upload = multer({ storage });

export default upload;
