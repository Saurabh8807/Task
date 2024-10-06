import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken} from "../controllers/auth.controller"; 
import verifyJwt from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";
const router = Router();


router.post("/register", upload.fields([
    { name: "profilePic", maxCount: 1 },   
  ]), registerUser); 
router.post("/login", loginUser);
router.post("/logout", verifyJwt, logoutUser); 
router.post("/refresh-token", refreshAccessToken); 






export default router;
