const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const serverless = require("serverless-http");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const authMiddleware = require("./middleware/auth");

const app = express();

// Middleware

// app.use((req, res, next) => {
//   // Skip GET/HEAD/DELETE/OPTIONS requests without content
//   if (
//     ["GET", "HEAD", "DELETE", "OPTIONS"].includes(req.method) &&
//     !req.headers["content-length"]
//   ) {
//     return next();
//   }

//   const chunks = [];
//   req.on("data", (chunk) => chunks.push(chunk));
//   req.on("end", () => {
//     if (chunks.length === 0) {
//       req.body = {};
//       return next();
//     }

//     const buffer = Buffer.concat(chunks);
//     req.rawBody = buffer.toString("utf8");

//     // Only attempt JSON parse for JSON content types or if body exists
//     if (
//       req.headers["content-type"]?.includes("application/json") ||
//       req.rawBody.trim().startsWith("{") ||
//       req.rawBody.trim().startsWith("[")
//     ) {
//       try {
//         req.body = JSON.parse(req.rawBody);
//         next();
//       } catch (e) {
//         console.error("JSON Parse Error:", e);
//         res.status(400).json({
//           error: "Invalid JSON",
//           received: req.rawBody,
//           message: e.message,
//         });
//       }
//     } else {
//       req.body = req.rawBody;
//       next();
//     }
//   });
// });

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://connect.vasubhut.com"    
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ['Set-Cookie']
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  next();
});

app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log("Incoming Request:", {
//     method: req.method,
//     path: req.path,
//     body: req.body, // Will now show parsed JSON
//     headers: req.headers,
//   });
//   next();
// });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/reminders", reminderRoutes);

// Protected route example
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.userId });
});

app.get("/api", (req, res) => {
  res.status(200).json({ message: "This Server(Project Connect) is Live!!!" });
});

// Error handling for malformed JSON
// app.use((err, req, res, next) => {
//   if (err.message === 'Invalid JSON') {
//     return res.status(400).json({ error: 'Invalid JSON format' });
//   }
//   console.error('Server Error:', err);
//   res.status(500).json({ error: 'Internal Server Error' });
// });

// app.post("/api/debug-json", (req, res) => {
//   res.json({
//     success: true,
//     bodyType: typeof req.body,
//     body: req.body,
//     rawBody: req.rawBody,
//     headers: req.headers,
//   });
// });

// Connect to database
connectDB();

const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));

// module.exports.handler = serverless(app);
// // Keep this for local development
// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT;
//   app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
// }
