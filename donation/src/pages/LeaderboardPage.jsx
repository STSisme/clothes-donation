import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "api/apiService";
import endpoints from "api/endpoints";

const LeaderboardPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get(endpoints.donations.leaderboard);
        setDonors(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">🏆 Donor Leaderboard</h1>
        <p className="text-muted">Celebrating our top contributors!</p>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow border-0 rounded-4">
          <div className="card-body p-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th scope="col" className="text-center">#</th>
                  <th scope="col">Donor Name</th>
                  <th scope="col" className="text-end">Points</th>
                </tr>
              </thead>
              <tbody>
                {donors.length > 0 ? (
                  donors.map((donor, index) => (
                    <tr key={donor.id}>
                      <td className="text-center fw-bold">{index + 1}</td>
                      <td className="fw-semibold">{donor.name}</td>
                      <td className="text-end fw-bold text-primary">{donor.points} pts</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No donors yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-center mt-4 text-muted">
        <small>Thank you for supporting our cause ❤️</small>
      </div>
    </div>
  );
};

export default LeaderboardPage;
