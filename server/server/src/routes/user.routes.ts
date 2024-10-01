import { Router } from "express";
import { 
    getUserById,
    getAllUsers,
    updateUserById,
    deleteUserById
} from "../controllers/user.controller"; 
import verifyJwt from "../middleware/auth.middleware";

const router = Router();


router.get("/", getAllUsers); 

router.get("/:id", getUserById); 

router.put("/:id", updateUserById); 

router.delete("/:id", deleteUserById); 

export default router;
