import express from "express";
import { createSubmission, deleteSubmission } from "../controller/submission.controller.js";
import { adminAuthentication } from "../middleware/authentication.js";

const router = express.Router();

router.post("/:formId/create", createSubmission);
router.delete("/:id/delete", adminAuthentication, deleteSubmission);

export default router;
