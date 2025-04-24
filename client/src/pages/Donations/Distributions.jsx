import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "api/apiService";
import endpoints from "api/endpoints";
import { useAuth } from "context/AuthContext";
import { ROLES } from "constants/roles";

const Distributions = () => {
  const [distributions, setDistributions] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchDistributions = async () => {
    setError("");
    try {
      const response = await api.get(endpoints.distributions.all(user.id));
      setDistributions(response.data);
    } catch (err) {
      setError("Failed to fetch distributions.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDistributions();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Distributions</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Distributed To</th>
            <th>Recipient Info / Disaster ID</th>
            <th>Distribution Date</th>
            <th>Donation Method</th>
            <th>Donation Note</th>
            <th>Total Items of Donations</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {distributions.map((dist) => (
            <tr key={dist.distribution_id}>
              <td>{dist.distributed_to}</td>
              <td>
                {dist.distributed_to === "disaster" ? (
                  <>Disaster ID: {dist.disaster_id}</>
                ) : (
                  <>
                    {dist.recipient_name} <br />
                    {dist.recipient_contact} <br />
                    {dist.recipient_address}
                  </>
                )}
              </td>
              <td>{new Date(dist.distribution_date).toLocaleString()}</td>
              <td>{dist.donation.donation_method}</td>
              <td>{dist.donation.donation_note}</td>
              <td>{dist.items.length}</td>
              <td>
                <Link
                  to={`/dashboard/distributor/distributions/view/${dist.distribution_id}`}
                  className="btn btn-sm btn-info"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
          {distributions.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No distributions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Distributions;
