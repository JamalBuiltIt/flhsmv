import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./success.css"; // optional for styling

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // redirect to home after 5 seconds
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-container">
      <h1>✅ Payment Successful</h1>
    </div>
  );
}
