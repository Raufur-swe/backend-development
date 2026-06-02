import express from "express"
import { allTasks, CreateTask, deleteTask, updateTask } from "../controllers/task.controler.js";

const router = express.Router()

router.post("/", CreateTask);
router.patch("/:id",updateTask)
router.delete("/:id",deleteTask)
router.get("/",allTasks)
export default router;