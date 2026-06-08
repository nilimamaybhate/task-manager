import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  editTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.get("/", protect, getTasks);
router.delete("/:id",protect,deleteTask);
router.put("/edit/:id",protect, editTask);

export default router;