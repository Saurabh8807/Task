import { Router } from "express";
import { createTask, deleteTask, moveTask,getUserTasks,updateTask } from "../controllers/task.controller";
import verifyJwt from "../middleware/auth.middleware"; 

const router = Router();

router.use(verifyJwt);

router.post("/",verifyJwt, createTask);

router.get("/user",verifyJwt, getUserTasks);

router.delete("/:id",verifyJwt, deleteTask);

router.put("/move/:id/:direction",verifyJwt, moveTask); 

router.put("/:id", verifyJwt, updateTask);

export default router;
