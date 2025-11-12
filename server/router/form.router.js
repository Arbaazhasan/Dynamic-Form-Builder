import express from "express";
import {
    createForm,
    deleteForm,
    getAllForms,
    getSingleForm,
    updateForm,
} from "../controller/form.controller.js";
import { adminAuthentication } from "../middleware/authentication.js";

const router = express.Router();

router.post("/create", adminAuthentication, createForm);
router.post("/update/:id", adminAuthentication, updateForm);

router.delete("/delete/:id", adminAuthentication, deleteForm);

router.get("/all", adminAuthentication, getAllForms);
router.get("/getform/:id", getSingleForm);

export default router;
