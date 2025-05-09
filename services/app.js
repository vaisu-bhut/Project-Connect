const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

// Middleware
const app = express();
app.use((req, res, next) => {
  if (
    ["GET", "HEAD", "DELETE", "OPTIONS"].includes(req.method) &&
    !req.headers["content-length"]
  ) {
    return next();
  }

  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    if (chunks.length === 0) {
      req.body = {};
      return next();
    }

    const buffer = Buffer.concat(chunks);
    req.rawBody = buffer.toString("utf8");

    // Only attempt JSON parse for JSON content types or if body exists
    if (
      req.headers["content-type"]?.includes("application/json") ||
      req.rawBody.trim().startsWith("{") ||
      req.rawBody.trim().startsWith("[")
    ) {
      try {
        req.body = JSON.parse(req.rawBody);
        next();
      } catch (e) {
        console.error("JSON Parse Error:", e);
        res.status(400).json({
          error: "Invalid JSON",
          received: req.rawBody,
          message: e.message,
        });
      }
    } else {
      req.body = req.rawBody;
      next();
    }
  });
});

app.use(
  cors({
    origin: ["http://localhost:8080", "https://connect.vasubhut.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Routes
app.get("/api", (req, res) => {
  res.status(200).json({ message: "This Server(Project Connect) is Live!!!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/reminders", reminderRoutes);

// Connect to database
connectDB();

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Local server listening on port ${PORT}`);
  });
}

module.exports = app;