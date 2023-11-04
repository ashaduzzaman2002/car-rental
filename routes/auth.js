import express from "express";
import { getUser, sendOtp, userLogin, userLogout, userSignup, updateProfile, updateNumber } from "../controller/auth.js";
import {
  OTPInputValidation,
  userLoginInputValidation,
  userSignupInputValidation,
  editProfileInputvalidation
} from "../middleware/inputvalidation.js";
import { validedToken } from "../middleware/tokenValidation.js";
import { checkImageUpload, upload } from "../middleware/fileUpload.js";

const router = express.Router();

router.get("/profile", validedToken, getUser);
router.post("/otp", OTPInputValidation, sendOtp)
router.post("/signup", userSignupInputValidation, userSignup);
router.post("/login", userLoginInputValidation, userLogin);
router.get("/logout", validedToken, userLogout);
router.put("/update/number", validedToken, editProfileInputvalidation, updateNumber);
router.put("/update/profile", validedToken, upload.single("file"), updateProfile);

export default router;
