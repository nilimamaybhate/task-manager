import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.get("/", protect, getTasks);
router.delete("/:id",protect,deleteTask);

export default router;