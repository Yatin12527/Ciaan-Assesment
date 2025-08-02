import express from "express";
import { signup,login,callback,googleLogin,logout} from "../controllers/authController.js";
const router=express.Router();

router.post("/signup",signup );
router.post("/login",login);
router.get("/google",googleLogin);
router.get("/callback/google", callback);
router.post("/logout", logout);
export default router;