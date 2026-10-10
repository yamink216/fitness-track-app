const ProgressPhoto = require("../models/ProgressPhoto");

const addProgressPhoto = async (req, res) => {
  try {
    const { imageUrl, type, date, weight, notes } = req.body;

    if (!imageUrl || !type) {
      return res.status(400).json({ message: "Image URL and photo type are required" });
    }

    const photo = await ProgressPhoto.create({
      user: req.userId,
      imageUrl,
      type,
      date: date || new Date(),
      weight: weight || 0,
      notes: notes || "",
    });

    res.status(201).json({ message: "Progress photo added successfully", photo });
  } catch (error) {
    console.error("Add progress photo error:", error);
    res.status(500).json({ message: "Server error saving progress photo" });
  }
};

const getProgressPhotos = async (req, res) => {
  try {
    const photos = await ProgressPhoto.find({ user: req.userId }).sort({ date: -1 });
    res.status(200).json({ count: photos.length, photos });
  } catch (error) {
    console.error("Get progress photos error:", error);
    res.status(500).json({ message: "Server error fetching progress photos" });
  }
};

const deleteProgressPhoto = async (req, res) => {
  try {
    const photo = await ProgressPhoto.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!photo) {
      return res.status(404).json({ message: "Progress photo not found" });
    }

    res.status(200).json({ message: "Progress photo deleted successfully" });
  } catch (error) {
    console.error("Delete progress photo error:", error);
    res.status(500).json({ message: "Server error deleting progress photo" });
  }
};

module.exports = {
  addProgressPhoto,
  getProgressPhotos,
  deleteProgressPhoto,
};
