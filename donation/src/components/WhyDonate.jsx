import React from "react";
import "./WhyDonate.css"; 

const WhyDonate = () => {
  const reasons = [
    { id: 1, title: "Help Those in Need", description: "Many people lack proper clothing, especially during extreme weather conditions.", icon: "🤝" },
    { id: 2, title: "Reduce Waste", description: "Reusing clothes helps reduce textile waste and protect the environment.", icon: "🌍" },
    { id: 3, title: "Support Charities", description: "Your donations support NGOs and community centers helping the underprivileged.", icon: "🏡" },
    { id: 4, title: "Make a Social Impact", description: "Every small act of kindness can make a big difference in someone's life.", icon: "💙" },
  ];

  return (
    <section className="why-donate">
      <h2>Why Donate?</h2>
      <div className="reasons-container">
        {reasons.map((reason) => (
          <div key={reason.id} className="reason">
            <span className="icon">{reason.icon}</span>
            <h3>{reason.title}</h3>
            <p>{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyDonate;
