import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  faHandHoldingHeart,
  faClipboardList,
  faUserCircle,
  faUsersCog,
  faChartBar,
  faExclamationTriangle,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';

import DonationStats from 'components/DonationStats';
import { useAuth } from 'context/AuthContext';
import DisasterRelief from 'components/DisataserRelief';
import DashboardCard from 'components/DashboardCard';
import { ROLES } from 'constants/roles';
import Banner from 'components/Banner';

const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  return (
    <>
    <Banner/>
      <section className="dashboard container py-5">
        <h1 className="text-center mb-4">Welcome, {user?.full_name || 'User'}!</h1>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {role === ROLES.DONOR && (
            <>
              <DashboardCard
                icon={faHandHoldingHeart}
                color="primary"
                title="Make a Donation"
                description="Start a new clothes donation."
                onClick={() => navigate('/dashboard/donor/donations/donate')}
              />
              <DashboardCard
                icon={faClipboardList}
                color="success"
                title="My Donations"
                description="Track and view your past donations."
                onClick={() => navigate('/dashboard/donor/donations')}
              />
            </>
          )}

          <DashboardCard
            icon={faUserCircle}
            color="info"
            title="My Profile"
            description="Update your profile info and preferences."
            onClick={() => navigate(`/profile/${role}`)}
          />

          {role === ROLES.DISTRIBUTOR && (
            <>
              <DashboardCard
                icon={faExclamationTriangle}
                color="warning"
                title="Disaster Relief"
                description="Manage clothes for relief campaigns."
                onClick={() => navigate('/dashboard/distributor/disasters')}
              />
              <DashboardCard
                icon={faClipboardList}
                color="success"
                title="Assigned Donations"
                description="Track donations assigned to you."
                onClick={() => navigate('/dashboard/distributor/donations')}
              />
              <DashboardCard
                icon={faBoxOpen}
                color="info"
                title="Distributions Made"
                description="View your distributed donation history."
                onClick={() => navigate('/dashboard/distributor/distributions')}
              />
            </>
          )}

          {role === ROLES.ADMIN && (
            <>
              <DashboardCard
                icon={faChartBar}
                color="secondary"
                title="Admin Stats"
                description="Overview of donations, users and organizations."
                onClick={() => navigate('/dashboard/admin/stats')}
              />
              <DashboardCard
                icon={faUsersCog}
                color="dark"
                title="Manage Users"
                description="Create, verify or remove users."
                onClick={() => navigate('/dashboard/admin/users')}
              />
            </>
          )}
        </div>
      </section>

      {role === 'donor' && (
        <>
          <DonationStats />
          <DisasterRelief />
        </>
      )}
    </>
  );
};

export default Dashboard;
