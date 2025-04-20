import React from "react";
import "./HowToDonate.css"; 

const HowToDonate = () => {
  const steps = [
    { id: 1, title: "Gather Clothes", description: "Collect gently used clothes that you want to donate.", icon: "🧥" },
    { id: 2, title: "Choose a Donation Center", description: "Find the nearest donation center or schedule a pickup.", icon: "📍" },
    { id: 3, title: "Pack & Drop Off", description: "Pack the clothes neatly and deliver them to the center.", icon: "📦" },
    { id: 4, title: "Make a Difference", description: "Your donation helps someone in need. Thank you!", icon: "❤️" },
  ];

  return (
    <section className="how-to-donate">
      <h2>How to Donate</h2>
      <div className="donation-steps">
        {steps.map((step) => (
          <div key={step.id} className="donation-step">
            <span className="icon">{step.icon}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowToDonate;
