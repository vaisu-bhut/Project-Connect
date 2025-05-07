const express = require("express");
const cookieParser = require("cookie-parser");
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
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080", "https://connect.vasubhut.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
app.use(cookieParser());

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

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));