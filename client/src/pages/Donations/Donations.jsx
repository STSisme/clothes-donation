import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "api/apiService";
import endpoints from "api/endpoints";
import { useAuth } from "context/AuthContext";
import { ROLES } from "constants/roles";

const DonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchDonations = async () => {
    setError("");
    try {
      let response = "";

      if (user.role === ROLES.DONOR) {
        response = await api.get(endpoints.donations.getAllByDonor(user.id));
      } else if (user.role === ROLES.DISTRIBUTOR) {
        response = await api.get(endpoints.donations.getAllByOrganization(user.organization_id));
      } else {
        response = await api.get(endpoints.donations.all);
      }

      setDonations(response.data);
    } catch (err) {
      setError("Failed to fetch donations.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;

    try {
      await api.delete(endpoints.donations.delete(id));
      setDonations((prev) => prev.filter((donation) => donation.id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete donation.");
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await api.put(endpoints.donations.approve(id));
      const updatedDonation = res.data;

      setDonations((prev) =>
        prev.map((donation) =>
          donation.id === id ? { ...donation, status: updatedDonation.status } : donation
        )
      );
      setError("");
    } catch (err) {
      setError("Failed to approve donation.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Donations</h2>
      <div className="d-flex justify-content-end mb-3">

        {user.role === ROLES.ADMIN && (
          <Link to="/dashboard/admin/donations/create" className="btn btn-success">
            Create Donation
          </Link>
        )}

        {user.role === ROLES.DISTRIBUTOR && (
          <>
            <Link to={'/dashboard/distributor/donations/distributions '} className="btn btn-sm btn-primary me-3">
              View Distributions
            </Link>
            <Link to={'/dashboard/distributor/donations/distribute '} className="btn btn-sm btn-primary m-0">
              Distribute
            </Link>
          </>

        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Donor</th>
            <th>Organization</th>
            <th>Donation Method</th>
            <th>Pickup Address</th>
            <th>Pickup Time</th>
            <th>Donation Status</th>
            <th>Total Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td>{donation.donor_name}</td>
              <td>{donation.organization_name}</td>
              <td>{donation.donation_method}</td>
              {donation.donation_method === "pickup" ? (
                <>
                  <td>{donation.pickup_address || "N/A"}</td>
                  <td>{donation.pickup_time ? new Date(donation.pickup_time).toLocaleString() : "N/A"}</td>
                </>
              ) : (
                <>
                  <td>N/A</td>
                  <td>N/A</td>
                </>
              )}
              <td>{donation.status}</td>
              <td>{donation.total_items}</td>
              <td>
                <div className="d-flex justify-content-center flex-column gap-2">
                  <Link
                    to={`/dashboard/donations/view/${donation.id}`}
                    className="btn btn-sm btn-info"
                  >
                    View
                  </Link>

                  {user.role === ROLES.DISTRIBUTOR && donation.status === 'pending' && (
                    <button onClick={() => handleApprove(donation.id)} className="btn btn-sm btn-success m-0">
                      Approve
                    </button>
                  )}

                  {user.role === ROLES.ADMIN && (
                    <>
                      <Link to={`/dashboard/admin/donations/update/${donation.id}`} className="btn btn-sm btn-primary">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(donation.id)}
                        className="btn btn-sm btn-danger m-0"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {donations.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center">
                No donations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DonationsList;
