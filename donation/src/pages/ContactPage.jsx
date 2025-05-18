import React from 'react';

const ContactSupport = () => {
  return (
    <section className="container py-5">
      <h2 className="text-center mb-5 fw-bold">Contact & Support</h2>

      <div className="row justify-content-center">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="card-title mb-3">Donor Support</h4>
              <p><strong>Email:</strong> support@donateclothes.org</p>
              <p><strong>Phone:</strong> +1 (800) 555-1234</p>
              <p><strong>Hours:</strong> Mon–Fri, 9am – 6pm</p>
            </div>
          </div>
        </div>

        <div className="col-md-5 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="card-title mb-3">Need Help Fast?</h4>
              <p>Use our chatbot or live chat for instant assistance.</p>
              <div className="border rounded p-3 text-center text-muted">
                [ Chatbot / Live Chat Placeholder ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSupport;
