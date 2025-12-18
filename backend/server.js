import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import { authenticateToken } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_SRV)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.log(" MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Authentication routes (public)
app.use("/auth", authRoutes);

// Item routes (protected)
app.use("/api/items", itemRoutes);

// Protected route example
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
