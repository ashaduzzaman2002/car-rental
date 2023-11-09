import express from "express";

import { validedToken } from "../middleware/tokenValidation.js";
import { handleUploadError, upload } from "../middleware/fileUpload.js";
import { submitDocument, uploadDocumet } from "../controller/identity.js";

const router = express.Router();
router.put(
  "/document/upload",
  validedToken,
  upload.single("file"),
  handleUploadError,
  uploadDocumet
);
router.post("/document/submit", validedToken, submitDocument);

export default router;
