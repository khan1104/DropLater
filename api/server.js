import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Router from "./routes/noteRoute.js";
import { apiLimiter } from "./middleware/notes.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();
app.use(express.json());

// CORS must come BEFORE auth middleware and routes
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(apiLimiter);       // rate limiter
app.use(authMiddleware);   // protect routes

// Routes
app.use("/api", Router);

// Health check
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// Connect DB + start server
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`API running on port ${PORT}`));
    })
    .catch(err => console.error("DB connection error:", err));
