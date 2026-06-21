require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// connect to MongoDB
connectDB();

// middleware
app.use(cors()); // allows the frontend (different origin) to call this API
// default express.json() limit is 100kb — way too small for a base64-encoded resume
// image/PDF, so we raise it to 10mb to match the frontend's MAX_FILE_SIZE_MB
app.use(express.json({ limit: "10mb" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ai", aiRoutes);

// simple health check route — useful to confirm the deployed backend is alive
app.get("/", (req, res) => {
  res.send("CareerCanvas API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
