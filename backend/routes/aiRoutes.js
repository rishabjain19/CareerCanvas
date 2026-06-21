const express = require("express");
const router = express.Router();
const { getResumeFeedback } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

router.post("/resume-feedback", protect, getResumeFeedback);

module.exports = router;
