
import express from "express";
import {
    createField,
    deleteField,
    updateField,
} from "../controller/field.controller.js";
import { adminAuthentication } from "../middleware/authentication.js";

const router = express.Router();

router.post("/:formId/create", adminAuthentication, createField);
router.put("/:id/update", adminAuthentication, updateField);
router.delete("/:id/delete", adminAuthentication, deleteField);

export default router;
