import { Router } from "express";
import { 
    getUserById,
    getAllUsers,
    updateUserById,
    deleteUserById
} from "../controllers/user.controller"; 
import verifyJwt from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware"; 

const router = Router();


router.get("/", getAllUsers); 

router.get("/:id", getUserById); 

router.put("/:id", upload.fields([
    { name: "profilePic", maxCount: 1 },   
  ]), updateUserById); 

router.delete("/:id", deleteUserById); 

export default router;
