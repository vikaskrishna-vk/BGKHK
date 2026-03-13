const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.post("/chat", aiController.chat);
router.post("/resume", aiController.resumeAnalyze);
router.post("/interview", aiController.mockInterview);
router.post("/roadmap", aiController.careerRoadmap);
router.post("/skillgap", aiController.skillGap);

module.exports = router;