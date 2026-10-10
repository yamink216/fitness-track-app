const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addProgressPhoto,
  getProgressPhotos,
  deleteProgressPhoto,
} = require("../controllers/progressPhotoController");

router.post("/", protect, addProgressPhoto);
router.get("/", protect, getProgressPhotos);
router.delete("/:id", protect, deleteProgressPhoto);

module.exports = router;
