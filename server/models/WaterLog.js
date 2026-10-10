const mongoose = require("mongoose");

const waterLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      enum: ["ml", "L"],
      default: "ml",
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    time: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

waterLogSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("WaterLog", waterLogSchema);
