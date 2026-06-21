const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// helper to sign a JWT for a given userId
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// shapes the user object sent back to the frontend — keeps register/login/profile responses consistent
const shapeUserResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  college: user.college,
  collegeYear: user.collegeYear,
  gpa: user.gpa,
  interests: user.interests,
  linkedin: user.linkedin,
  github: user.github,
  leetcode: user.leetcode,
  ...(token && { token }),
});

// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    // hash the password before saving — never store plain text
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json(shapeUserResponse(user, token));
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error during registration",
        error: error.message,
      });
  }
};

// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // password has select:false in the schema, so we explicitly request it here
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // deliberately same message as "user not found" — don't reveal which part was wrong
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json(shapeUserResponse(user, token));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(shapeUserResponse(user));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: error.message });
  }
};

// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    // whitelist exactly which fields are editable here — never trust the body wholesale,
    // otherwise someone could slip an `email` or `password` change through this route
    const { college, collegeYear, gpa, interests, linkedin, github, leetcode } =
      req.body;

    const user = await User.findByIdAndUpdate(
      req.userId, // from the verified JWT, not from the request body — same pattern as job ownership
      { college, collegeYear, gpa, interests, linkedin, github, leetcode },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(shapeUserResponse(user));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };
