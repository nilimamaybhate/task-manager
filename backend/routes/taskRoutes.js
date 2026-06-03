import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/tasks", protect, (req, res) => {
  res.send("Protected route working");
});

export default router;