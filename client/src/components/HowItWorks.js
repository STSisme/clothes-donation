import React from "react";
import "./HowItWorks.css"; // Import CSS for styling

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <h2>🚀 How It Works</h2>
      <p>Follow these 4 simple steps to donate clothes and make an impact!</p>
      <div className="steps-container">
        <div className="step">
          <span className="icon">👤</span>
          <h3>Sign Up / Login</h3>
          <p>Create an account to track your donations.</p>
        </div>
        <div className="step">
          <span className="icon">👕</span>
          <h3>Donate Clothes</h3>
          <p>Choose clothing items & submit the form.</p>
        </div>
        <div className="step">
          <span className="icon">📊</span>
          <h3>Track Your Donation</h3>
          <p>Monitor your donation's journey.</p>
        </div>
        <div className="step">
          <span className="icon">🎁</span>
          <h3>Distribution & Impact</h3>
          <p>Clothes reach those in need.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
