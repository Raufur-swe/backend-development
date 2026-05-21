import express from "express"
import { CreateTask, deleteTask, updateTask } from "../controllers/task.controler.js";

const router = express.Router()

router.post("/", CreateTask);
router.patch("/:id",updateTask)
router.delete("/:id",deleteTask)
export default router;