const mongoose = require("mongoose");

const progressPhotoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Front", "Side", "Back"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    weight: {
      type: Number,
      min: 0,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

progressPhotoSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("ProgressPhoto", progressPhotoSchema);
