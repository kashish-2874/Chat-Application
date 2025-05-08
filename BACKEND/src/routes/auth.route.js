const express = require("express");
const { signup, login, logout, checkAuth, updateProfile, forgotPassword, resetPassword, verifyOtp } = require("../controllers/auth.controller");
const {protectRoute} = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.put("/update-profile",protectRoute , updateProfile );

router.get("/check",protectRoute,checkAuth);

router.post("/forgot-password",forgotPassword);

router.post("/verifyOtp",verifyOtp);

router.post("/reset-password",resetPassword);

module.exports =  router;