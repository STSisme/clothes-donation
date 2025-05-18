import React from 'react';

const AboutUs = () => {
  return (
    <section className="container py-5">
      <h2 className="text-center mb-5 fw-bold">About Us</h2>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h4 className="card-title mb-3">Our Mission</h4>
              <p className="card-text">
                We are dedicated to promoting sustainability and kindness through clothing donations,
                thrifting, recycling, and rentals. Our platform connects donors, sellers, and organizations
                to give clothes a second life and reduce environmental waste.
              </p>

              <h4 className="card-title mt-4 mb-3">Our Story</h4>
              <p className="card-text">
                Founded in 2024, we started as a small initiative among friends who believed in making a
                difference. Today, we have grown into a trusted community platform, partnering with local
                organizations and thousands of volunteers to make positive change happen — one garment at a time.
              </p>

              <h4 className="card-title mt-4 mb-3">What We Do</h4>
              <ul className="list-unstyled">
                <li className="mb-2">🌱 Encourage sustainable fashion habits.</li>
                <li className="mb-2">🤝 Connect donors, sellers, and organizations.</li>
                <li className="mb-2">♻️ Promote recycling and reducing textile waste.</li>
                <li className="mb-2">👚 Provide affordable clothing options for all.</li>
              </ul>

              <div className="text-center mt-5">
                <a href="/contact" className="btn btn-primary btn-lg">
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
