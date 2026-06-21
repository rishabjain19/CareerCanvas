const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // creates a unique index — prevents duplicate accounts at the DB level
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never return password field by default on queries (extra safety on top of not sending it)
    },
    // --- optional profile fields, filled in later via the Profile page ---
    college: {
      type: String,
      trim: true,
      default: "",
    },
    collegeYear: {
      type: String, // e.g. "2nd Year", "Final Year" — kept as String for flexibility across course lengths
      trim: true,
      default: "",
    },
    gpa: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    interests: {
      type: String, // simple comma-separated free text, kept lightweight rather than a separate array+UI
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
    github: {
      type: String,
      trim: true,
      default: "",
    },
    leetcode: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  },
);

module.exports = mongoose.model("User", userSchema);
