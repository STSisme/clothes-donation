import React from 'react';
import './Contact.css';

const ContactSupport = () => {
  return (
    <section className="contact-support-section">
      <h2>Contact & Support</h2>

      <div className="support-content">
        <div className="contact-info">
          <h3>Donor Support</h3>
          <p><strong>Email:</strong> support@donateclothes.org</p>
          <p><strong>Phone:</strong> +1 (800) 555-1234</p>
          <p><strong>Hours:</strong> Mon–Fri, 9am – 6pm</p>
        </div>

        <div className="chatbot-placeholder">
          <h3>Need Help Fast?</h3>
          <p>Use our chatbot or live chat for instant assistance.</p>
          <div className="chat-widget">
            {/* Integrate chatbot widget here */}
            <p>[ Chatbot / Live Chat Placeholder ]</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSupport;
