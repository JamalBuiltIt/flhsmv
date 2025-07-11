const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

let storage = [];

app.post("/submit", (req, res) => {
  const { name, email, phone, subject, message, cardNumber, expirationDate, cvv } = req.body;

  if (
    typeof cardNumber === "string" &&
    cardNumber.length === 16 &&
    typeof expirationDate === "string" &&
    typeof cvv === "string" &&
    (cvv.length === 3 || cvv.length === 4)
  ) {
    // Handle payment form
    storage.push({ cardNumber, expirationDate, cvv });
    console.log("Stored Payment Info:", storage);
    return res.status(200).json({ message: "Payment data stored successfully" });
  }

  if (name && email && phone && subject && message) {
    // Handle contact form
    storage.push({ name, email, phone, subject, message });
    console.log("Stored Contact Info:", storage);
    return res.status(200).json({ message: "Contact data stored successfully" });
  }

  // If neither form matches, reject it
  res.status(400).json({ message: "Invalid or incomplete data submitted." });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get("/data", (req, res) => {
  res.json(storage);
});

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Viewer app connected successfully!" });
});


