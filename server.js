import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import trashRoutes from "./routes/trashRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import "./config/supabase.js"; // ensure supabase connection

dotenv.config();

const app = express();

// CORS config (Vite default frontend: localhost:5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Handle preflight requests globally
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/trash", trashRoutes);
// Error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Don’t run server in Jest tests
if (process.env.JEST_WORKER_ID === undefined) {
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
}

export default app;
