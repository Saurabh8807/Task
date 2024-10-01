import { Router } from "express";
import { registerUser,loginUser} from "../controllers/auth.controller"; 
import verifyJwt from "../middleware/auth.middleware";
import { logoutUser } from "../controllers/auth.controller";
import { upload } from "../middleware/multer.middleware"; // Import the multer middleware

const router = Router();


router.post("/register", upload.fields([
    { name: "profilePic", maxCount: 1 },   
  ]), registerUser); 
router.post("/login", loginUser);
router.post("/logout", verifyJwt, logoutUser); 





export default router;
