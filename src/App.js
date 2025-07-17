import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FLHSMVPage from './home';
import Home1 from './home1';
import Success from './success';
import './App.css'; // Add animation styles here

function App() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("paymentSuccess") === "true") {
      setShowSuccess(true);

      // Trigger fade-out before removing
      const fadeTimer = setTimeout(() => setFadeOut(true), 3000); // start fade-out
      const removeTimer = setTimeout(() => {
        setShowSuccess(false);
        setFadeOut(false);
        localStorage.removeItem("paymentSuccess");
      }, 4000); // fully hide after 4s

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <FLHSMVPage />
                {showSuccess && (
                  <div className={`success-wrapper ${fadeOut ? 'fade-out' : 'fade-in'}`}>
                    <Success />
                  </div>
                )}
              </>
            }
          />
          <Route path="/home1" element={<Home1 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
