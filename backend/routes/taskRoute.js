import express from "express"
import { addTask, getTask, removeTask, updateTask } from "../controllers/taskController.js"
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/addTask", requireAuth, addTask)
router.get("/getTask", requireAuth, getTask)
router.post("/removeTask", requireAuth, removeTask)
router.post("/updateTask", requireAuth, updateTask)

export default router;
