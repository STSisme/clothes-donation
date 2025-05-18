import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/apiService";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDonate,
  faTruck,
  faHourglassHalf,
  faChartBar,
  faUserTie,
  faUsers,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import endpoints from "api/endpoints";

const RoleBasedStats = () => {
  const [stats, setStats] = useState({
    donated: 0,
    distributed: 0,
    pending: 0,
    totalDistributors: 0,
    totalDonors: 0,
    totalOrganizations: 0,
  });

  const { user } = useAuth();
  const userId = user ? user.id : null;

  useEffect(() => {
    if (!userId) return;

    const fetchUserStats = async () => {
      try {
        const userStats = {
          donated: 0,
          distributed: 0,
          pending: 0,
          totalDistributors: 0,
          totalDonors: 0,
          totalOrganizations: 0,
        };

        const donationResponse = await api.get(endpoints.donations.all);
        const userDonations = donationResponse.data;

        userDonations.forEach((donation) => {
          if (donation.status === "approved") userStats.donated++;
          if (donation.status.toLowerCase() === "distributed") userStats.distributed++;
          if (donation.status === "pending") userStats.pending++;
        });

        if (user.role === "admin") {
          const users = (await api.get(endpoints.users.all)).data;
          const organizations = (await api.get(endpoints.organizations.all)).data;

          users.forEach((user) => {
            if (user.role === "donor") userStats.totalDonors++;
            if (user.role === "distributor") userStats.totalDistributors++;
          });

          organizations.forEach((organization) => {
            userStats.totalOrganizations++;
          });
        }

        setStats(userStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchUserStats();
  }, [userId, user?.role]);

  const donationStatsData = [
    { name: "Donated", value: stats.donated },
    { name: "Distributed", value: stats.distributed },
    { name: "Pending", value: stats.pending },
  ];

  const userStatsData = [
    { name: "Donors", value: stats.totalDonors },
    { name: "Distributors", value: stats.totalDistributors },
    { name: "Organizations", value: stats.totalOrganizations },
  ];

  const COLORS = ["#007bff", "#28a745", "#ffc107", "#6c757d"];


  const StatCard = ({ icon, value, label, color }) => (
    <div className="col-md-4 mb-4">
      <div className={`card shadow border-start-${color} border-4`}>
        <div className="card-body d-flex align-items-center">
          <div className={`me-3 text-${color}`}>
            <FontAwesomeIcon icon={icon} size="2x" />
          </div>
          <div>
            <h5 className="mb-0">{value}</h5>
            <small className="text-muted">{label}</small>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="container py-5">
      <h2 className="mb-4">Current Stats</h2>
      <div className="row">
        {(user.role === "donor" || user.role === "admin") && (
          <StatCard
            icon={faDonate}
            value={stats.donated}
            label="Clothes Donated"
            color="primary"
          />
        )}

        <StatCard
          icon={faTruck}
          value={stats.distributed}
          label="Clothes Distributed"
          color="success"
        />

        {user.role === "donor" && (
          <StatCard
            icon={faHourglassHalf}
            value={stats.pending}
            label="Pending Donations"
            color="warning"
          />
        )}
      </div>

      {user.role === "admin" && (
        <>
          <div className="mt-5">
            <h4 className="mb-3">
              <FontAwesomeIcon icon={faChartBar} className="me-2 text-dark" />
              Admin Overview
            </h4>
            <ul className="list-group">
              <li className="list-group-item">Total Donated: {stats.donated}</li>
              <li className="list-group-item">Total Distributed: {stats.distributed}</li>
              <li className="list-group-item">Pending Donations: {stats.pending}</li>
            </ul>
          </div>

          <div className="row mt-4">
            <StatCard
              icon={faUserTie}
              value={stats.totalDistributors}
              label="Total Distributors"
              color="info"
            />
            <StatCard
              icon={faUsers}
              value={stats.totalDonors}
              label="Total Donors"
              color="secondary"
            />
            <StatCard
              icon={faBuilding}
              value={stats.totalOrganizations}
              label="Total Organizations"
              color="dark"
            />
          </div>

          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <h5 className="text-center">Donation Status Breakdown</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={donationStatsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {donationStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="col-md-6 mb-4">
              <h5 className="text-center">User & Org Distribution</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={userStatsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {userStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {user.role === "distributor" && (
        <div className="mt-5">
          <h4 className="mb-3">
            <FontAwesomeIcon icon={faChartBar} className="me-2 text-dark" />
            Distributor Overview
          </h4>
          <ul className="list-group">
            <li className="list-group-item">Clothes Distributed: {stats.distributed}</li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default RoleBasedStats;
