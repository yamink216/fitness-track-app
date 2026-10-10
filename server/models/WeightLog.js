const mongoose = require("mongoose");

const weightLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    height: {
      type: Number,
      default: 0,
      min: 0,
    },
    bmi: {
      type: Number,
      default: 0,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
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

weightLogSchema.index({ user: 1, date: 1 });

weightLogSchema.pre("save", function () {
  if (this.height && this.height > 0 && this.weight) {
    const heightInMeters = this.height / 100;
    this.bmi = Number((this.weight / (heightInMeters * heightInMeters)).toFixed(2));
  } else {
    this.bmi = 0;
  }
});

module.exports = mongoose.model("WeightLog", weightLogSchema);
