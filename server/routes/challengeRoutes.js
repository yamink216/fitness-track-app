const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getChallenges, joinChallenge, leaveChallenge } = require("../controllers/challengeController");

router.get("/", protect, getChallenges);
router.post("/:id/join", protect, joinChallenge);
router.post("/:id/leave", protect, leaveChallenge);

module.exports = router;
