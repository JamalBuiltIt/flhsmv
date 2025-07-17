import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FLHSMVPage from './home';      // your form component
import Home1 from './home1';         // page to redirect to after form submission
import Success from './success';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<FLHSMVPage />} />
          <Route path="/home1" element={<Home1 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
