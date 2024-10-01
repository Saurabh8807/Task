import { Router } from "express";
import { createTask, deleteTask, moveTask,getUserTasks } from "../controllers/task.controller";
import verifyJwt from "../middleware/auth.middleware"; 

const router = Router();

router.use(verifyJwt);

router.post("/", createTask);

router.get("/user", getUserTasks);

router.delete("/:id", deleteTask);

router.put("/move/:id/:direction", moveTask); 

export default router;
