import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import api from "api/apiService";
import endpoints from "api/endpoints";
import { useAuth } from "context/AuthContext";
import { ROLES } from "constants/roles";

const DonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchDonations = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  // Prepare CSV data
  const csvData = donations.map(donation => ({
    "Donor": donation.donor_name,
    "Organization": donation.organization_name,
    "Donation Method": donation.donation_method,
    "Pickup Address": donation.donation_method === "pickup" ? donation.pickup_address : "N/A",
    "Pickup Time": donation.donation_method === "pickup" ? new Date(donation.pickup_time).toLocaleString() : "N/A",
    "Status": donation.status,
    "Total Items": donation.total_items,
    "Created At": new Date(donation.created_at).toLocaleString(),
    "Updated At": new Date(donation.updated_at).toLocaleString(),
    "Notes": donation.notes || "N/A"
  }));

  return (
    <div className="container py-5">
      <h2 className="mb-4">Donations</h2>
      <div className="d-flex justify-content-between mb-3">
        <div>
          {(user.role === ROLES.ADMIN || user.role === ROLES.DISTRIBUTOR) && (
            <CSVLink 
              data={csvData}
              filename={`donations_export_${new Date().toISOString().split('T')[0]}.csv`}
              className="btn btn-info me-2"
            >
              Export to CSV
            </CSVLink>
          )}
        </div>
        <div className="d-flex gap-2">
          {user.role === ROLES.ADMIN && (
            <Link to="/dashboard/admin/donations/create" className="btn btn-success">
              Create Donation
            </Link>
          )}

          {user.role === ROLES.DISTRIBUTOR && (
            <>
              <Link to="/dashboard/distributor/donations/distributions" className="btn btn-primary">
                View Distributions
              </Link>
              <Link to="/dashboard/distributor/donations/distribute" className="btn btn-primary">
                Distribute
              </Link>
            </>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {isLoading && <div className="text-center">Loading donations...</div>}

      <div className="table-responsive">
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
                <td>
                  <span className={`badge ${donation.status === 'approved' ? 'bg-success' : donation.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                    {donation.status}
                  </span>
                </td>
                <td>{donation.total_items}</td>
                <td>
                  <div className="d-flex flex-column gap-2">
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
            {donations.length === 0 && !isLoading && (
              <tr>
                <td colSpan="8" className="text-center">
                  No donations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsList;