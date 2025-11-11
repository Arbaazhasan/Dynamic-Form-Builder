import express from "express";
import { loginAdmin, logoutAdmin, registerAdmin } from "../controller/admin.auth.controller.js";

const router = express.Router();


router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/logout", logoutAdmin);


export default router;