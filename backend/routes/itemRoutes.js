import express from "express";
import Item from "../models/Item.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all items for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.userId }).sort({
      dateAdded: -1,
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single item by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Check if item belongs to authenticated user
    if (item.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new item
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, category, price, description, color, size, brand, imageUrl } =
      req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const item = new Item({
      userId: req.user.userId,
      name,
      category,
      price,
      description,
      color,
      size,
      brand,
      imageUrl,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE item
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Check if item belongs to authenticated user
    if (item.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update fields
    const { name, category, price, description, color, size, brand, imageUrl } =
      req.body;

    if (name) item.name = name;
    if (category) item.category = category;
    if (price !== undefined) item.price = price;
    if (description !== undefined) item.description = description;
    if (color !== undefined) item.color = color;
    if (size !== undefined) item.size = size;
    if (brand !== undefined) item.brand = brand;
    if (imageUrl !== undefined) item.imageUrl = imageUrl;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE item
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Check if item belongs to authenticated user
    if (item.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;