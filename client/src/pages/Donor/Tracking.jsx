import React, { useState } from 'react';
import Header from "../../components/header";
import Banner from "../../components/Banner";
import Footer from "../../components/Footer";
import './Tracking.css';
import DonationHistory from '../../components/DonationHistory';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';



// Sample images
import trackerImg from '../../images/charity-donating-clothes-concept-box-600nw-2051843177.png';
import impactImg from '../../images/charity-donating-clothes-concept-box-600nw-2051843177.png';
import feedbackImg from '../../images/flat-donation-clothes-vector-26064982.jpg';
import shareImg from '../../images/iStock-1362787530-1_11zon.png';
import calltoactionImg from '../../images/Where-to-Donate-Clothes-in-Metro-Manila-to-Freshen-Up-Your-Wardrobe.png';

const TrackingAndReportingPage = () => {
  const [filter, setFilter] = useState({
    region: '',
    donationType: '',
    timeline: '',
  });

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert("Feedback submitted! Thank you.");
  };

  return (
    <>
      <Header />
      <div className="tracking-reporting-page">
        
        {/* 1. Real-Time Donation Tracker */}
        <section className="section">
          <h2 className="section-heading">🗺️ Real-Time Donation Tracker</h2>
          <img src={trackerImg} alt="Donation Tracker" className="section-img" />
          <div className="filters">
            <select name="region" onChange={handleFilterChange} className="dropdown">
              <option value="">Filter by Region</option>
              <option value="city">City</option>
              <option value="district">District</option>
            </select>
            <select name="donationType" onChange={handleFilterChange} className="dropdown">
              <option value="">Clothes Type</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="winterwear">Winterwear</option>
              <option value="traditional">Traditional</option>
              <option value="accessories">Accessories</option>
            </select>
            <select name="timeline" onChange={handleFilterChange} className="dropdown">
              <option value="">Timeline</option>
              <option value="24h">Last 24 Hours</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="map-container">
            <MapContainer center={[27.7172, 85.3240]} zoom={12} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Sample markers - you can load dynamic markers later */}
                <Marker position={[27.7172, 85.3240]}>
                <Popup>Donation received in Kathmandu</Popup>
                </Marker>
                <Marker position={[28.2096, 83.9856]}>
                <Popup>Donation center in Pokhara</Popup>
                </Marker>
            </MapContainer>
          </div>

        </section>

        {/* 2. Donation History */}
        <DonationHistory />

        {/* 3. Donation Impact Reports */}
        <section className="section">
          <h2 className="section-heading">📊 Donation Impact Reports</h2>
          <img src={impactImg} alt="Impact Reports" className="section-img" />
          <div className="grid">
            <div className="card">
              <h3>Total Donations</h3>
              <p className="stat">50,000 items</p>
            </div>
            <div className="card">
              <h3>Regions Served (Heatmap)</h3>
              <div className="placeholder">Heatmap Placeholder</div>
            </div>
            <div className="card">
              <h3>Types of Donations</h3>
              <div className="placeholder">Pie Chart Placeholder</div>
            </div>
            <div className="card">
              <h3>Donation Timeline</h3>
              <div className="placeholder">Line Graph Placeholder</div>
            </div>
          </div>
        </section>

        {/* 4. Feedback & Reviews */}
        <section className="section">
          <h2 className="section-heading">📝 Feedback & Reviews</h2>
          <img src={feedbackImg} alt="Feedback" className="section-img" />
          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            <label>Rate your experience:</label>
            <select name="rating" className="dropdown">
              <option>1 Star</option>
              <option>2 Stars</option>
              <option>3 Stars</option>
              <option>4 Stars</option>
              <option>5 Stars</option>
            </select>
            <textarea
              maxLength={500}
              className="textarea"
              placeholder="Tell us about your experience (max 500 characters)"
            ></textarea>
            <label>Would you donate again?</label>
            <select name="wouldDonateAgain" className="dropdown">
              <option>Yes</option>
              <option>No</option>
            </select>
            <button type="submit" className="submit-btn">Submit Feedback</button>
          </form>

          <div className="recent-feedback">
            <h3>Recent Feedback</h3>
            <div className="feedback-item">
              ⭐⭐⭐⭐ – “Very smooth process, I got updates on where my clothes went!”
            </div>
            <div className="feedback-item">
              ⭐⭐⭐⭐⭐ – “Happy to help, would love to volunteer too.”
            </div>
          </div>
        </section>

        {/* 5. Impact Visualization */}
        <section className="section">
          <h2 className="section-heading">📈 Donation Impact Visualization</h2>
          <div className="grid">
            <div className="card">
              <h3>Families Helped</h3>
              <p className="stat">500 families helped with 10,000 items</p>
              <div className="placeholder">Donut Chart Placeholder</div>
            </div>
            <div className="card">
              <h3>Distribution by Demographics</h3>
              <div className="placeholder">Bar Chart Placeholder</div>
            </div>
          </div>
        </section>

        {/* 6. Social Sharing and Downloads */}
        <section className="section">
          <h2 className="section-heading">📢 Share & Download</h2>
          <img src={shareImg} alt="Social Sharing" className="section-img" />
          <div className="button-group">
            <button className="social-btn facebook">Share on Facebook</button>
            <button className="social-btn twitter">Tweet</button>
            <button className="social-btn instagram">Share on Instagram</button>
            <button className="social-btn gray">Download PDF Report</button>
            <button className="social-btn green">Subscribe to Impact Emails</button>
          </div>
        </section>

        {/* 7. Call to Action */}
        <section className="cta-section">
        <h2 className="section-heading">🚀 Ready to Make More Impact?</h2>
        <img src={calltoactionImg} alt="Call to Action" className="section-img" />
        <div className="button-group">
            <button className="cta-btn donate">Donate Again</button>
            <button className="cta-btn join">Join the Movement</button>
        </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default TrackingAndReportingPage;
