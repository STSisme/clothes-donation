import React from 'react';
import AvailableClothes from '../../components/AvailableClothes';
import DonationHistory from '../../components/DonationHistory';
import AnalyticsReports from '../../components/AnalyticsReport';
import NotificationsCenter from '../../components/NotificationCenter';
import ProfileVerification from '../../components/ProfileVerification';
import './DistributorDashboard.css';
import Header from '../../components/header';

const DistributorDashboard = () => {
  return (
    <><Header />
    <section className="distributor-dashboard">
      <h2>Welcome, [Organization Name]</h2>
      <div className="quick-stats">
        <p>Total Donations Received: 100</p>
        <p>Clothes Distributed: 80</p>
        <p>Pending Donations: 20</p>
        <p>Impact Reached: 500 people</p>
      </div>
      <div className="tabs">
        <AvailableClothes />
        <DonationHistory />
        <AnalyticsReports />
        <NotificationsCenter />
        <ProfileVerification />
      </div>
    </section></>
  );
};

export default DistributorDashboard;
